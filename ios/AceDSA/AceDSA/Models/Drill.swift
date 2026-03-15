import Foundation

// Mirrors the backend Drill struct: id, pattern_category, prompt, choices.
// APIClient uses .convertFromSnakeCase so field names are camelCase.
struct Drill: Identifiable, Decodable, Hashable {
    let id: String
    let patternCategory: String
    let prompt: String
    let choices: [String]
}
