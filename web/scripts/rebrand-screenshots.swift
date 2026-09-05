// macOS-only maintenance utility. Run from repository root; see BRAND_ASSETS.md.
// Produces text-rendering candidates ONLY. AppKit can normalize PNG profiles.
// Run finalize-screenshots.mjs afterward to preserve original raw pixels/profile.
import AppKit
import CryptoKit

struct Region {
    let x: Int, y: Int, width: Int, height: Int
    let text: String
    let fontSize: CGFloat
    var foreground: String = "2947F2"
    var background: String = "FFFFFF"
    var bold: Bool = true
}
struct Asset {
    let name: String, source: String, destination: String
    let regions: [Region]
}
func color(_ hex: String) -> NSColor {
    let value = UInt32(hex, radix: 16)!
    return NSColor(srgbRed: CGFloat((value >> 16) & 255) / 255,
                   green: CGFloat((value >> 8) & 255) / 255,
                   blue: CGFloat(value & 255) / 255, alpha: 1)
}
func load(_ path: String) throws -> NSBitmapImageRep {
    guard let bitmap = NSBitmapImageRep(data: try Data(contentsOf: URL(fileURLWithPath: path))),
          bitmap.bitsPerSample == 8, !bitmap.isPlanar, [3, 4].contains(bitmap.samplesPerPixel) else {
        throw NSError(domain: "Unsupported PNG: \(path)", code: 1)
    }
    return bitmap
}
func sha(_ path: String) throws -> String {
    SHA256.hash(data: try Data(contentsOf: URL(fileURLWithPath: path))).map { String(format: "%02x", $0) }.joined()
}
func patch(_ region: Region) throws -> NSBitmapImageRep {
    let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: region.width,
        pixelsHigh: region.height, bitsPerSample: 8, samplesPerPixel: 4,
        hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB,
        bitmapFormat: [], bytesPerRow: region.width * 4, bitsPerPixel: 32)!
    NSGraphicsContext.saveGraphicsState()
    defer { NSGraphicsContext.restoreGraphicsState() }
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
    let rect = NSRect(x: 0, y: 0, width: region.width, height: region.height)
    color(region.background).setFill()
    rect.fill()
    let text = region.text as NSString
    var fontSize = region.fontSize
    var attributes: [NSAttributedString.Key: Any] = [:]
    var size = NSSize.zero
    repeat {
        let font = NSFont.systemFont(ofSize: fontSize, weight: region.bold ? .semibold : .regular)
        attributes = [.font: font, .foregroundColor: color(region.foreground)]
        size = text.size(withAttributes: attributes)
        fontSize -= 0.25
    } while size.width > CGFloat(region.width) && fontSize >= 8
    precondition(size.width <= CGFloat(region.width), "Text exceeds approved region: \(region.text)")
    text.draw(at: NSPoint(x: 0, y: (CGFloat(region.height) - size.height) / 2), withAttributes: attributes)
    return bitmap
}

let originalDir = ".helix/evidence/brand-assets/originals"
let header = Region(x: 8, y: 12, width: 64, height: 21, text: "SearchCrew", fontSize: 11.2)
var assets = ["keyword-research", "site-audit", "backlinks", "domain-overview", "rank-tracking"].map {
    Asset(name: $0, source: "\(originalDir)/\($0).png", destination: "web/public/screenshots/\($0).png", regions: [header])
}
assets += [
    Asset(name: "saved-keywords", source: "\(originalDir)/saved-keywords.png", destination: "web/public/screenshots/saved-keywords.png",
          regions: [Region(x: 4, y: 8, width: 57, height: 20, text: "SearchCrew", fontSize: 10)]),
    Asset(name: "ai-brand-visibility", source: "\(originalDir)/ai-brand-visibility.png", destination: "web/public/screenshots/ai-brand-visibility.png",
          regions: [Region(x: 6, y: 8, width: 61, height: 20, text: "SearchCrew", fontSize: 10.6)]),
    Asset(name: "ai-search-prompts", source: "\(originalDir)/ai-search-prompts.png", destination: "web/public/screenshots/ai-search-prompts.png",
          regions: [header,
            Region(x: 80, y: 277, width: 85, height: 16, text: "SearchCrew", fontSize: 11, foreground: "171717", bold: false),
            Region(x: 224, y: 464, width: 66, height: 18, text: "Example", fontSize: 10, foreground: "4B5563", background: "FAFAFA"),
            Region(x: 492, y: 12, width: 230, height: 21, text: "Illustrative example · sample response", fontSize: 10, foreground: "4B5563", bold: false)]),
    Asset(name: "readme-demo", source: "\(originalDir)/readme-demo.png", destination: "web/public/screenshots/readme-demo.png",
          regions: [Region(x: 13, y: 25, width: 153, height: 46, text: "SearchCrew", fontSize: 26, foreground: "FFFFFF", background: "111111")])
]
for name in ["keyword-research", "backlink-analysis", "domain-overview"] {
    let source = "\(originalDir)/blog-\(name).png"
    precondition(FileManager.default.fileExists(atPath: source), "Restore pinned originals using prepare-screenshots.mjs first")
    assets.append(Asset(name: "blog-\(name)", source: source, destination: "web/public/blog/seo-for-startups/\(name).png",
        regions: [Region(x: 34, y: 39, width: 61, height: 20, text: "SearchCrew", fontSize: 10.6)]))
}

var evidence: [[String: Any]] = []
for asset in assets {
    let original = try load(asset.source)
    let width = original.pixelsWide, height = original.pixelsHigh
    let before = Data(bytes: original.bitmapData!, count: original.bytesPerRow * height)
    for region in asset.regions {
        precondition(region.x >= 0 && region.y >= 0 && region.x + region.width <= width && region.y + region.height <= height)
        let replacement = try patch(region)
        for row in 0..<region.height {
            for column in 0..<region.width {
                let patchOffset = row * replacement.bytesPerRow + column * (replacement.bitsPerPixel / 8)
                let outputOffset = (region.y + row) * original.bytesPerRow + (region.x + column) * (original.bitsPerPixel / 8)
                for component in 0..<original.samplesPerPixel {
                    original.bitmapData![outputOffset + component] = replacement.bitmapData![patchOffset + component]
                }
            }
        }
    }
    let candidate = ".helix/evidence/brand-assets/candidates/\(asset.name).png"
    try FileManager.default.createDirectory(at: URL(fileURLWithPath: candidate).deletingLastPathComponent(), withIntermediateDirectories: true)
    guard let png = original.representation(using: .png, properties: [:]) else { fatalError("PNG encoding failed") }
    try png.write(to: URL(fileURLWithPath: candidate))
    let output = try load(candidate)
    precondition(output.pixelsWide == width && output.pixelsHigh == height)
    precondition(output.samplesPerPixel == original.samplesPerPixel)
    var changedPixels = 0, outsideChanges = 0
    for row in 0..<height {
        for column in 0..<width {
            let start = row * original.bytesPerRow + column * (original.bitsPerPixel / 8)
            let outputStart = row * output.bytesPerRow + column * (output.bitsPerPixel / 8)
            let changed = (0..<original.samplesPerPixel).contains { before[start + $0] != output.bitmapData![outputStart + $0] }
            if changed {
                changedPixels += 1
                let permitted = asset.regions.contains { column >= $0.x && column < $0.x + $0.width && row >= $0.y && row < $0.y + $0.height }
                if !permitted { outsideChanges += 1 }
            }
        }
    }
    precondition(changedPixels > 0 && outsideChanges == 0, "Unexpected pixel changes: \(asset.name), \(outsideChanges)")
    evidence.append(["name": asset.name, "source": asset.source, "destination": asset.destination, "candidate": candidate,
        "width": width, "height": height, "sourceSha256": try sha(asset.source), "candidateSha256": try sha(candidate),
        "changedPixels": changedPixels, "outsideRegionChangedPixels": outsideChanges,
        "regions": asset.regions.map { ["x": $0.x, "y": $0.y, "width": $0.width, "height": $0.height, "text": $0.text] }])
    print("CANDIDATE \(asset.name): \(width)x\(height); final raw-channel verification still required")
}
try JSONSerialization.data(withJSONObject: evidence, options: [.prettyPrinted, .sortedKeys]).write(to: URL(fileURLWithPath: ".helix/evidence/brand-assets/candidate-checks.json"))
