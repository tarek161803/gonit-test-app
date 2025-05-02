import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { updateQuestionQuery } from "../../redux/slices/question/questionSlice";
const data = [
  { label: "Any Exp. Status", value: "" },
  { label: "With Explanation", value: "explanation" },
  { label: "Without Explanation", value: "no_explanation" },
];

const ExplanationFiler = () => {
  const dispatch = useDispatch();
  const { query } = useSelector((state) => state.question);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === query.explanation && (
          <Feather style={styles.icon} name="check-circle" size={18} color="black" />
        )}
      </View>
    );
  };

  return (
    <Dropdown
      style={styles.dropdown}
      containerStyle={styles.containerStyle}
      data={data}
      search={false}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Choose Explanation Type"
      value={query.explanation}
      onChange={(item) => {
        dispatch(updateQuestionQuery({ explanation: item.value, page: 1 }));
      }}
      renderItem={renderItem}
    />
  );
};

export default ExplanationFiler;

const styles = StyleSheet.create({
  dropdown: {
    marginRight: 16,
    marginBottom: 8,
    height: 40,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderColor: "#c9c9c9",
    borderWidth: 1,
    flex: 1,
  },
  containerStyle: {
    marginTop: 4,
    borderRadius: 8,
  },

  icon: {
    marginRight: 0,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
});
