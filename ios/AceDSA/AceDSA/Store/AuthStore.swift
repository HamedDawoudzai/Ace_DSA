import Foundation
import Combine


final class AuthStore: ObservableObject {
    @Published private(set) var accessToken: String?

    var isAuthenticated: Bool { accessToken != nil }

    func setTokens(_ response: TokenResponse) {
        accessToken = response.accessToken
        // TODO: persist refresh token to Keychain for silent re-auth
    }

    func signOut() {
        accessToken = nil
    }
}
