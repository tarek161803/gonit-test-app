import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { updateQuestionQuery } from "../redux/slices/question/questionSlice";

const data = [
  { label: "All Status", value: "" },
  { label: "Draft", value: "draft" },
  // { label: "Translated", value: "translated" },
  { label: "Verified", value: "verified" },
  { label: "Published", value: "published" },
];

const QuestionFilter = () => {
  const dispatch = useDispatch();
  const { query } = useSelector((state) => state.question);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === query.status && <AntDesign style={styles.icon} color="black" name="check" size={20} />}
      </View>
    );
  };

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      search={false}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Select Status"
      value={query.status}
      onChange={(item) => {
        dispatch(updateQuestionQuery({ status: item.value }));
      }}
      renderItem={renderItem}
    />
  );
};

export default QuestionFilter;

const styles = StyleSheet.create({
  dropdown: {
    marginHorizontal: 16,
    marginBottom: 8,
    height: 50,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderColor: "#c9c9c9",
    borderWidth: 1,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    paddingHorizontal: 17,
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
