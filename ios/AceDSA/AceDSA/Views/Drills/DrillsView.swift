import SwiftUI

struct DrillsView: View {
    @EnvironmentObject private var authStore: AuthStore
    @State private var drills: [Drill] = []
    @State private var isLoading = false
    @State private var errorMessage: String?

    var body: some View {
        NavigationStack {
            Group {
                if isLoading && drills.isEmpty {
                    ProgressView("Loading drills…")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if let errorMessage, drills.isEmpty {
                    ContentUnavailableView(
                        errorMessage,
                        systemImage: "wifi.exclamationmark",
                        description: Text("Pull to retry")
                    )
                } else if drills.isEmpty {
                    ContentUnavailableView(
                        "No drills yet",
                        systemImage: "tray",
                        description: Text("Check back soon.")
                    )
                } else {
                    List(drills) { drill in
                        NavigationLink(value: drill) {
                            DrillRowView(drill: drill)
                        }
                    }
                    .listStyle(.insetGrouped)
                }
            }
            .navigationTitle("Drills")
            .navigationDestination(for: Drill.self) { drill in
                DrillDetailView(drill: drill)
            }
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Sign Out", role: .destructive) {
                        authStore.signOut()
                    }
                    .font(.caption)
                }
            }
            .task { await loadDrills() }
            .refreshable { await loadDrills() }
        }
    }

    private func loadDrills() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        do {
            drills = try await APIClient.shared.get(.drills)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

struct DrillRowView: View {
    let drill: Drill

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(drill.prompt)
                .font(.headline)
                .lineLimit(2)
            Text(drill.patternCategory)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 4)
    }
}
