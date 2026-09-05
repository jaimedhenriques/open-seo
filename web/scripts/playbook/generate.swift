import AppKit
import PDFKit

// Native, editable text and vector shapes. No screenshot regeneration or new dependencies.
struct Play: Decodable {
    let title: String, endorsers: String, why: String, steps: [String], quote: String, speaker: String
}
struct Content: Decodable {
    let title: String, subtitle: String, credit: String, adaptation: String, introduction: String
    let workflow: [String], plays: [Play], checklist: [String]
}
let scriptDirectory = URL(fileURLWithPath: #filePath).deletingLastPathComponent()
let content = try JSONDecoder().decode(Content.self, from: Data(contentsOf: scriptDirectory.appendingPathComponent("content.json")))
precondition(content.plays.count == 8 && content.checklist.count == 10)
let output = CommandLine.arguments.count > 1 ? URL(fileURLWithPath: CommandLine.arguments[1]) : scriptDirectory.appendingPathComponent("../../public/library/keyword-research/keyword-research-playbook.pdf").standardizedFileURL
let intermediate = FileManager.default.temporaryDirectory.appendingPathComponent("searchcrew-playbook-\(UUID().uuidString).pdf")
defer { try? FileManager.default.removeItem(at: intermediate) }
let canvas = CGRect(x: 0, y: 0, width: 612, height: 792)
var mediaBox = canvas
guard let pdf = CGContext(intermediate as CFURL, mediaBox: &mediaBox, [kCGPDFContextTitle: content.title, kCGPDFContextAuthor: "SearchCrew branding adaptation; curated by Jeremy Rivera · SEO Arcade", kCGPDFContextCreator: "SearchCrew playbook generator"] as CFDictionary) else { fatalError("Cannot create PDF") }
let navy = NSColor(srgbRed: 11/255, green: 19/255, blue: 52/255, alpha: 1)
let cobalt = NSColor(srgbRed: 41/255, green: 71/255, blue: 242/255, alpha: 1)
let muted = NSColor(srgbRed: 75/255, green: 87/255, blue: 113/255, alpha: 1)
let pale = NSColor(srgbRed: 242/255, green: 245/255, blue: 255/255, alpha: 1)
let line = NSColor(srgbRed: 220/255, green: 227/255, blue: 244/255, alpha: 1)
let softWhite = NSColor(srgbRed: 206/255, green: 216/255, blue: 245/255, alpha: 1)
var pageNumber = 0
var links: [(page: Int, url: String, rect: CGRect)] = []

func rect(_ x: Double, _ y: Double, _ width: Double, _ height: Double) -> CGRect {
    CGRect(x: x, y: 792 - y - height, width: width, height: height)
}
func fill(_ x: Double, _ y: Double, _ width: Double, _ height: Double, _ color: NSColor) {
    pdf.setFillColor(color.cgColor); pdf.fill(rect(x, y, width, height))
}
func attributed(_ value: String, size: Double, weight: NSFont.Weight, color: NSColor, leading: Double = 3) -> NSAttributedString {
    let style = NSMutableParagraphStyle(); style.lineSpacing = leading
    style.lineBreakMode = .byWordWrapping
    return NSAttributedString(string: value, attributes: [.font: NSFont.systemFont(ofSize: size, weight: weight), .foregroundColor: color, .paragraphStyle: style])
}
@discardableResult func text(_ value: String, x: Double = 48, y: Double, width: Double = 516, size: Double = 12, weight: NSFont.Weight = .regular, color: NSColor? = nil, leading: Double = 3) -> Double {
    let string = attributed(value, size: size, weight: weight, color: color ?? navy, leading: leading)
    let height = ceil(string.boundingRect(with: CGSize(width: width, height: 2000), options: [.usesLineFragmentOrigin, .usesFontLeading]).height) + 2
    precondition(y + height <= 754, "Text overflow on page \(pageNumber): \(value)")
    string.draw(with: rect(x, y, width, height), options: [.usesLineFragmentOrigin, .usesFontLeading])
    return height
}
func start(dark: Bool = false) {
    pageNumber += 1; pdf.beginPDFPage(nil)
    NSGraphicsContext.saveGraphicsState(); NSGraphicsContext.current = NSGraphicsContext(cgContext: pdf, flipped: false)
    fill(0, 0, 612, 792, dark ? navy : .white)
    fill(48, 39, 5, 17, cobalt)
    text("SearchCrew", x: 63, y: 35, width: 220, size: 17, weight: .bold, color: dark ? .white : navy)
    text("FIELD GUIDE / KEYWORD RESEARCH", x: 305, y: 40, width: 259, size: 8.5, weight: .semibold, color: dark ? softWhite : muted)
}
func finish(dark: Bool = false) {
    fill(48, 740, 516, 0.5, dark ? NSColor.white.withAlphaComponent(0.2) : line)
    text("SearchCrew · Keyword Research Playbook", y: 742, width: 470, size: 8, color: dark ? softWhite : muted, leading: 0)
    text(String(format: "%02d", pageNumber), x: 544, y: 742, width: 20, size: 8, weight: .semibold, color: dark ? softWhite : muted, leading: 0)
    NSGraphicsContext.restoreGraphicsState(); pdf.endPDFPage()
}
func eyebrow(_ value: String, y: Double, dark: Bool = false) {
    text(value, y: y, size: 10, weight: .bold, color: dark ? softWhite : cobalt)
}
func link(_ label: String, url: String, y: Double, dark: Bool = false) {
    let height = text(label, y: y, size: 13, weight: .semibold, color: dark ? .white : cobalt)
    links.append((pageNumber - 1, url, rect(48, y, 516, height)))
}

start(dark: true)
eyebrow("A SEARCHCREW PLAYBOOK", y: 171, dark: true)
fill(48, 206, 58, 4, cobalt)
text("The Keyword\nResearch\nPlaybook", y: 232, width: 516, size: 53, weight: .bold, color: .white, leading: 0)
text(content.subtitle, y: 454, width: 470, size: 17, color: softWhite, leading: 6)
text(content.credit, y: 567, size: 11.5, weight: .semibold, color: .white)
link("searchcrew.ai", url: "https://searchcrew.ai/", y: 645, dark: true)
finish(dark: true)

start()
eyebrow("START HERE", y: 90)
var y = 121.0
y += text("Keyword research is demand discovery — not a volume spreadsheet.", y: y, size: 31, weight: .bold, leading: 3) + 23
y += text(content.introduction, y: y, size: 12.5, leading: 5) + 30
eyebrow("THE WORKFLOW", y: y); y += 30
for (index, item) in content.workflow.enumerated() {
    let x = 48.0 + Double(index % 2) * 266
    let top = y + Double(index / 2) * 75
    fill(x, top, 250, 63, pale)
    text(String(format: "%02d", index + 1), x: x + 14, y: top + 10, width: 35, size: 10, weight: .bold, color: cobalt)
    text(item, x: x + 14, y: top + 29, width: 225, size: 12, weight: .semibold)
}
y += 236
text("Each play names its endorsers, a short \"why,\" a workflow, and a quote from the source interview. The final checklist turns all eight into one repeatable seed-to-brief routine.", y: y, size: 11, color: muted, leading: 4)
finish()

func drawPlay(_ play: Play, number: Int, top: Double) {
    let x = 48.0, width = 516.0
    text(String(format: "PLAY %02d", number), y: top, size: 9, weight: .bold, color: cobalt)
    var y = top + 19
    y += text(play.title, y: y, width: width, size: 20, weight: .bold, leading: 1) + 7
    y += text(play.endorsers, y: y, size: 9.5, weight: .medium, color: muted, leading: 1) + 10
    y += text(play.why, y: y, size: 11.4, leading: 3) + 8
    for step in play.steps {
        fill(x, y + 6, 3, 3, cobalt)
        y += text(step, x: x + 13, y: y, width: width - 13, size: 11.2, leading: 2) + 3
    }
    y += 7
    let quote = attributed(play.quote, size: 11.2, weight: .semibold, color: navy, leading: 3)
    let quoteHeight = ceil(quote.boundingRect(with: CGSize(width: width - 29, height: 1000), options: [.usesLineFragmentOrigin, .usesFontLeading]).height) + 2
    let quoteBoxHeight = quoteHeight + 37
    precondition(y + quoteBoxHeight <= top + 302, "Play \(number) exceeds section: \(y + quoteBoxHeight - top)")
    fill(x, y, width, quoteBoxHeight, pale); fill(x, y, 3, quoteBoxHeight, cobalt)
    text(play.quote, x: x + 15, y: y + 9, width: width - 29, size: 11.2, weight: .semibold, leading: 3)
    text(play.speaker, x: x + 15, y: y + quoteHeight + 17, width: width - 29, size: 8.2, weight: .medium, color: muted, leading: 1)
}
for first in stride(from: 0, to: 8, by: 2) {
    start()
    drawPlay(content.plays[first], number: first + 1, top: 85)
    fill(48, 405, 516, 0.5, line)
    drawPlay(content.plays[first + 1], number: first + 2, top: 429)
    finish()
}

start()
eyebrow("PUT IT TOGETHER", y: 90)
text("The seed-to-brief checklist", y: 121, size: 30, weight: .bold)
text("One repeatable routine that chains all eight plays.", y: 173, size: 12.5, color: muted)
y = 218
for item in content.checklist {
    pdf.setStrokeColor(cobalt.cgColor); pdf.setLineWidth(1)
    pdf.stroke(rect(48, y + 3, 11, 11))
    let height = text(item, x: 72, y: y, width: 492, size: 12, leading: 4)
    let rowHeight = max(42, height + 18)
    fill(48, y + rowHeight - 8, 516, 0.5, line)
    y += rowHeight
}
finish()

start(dark: true)
eyebrow("YOUR NEXT STEP", y: 170, dark: true)
fill(48, 205, 58, 4, cobalt)
text("Put the research\ninto practice.", y: 232, size: 44, weight: .bold, color: .white, leading: 3)
text("Explore SearchCrew’s keyword research page, then check the current launch status and availability before planning your workflow.", y: 364, width: 488, size: 16, color: softWhite, leading: 6)
link("Explore keyword research →", url: "https://searchcrew.ai/features/keyword-research", y: 467, dark: true)
link("Check launch status →", url: "https://searchcrew.ai/get-started", y: 504, dark: true)
text(content.credit, y: 571, size: 11.5, weight: .semibold, color: .white)
text("Plays sourced from the Unscripted SEO podcast", y: 597, size: 11, color: softWhite)
text(content.adaptation, y: 638, width: 504, size: 9.5, color: softWhite, leading: 3)
finish(dark: true)
pdf.closePDF()

guard let document = PDFDocument(url: intermediate), document.pageCount == 8 else { fatalError("Eight pages required") }
for item in links {
    let annotation = PDFAnnotation(bounds: item.rect, forType: .link, withProperties: nil)
    annotation.url = URL(string: item.url)
    annotation.border = PDFBorder(); annotation.border?.lineWidth = 0
    document.page(at: item.page)?.addAnnotation(annotation)
}
guard let data = document.dataRepresentation() else { fatalError("Cannot persist links") }
try data.write(to: output, options: .atomic)
print("Generated \(output.path): 8 pages, \(links.count) clickable links")
