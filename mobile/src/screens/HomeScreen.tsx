import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import HomeCard from "../components/HomeCard";
import { MainStackParamList } from "../navigation/MainTabs";

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ace DSA</Text>

        <View style={styles.cards}>
          <HomeCard
            title="Learn About DSA"
            subtitle="Understand patterns and concepts"
            icon="book"
            onPress={() => navigation.navigate("Learn")}
          />
          <View style={styles.spacer} />
          <HomeCard
            title="Practice DSA"
            subtitle="Drill problems and sharpen your skills"
            icon="bulb"
            onPress={() => navigation.navigate("Drills")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1DAC9",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#F5C842",
    textAlign: "center",
    marginBottom: 40,
  },
  cards: {},
  spacer: {
    height: 20,
  },
});
