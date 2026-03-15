import Foundation

struct SignupRequest: Encodable {
    let email: String
    let password: String
}

struct LoginRequest: Encodable {
    let email: String
    let password: String
}

// Matches backend tokenResp: access_token, refresh_token, expires_in.
// APIClient uses .convertFromSnakeCase so field names are camelCase.
struct TokenResponse: Decodable {
    let accessToken: String
    let refreshToken: String
    let expiresIn: Int
}
