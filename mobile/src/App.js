import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>RagNarok's Hearth (Mobile)</Text>
      <View style={styles.card}>
        <Text>Chat, Servers, Channels, GM Tools available (placeholder)</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#071022" },
  title: { fontSize: 20, fontWeight: "700", color: "#e6eef8" },
  card: { marginTop: 16, padding: 12, backgroundColor: "#081226", borderRadius: 8 }
});