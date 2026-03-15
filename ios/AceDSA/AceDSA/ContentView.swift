//
//  ContentView.swift
//  AceDSA
//
//  Created by anuj sarvate on 2026-03-13.
//

import SwiftUI
struct ContentView: View {
    @EnvironmentObject private var authStore: AuthStore
    var body: some View {
        if authStore.isAuthenticated {
            MainTabView()
        } else {
            AuthView()
        }
    }
}
struct MainTabView: View {
    var body: some View {
        TabView {
            DrillsView()
                .tabItem { Label("Drills", systemImage: "list.bullet.rectangle") }
            StatsView()
                .tabItem { Label("Stats", systemImage: "chart.bar") }
        }
    }
}
