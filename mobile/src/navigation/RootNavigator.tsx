import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";

export default function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#E1DAC9",
        }}
      >
        <ActivityIndicator size="large" color="#F5C842" />
      </View>
    );
  }

  return isAuthenticated ? <MainTabs /> : <AuthStack />;
}
