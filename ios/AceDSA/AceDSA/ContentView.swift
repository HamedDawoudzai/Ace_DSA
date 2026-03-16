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
            HomeView()
        } else {
            AuthView()
        }
    }
}

struct HomeView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 225/255, green: 218/255, blue: 205/255)
                    .ignoresSafeArea()

                VStack(spacing: 24) {
                    Spacer()

                    Text("Ace DSA")
                        .font(.largeTitle.bold())
                        .frame(maxWidth: .infinity, alignment: .center)
                        .foregroundColor(.yellow)

                    Spacer()

                    NavigationLink(destination: LearnView()) {
                        HomeCard(
                            title: "Learn About DSA",
                            subtitle: "Understand patterns and concepts",
                            systemImage: "book.fill"
                        )
                    }

                    NavigationLink(destination: PracticeView()) {
                        HomeCard(
                            title: "Practice DSA",
                            subtitle: "Drill problems and sharpen your skills",
                            systemImage: "brain.head.profile"
                        )
                    }

                    Spacer()
                }
                .padding(.horizontal, 24)
            }
            .navigationBarHidden(true)
        }
    }
}

struct HomeCard: View {
    let title: String
    let subtitle: String
    let systemImage: String

    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: systemImage)
                .font(.system(size: 32))
                .foregroundStyle(.black)
                .frame(width: 52)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                    .foregroundStyle(.black)
                Text(subtitle)
                    .font(.subheadline)
                    .foregroundStyle(.black.opacity(0.6))
            }

            Spacer()

            Image(systemName: "chevron.right")
                .foregroundStyle(.black.opacity(0.4))
        }
        .padding(20)
        .frame(maxWidth: .infinity)
        .background(Color.yellow)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

