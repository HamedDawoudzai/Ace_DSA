import Foundation

enum APIError: LocalizedError {
    case httpError(Int, String)

    var errorDescription: String? {
        switch self {
        case .httpError(let code, let body):
            return body.isEmpty ? "Server error \(code)" : body
        }
    }
}

final class APIClient {
    static let shared = APIClient()

    private let session: URLSession
    private let decoder: JSONDecoder = {
        let d = JSONDecoder()
        d.keyDecodingStrategy = .convertFromSnakeCase
        return d
    }()
    private let encoder: JSONEncoder = {
        let e = JSONEncoder()
        e.keyEncodingStrategy = .convertToSnakeCase
        return e
    }()

    private init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        self.session = URLSession(configuration: config)
    }

    func get<T: Decodable>(_ endpoint: Endpoint, token: String? = nil) async throws -> T {
        var request = URLRequest(url: endpoint.url)
        applyAuth(token, to: &request)
        return try await send(request)
    }

    func post<Body: Encodable, T: Decodable>(
        _ endpoint: Endpoint,
        body: Body,
        token: String? = nil
    ) async throws -> T {
        var request = URLRequest(url: endpoint.url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        applyAuth(token, to: &request)
        request.httpBody = try encoder.encode(body)
        return try await send(request)
    }

    private func applyAuth(_ token: String?, to request: inout URLRequest) {
        if let token {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
    }

    private func send<T: Decodable>(_ request: URLRequest) async throws -> T {
        let (data, response) = try await session.data(for: request)
        if let http = response as? HTTPURLResponse, !(200..<300).contains(http.statusCode) {
            let body = String(data: data, encoding: .utf8) ?? ""
            throw APIError.httpError(http.statusCode, body.trimmingCharacters(in: .whitespacesAndNewlines))
        }
        return try decoder.decode(T.self, from: data)
    }
}
