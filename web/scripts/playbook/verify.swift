import Foundation
import PDFKit
import CryptoKit

struct Play: Decodable {
    let title: String, endorsers: String, why: String, steps: [String], quote: String, speaker: String
    var fields: [String] { [title, endorsers, why, quote, speaker] + steps }
}
struct Content: Decodable {
    let title: String, subtitle: String, credit: String, adaptation: String, introduction: String
    let workflow: [String], plays: [Play], checklist: [String]
}
func normalized(_ value: String) -> String {
    value.components(separatedBy: .whitespacesAndNewlines).joined()
}
func document(_ path: String) -> PDFDocument {
    guard let result = PDFDocument(url: URL(fileURLWithPath: path)) else { fatalError("PDF unreadable: \(path)") }
    return result
}
let directory = URL(fileURLWithPath: #filePath).deletingLastPathComponent()
let content = try JSONDecoder().decode(Content.self, from: Data(contentsOf: directory.appendingPathComponent("content.json")))
let path = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : directory.appendingPathComponent("../../public/library/keyword-research/keyword-research-playbook.pdf").standardizedFileURL.path
let pdf = document(path)
precondition(pdf.pageCount == 8, "Expected 8 pages")
var allText = "", urls: [String] = [], pageCharacters: [Int] = []
for index in 0..<pdf.pageCount {
    guard let page = pdf.page(at: index), let text = page.string else { fatalError("Missing text on page \(index + 1)") }
    precondition(text.count > 200, "Unexpectedly empty page \(index + 1)")
    precondition(text.contains("SearchCrew"), "Unbranded page \(index + 1)")
    precondition(page.bounds(for: .mediaBox).size == CGSize(width: 612, height: 792), "Incorrect page dimensions")
    allText += text + "\n"; pageCharacters.append(text.count)
    for annotation in page.annotations {
        guard let url = annotation.url else { continue }
        precondition(url.scheme == "https" && url.host == "searchcrew.ai", "Non-SearchCrew link")
        precondition(page.bounds(for: .mediaBox).contains(annotation.bounds), "Link outside page")
        urls.append(url.absoluteString)
    }
}
let metadata = String(describing: pdf.documentAttributes)
precondition(!(allText + metadata + urls.joined()).localizedCaseInsensitiveContains("openseo"), "Old branding remains")
precondition(Set(urls) == Set(["https://searchcrew.ai/", "https://searchcrew.ai/features/keyword-research", "https://searchcrew.ai/get-started"]), "Missing or unexpected links")
let normalizedText = normalized(allText)
let fields = [content.title, content.subtitle, content.credit, content.adaptation, content.introduction] + content.workflow + content.checklist + content.plays.flatMap(\.fields)
for field in fields { precondition(normalizedText.contains(normalized(field)), "Missing source field: \(field)") }
var originalCheck = "not requested"
if CommandLine.arguments.count > 2 {
    let original = document(CommandLine.arguments[2])
    let originalText = normalized((0..<original.pageCount).compactMap { original.page(at: $0)?.string }.joined(separator: "\n"))
    for field in content.plays.flatMap(\.fields) {
        precondition(originalText.contains(normalized(field)), "Play content diverged from original: \(field)")
    }
    precondition(originalText.contains(normalized(content.credit)), "Original curator credit mismatch")
    originalCheck = "all 8 plays: titles, endorsers, rationale, steps, quotations and speaker credits match original after whitespace normalization"
}
let digest = SHA256.hash(data: try Data(contentsOf: URL(fileURLWithPath: path))).map { String(format: "%02x", $0) }.joined()
let evidence: [String: Any] = ["status": "pass", "pages": pdf.pageCount, "pageTextCharacters": pageCharacters,
    "editableSourceFieldsVerified": fields.count, "oldBrandOccurrences": 0, "clickableLinks": urls,
    "originalContentComparison": originalCheck, "sha256": digest,
    "limitations": ["Visual review and original-content comparison are separate from checking historical practitioner claims.", "No production deployment or current hosted-account availability is certified."]]
let data = try JSONSerialization.data(withJSONObject: evidence, options: [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes])
if CommandLine.arguments.count > 3 { try data.write(to: URL(fileURLWithPath: CommandLine.arguments[3])) }
print(String(decoding: data, as: UTF8.self))
