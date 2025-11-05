import React from "react";
import { View, Button } from "react-native";

export default function FileUploader() {
  return (
    <View>
      <Button title="Upload File" onPress={() => { /* integrate react-native-document-picker */ }} />
    </View>
  );
}