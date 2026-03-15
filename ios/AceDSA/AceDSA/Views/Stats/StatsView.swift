import SwiftUI

struct StatsView: View {
    var body: some View {
        NavigationStack {
            ContentUnavailableView(
                "Stats coming soon",
                systemImage: "chart.bar.xaxis",
                description: Text("Your pattern performance and streak will appear here once the Stats API is live.")
            )
            .navigationTitle("Stats")
        }
    }
}
