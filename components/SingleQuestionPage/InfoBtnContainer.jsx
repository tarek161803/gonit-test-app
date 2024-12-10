import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const InfoBtnContainer = ({ showHint, setShowHint }) => {
  const handleHintShow = () => {
    setShowHint((prevState) => !prevState);
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={handleHintShow} style={[styles.infoButton]}>
        <MaterialCommunityIcons style={{ textAlign: "center" }} name="lightbulb-on-outline" size={22} color="black" />
        <Text style={styles.infoButtonText}>Hint</Text>
      </Pressable>
      <Pressable style={styles.infoButton}>
        <MaterialCommunityIcons style={{ textAlign: "center" }} name="lightbulb-on-outline" size={22} color="black" />
        <Text style={styles.infoButtonText}>Explain</Text>
      </Pressable>
    </View>
  );
};

export default InfoBtnContainer;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -70,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  infoButton: {
    backgroundColor: "#ffffff",
    height: 60,
    width: 60,
    borderRadius: 50,
    boxShadow: "0 0 10  #00000010",
    justifyContent: "center",
    alignItems: "center",
  },

  infoButtonText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
});
