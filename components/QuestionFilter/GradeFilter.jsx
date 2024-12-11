import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { updateQuestionQuery } from "../../redux/slices/question/questionSlice";
const data = [
  { label: "All Grade", value: "" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
];

const GradeFilter = () => {
  const dispatch = useDispatch();
  const { query } = useSelector((state) => state.question);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === query.grade && <Feather style={styles.icon} name="check-circle" size={18} color="black" />}
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
      placeholder="Select Difficulty"
      value={query.grade}
      onChange={(item) => {
        dispatch(updateQuestionQuery({ grade: item.value, page: 1 }));
      }}
      renderItem={renderItem}
    />
  );
};

export default GradeFilter;

const styles = StyleSheet.create({
  dropdown: {
    marginLeft: 16,
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
