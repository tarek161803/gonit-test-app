import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import ExplanationView from "./ExplanationView";

const HintAndExplanation = ({ showHint, question, showExplanation }) => {
  return (
    <>
      {showHint && (
        <>
          {question.hint ? (
            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 10,
                  borderWidth: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderColor: "#1BB3FC",
                }}>
                <AntDesign name="questioncircleo" size={20} color="#1BB3FC" />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    color: "#1BB3FC",
                  }}>
                  Hint
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 18,
                  marginTop: 6,
                  color: "#342618",
                }}>
                {question.hint}
              </Text>
            </View>
          ) : (
            <View style={{ marginTop: 20, flexDirection: "row", gap: 5, alignItems: "center" }}>
              <View style={{ height: 24, width: 24 }}>
                <MaterialIcons name="error-outline" size={24} color="red" />
              </View>
              <Text style={{ fontSize: 18, color: "#333333" }}>Hint Not Available</Text>
            </View>
          )}
        </>
      )}

      {showExplanation && (
        <>
          {question.explanation || question.explanationImage ? (
            <View style={{ marginTop: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 10,
                  borderWidth: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderColor: "#1BB3FC",
                }}>
                <AntDesign name="questioncircleo" size={20} color="#1BB3FC" />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    color: "#1BB3FC",
                  }}>
                  Explanation
                </Text>
              </View>
              <ExplanationView question={question} />
            </View>
          ) : (
            <View style={{ marginTop: 10, flexDirection: "row", gap: 5, alignItems: "center" }}>
              <View style={{ height: 24, width: 24 }}>
                <MaterialIcons name="error-outline" size={24} color="red" />
              </View>
              <Text style={{ fontSize: 18, color: "#333333" }}>Explanation Not Available</Text>
            </View>
          )}
        </>
      )}
    </>
  );
};

export default HintAndExplanation;
