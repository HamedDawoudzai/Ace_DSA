import SwiftUI

struct AuthView: View {
    @EnvironmentObject private var authStore: AuthStore

    @State private var mode: Mode = .login
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false
    @State private var errorMessage: String?

    enum Mode { case login, signup }

    var body: some View {
        NavigationStack {
            ZStack {
            Color(red: 245/255, green: 240/255, blue: 230/255)
                .ignoresSafeArea()
            VStack(spacing: 0) {
                Spacer()

                VStack(spacing: 12) {
                    Text("ACE DSA")
                        .font(.largeTitle.bold())
                        .foregroundColor(.yellow)
                    Text("Practice patterns. Ace interviews.")
                        .font(.subheadline)
                        .multilineTextAlignment(.center)
                        .foregroundColor(.yellow)
                }

                Spacer()

                VStack(spacing: 14) {
                    Picker("Mode", selection: $mode) {
                        Text("Log In").tag(Mode.login)
                        Text("Sign Up").tag(Mode.signup)
                    }
                    .pickerStyle(.segmented)
                    .onChange(of: mode) { _, _ in errorMessage = nil }

                    TextField("Email", text: $email)
                        .keyboardType(.emailAddress)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)
                        .textFieldStyle(.roundedBorder)

                    SecureField("Password (min 8 chars)", text: $password)
                        .textFieldStyle(.roundedBorder)

                    if let errorMessage {
                        Text(errorMessage)
                            .font(.caption)
                            .foregroundStyle(.red)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }

                    Button(action: submit) {
                        if isLoading {
                            ProgressView().frame(maxWidth: .infinity)
                        } else {
                            Text(mode == .login ? "Log In" : "Sign Up")
                                .frame(maxWidth: .infinity)
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)
                    .disabled(isLoading || email.isEmpty || password.isEmpty)
                    .tint(.yellow)
                }
                .padding(.horizontal, 32)
                .padding(.bottom, 48)
            }
            .navigationBarHidden(true)
            }
        }
    }

    private func submit() {
        errorMessage = nil
        isLoading = true
        Task {
            do {
                let tokens: TokenResponse
                if mode == .signup {
                    tokens = try await APIClient.shared.post(
                        .signup,
                        body: SignupRequest(email: email, password: password)
                    )
                } else {
                    tokens = try await APIClient.shared.post(
                        .login,
                        body: LoginRequest(email: email, password: password)
                    )
                }
                authStore.setTokens(tokens)
                isLoading = false
            } catch {
                errorMessage = error.localizedDescription
                isLoading = false
            }
        }
    }
}
