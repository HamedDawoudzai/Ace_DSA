import SwiftUI

struct DrillDetailView: View {
    let drill: Drill
    @EnvironmentObject private var authStore: AuthStore

    @State private var selectedIndex: Int?
    @State private var isSubmitting = false
    @State private var submitted = false
    @State private var errorMessage: String?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text(drill.patternCategory)
                    .font(.caption.bold())
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Color.accentColor.opacity(0.15))
                    .foregroundStyle(Color.accentColor)
                    .clipShape(Capsule())

                Text(drill.prompt)
                    .font(.title3.weight(.semibold))

                Divider()

                Text("Choose the best approach:")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)

                ForEach(Array(drill.choices.enumerated()), id: \.offset) { index, choice in
                    choiceButton(index: index, label: choice)
                }

                if submitted {
                    Label("Answer submitted!", systemImage: "checkmark.seal.fill")
                        .font(.subheadline.bold())
                        .foregroundStyle(.green)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.green.opacity(0.1))
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                }

                if let errorMessage {
                    Text(errorMessage)
                        .font(.caption)
                        .foregroundStyle(.red)
                }

                Button(action: submitAttempt) {
                    if isSubmitting {
                        ProgressView().frame(maxWidth: .infinity)
                    } else {
                        Text("Submit Answer").frame(maxWidth: .infinity)
                    }
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .disabled(selectedIndex == nil || isSubmitting || submitted)
            }
            .padding()
        }
        .navigationTitle("Drill")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func choiceButton(index: Int, label: String) -> some View {
        let isSelected = selectedIndex == index
        return Button {
            guard !submitted else { return }
            withAnimation(.easeInOut(duration: 0.15)) { selectedIndex = index }
        } label: {
            HStack {
                Text(label)
                    .font(.body)
                    .foregroundStyle(.primary)
                    .multilineTextAlignment(.leading)
                Spacer()
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(Color.accentColor)
                }
            }
            .padding()
            .background(isSelected ? Color.accentColor.opacity(0.1) : Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(isSelected ? Color.accentColor : Color.clear, lineWidth: 1.5)
            )
        }
    }

    private func submitAttempt() {
        guard let index = selectedIndex, let token = authStore.accessToken else { return }
        isSubmitting = true
        errorMessage = nil
        Task {
            defer { isSubmitting = false }
            do {
                let _: AttemptResponse = try await APIClient.shared.post(
                    .submitAttempt,
                    body: AttemptRequest(drillId: drill.id, chosenOption: index, explanation: nil),
                    token: token
                )
                await MainActor.run { submitted = true }
            } catch {
                await MainActor.run { errorMessage = error.localizedDescription }
            }
        }
    }
}
