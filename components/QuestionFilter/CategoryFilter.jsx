import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { useGetCategoriesQuery } from "../../redux/slices/category/categoryApi";
import { updateQuestionQuery } from "../../redux/slices/question/questionSlice";
import { buildQuery } from "../../utils/utils";

const CategoryFilter = () => {
  const [categories, setCategories] = useState([]);
  const { grade } = useSelector((state) => state.question.query);

  const { data, isLoading } = useGetCategoriesQuery(
    buildQuery({
      type: "main",
      per_page: 10,
      grade,
    })
  );
  const dispatch = useDispatch();
  const { query } = useSelector((state) => state.question);

  useEffect(() => {
    if (data?.data) {
      setCategories([{ _id: "", name: "All Categories" }, ...data.data]);
    }
  }, [data]);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.name}</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.dropdown, { justifyContent: "center" }]}>
        <Text style={{ fontSize: 16 }}>All Categories</Text>
      </View>
    );
  }

  return (
    <Dropdown
      style={styles.dropdown}
      containerStyle={styles.containerStyle}
      data={categories}
      selectedTextProps={{
        numberOfLines: 1,
      }}
      search={false}
      maxHeight={300}
      labelField="name"
      valueField="_id"
      placeholder="Select Status"
      value={query.category}
      onChange={(item) => {
        dispatch(updateQuestionQuery({ category: item._id, page: 1 }));
      }}
      renderItem={renderItem}
    />
  );
};

export default CategoryFilter;

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
    marginTop: 5,
    borderRadius: 8,
    width: "70%",
  },

  item: {
    paddingHorizontal: 10,
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
