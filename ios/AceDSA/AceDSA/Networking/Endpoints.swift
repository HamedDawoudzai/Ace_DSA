import Foundation

enum Endpoint {
    // Change to your machine's IP when testing on a physical device.
    static let baseURL = URL(string: "http://localhost:8080")!

    case signup
    case login
    case drills
    case submitAttempt
    case myStats

    var url: URL {
        let path: String
        switch self {
        case .signup:        path = "/auth/signup"
        case .login:         path = "/auth/login"
        case .drills:        path = "/drills"
        case .submitAttempt: path = "/attempts"
        case .myStats:       path = "/me/stats"
        }
        return Self.baseURL.appendingPathComponent(path)
    }
}
