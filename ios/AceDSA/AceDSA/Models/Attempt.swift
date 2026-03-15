import Foundation

// POST /attempts — requires JWT. APIClient encodes with .convertToSnakeCase.
struct AttemptRequest: Encodable {
    let drillId: String
    let chosenOption: Int
    let explanation: String?
}

struct AttemptResponse: Decodable {
    let status: String
}
