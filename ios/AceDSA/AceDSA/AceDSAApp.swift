//
//  AceDSAApp.swift
//  AceDSA
//
//  Created by anuj sarvate on 2026-03-13.
//

import SwiftUI

@main
struct AceDSAApp: App {
    @StateObject private var authStore = AuthStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authStore)
        }
    }
}
