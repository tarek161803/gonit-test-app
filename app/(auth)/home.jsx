import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import CategoryFilter from "../../components/QuestionFilter/CategoryFilter";
import DifficultyFilter from "../../components/QuestionFilter/DifficultyFilter";
import ExplanationFiler from "../../components/QuestionFilter/ExplanationFilter";
import GradeFilter from "../../components/QuestionFilter/GradeFilter";
import HintFilter from "../../components/QuestionFilter/HintFiler";
import StatusFilter from "../../components/QuestionFilter/StatusFilter";
import QuestionListItem from "../../components/QuestionListItem/QuestionListItem";
import COLORS from "../../constants/Colors";
import { useGetQuestionsQuery } from "../../redux/slices/question/questionApi";
import { resetQuestionQuery, updateQuestionQuery } from "../../redux/slices/question/questionSlice";
import { deleteSecureItem, getSecureItem, SECURE_STORE_KEYS, setSecureItem } from "../../utils/secureStore";
import { buildQuery } from "../../utils/utils";

const Home = () => {
  const dispatch = useDispatch();
  const { query } = useSelector((state) => state.question);

  const [inputPage, setInputPage] = useState(1);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isQueryHydrated, setIsQueryHydrated] = useState(false);

  const { data, isLoading, refetch, isFetching } = useGetQuestionsQuery(buildQuery(query), { skip: !isQueryHydrated });
  const [searchQuery, setSearchQuery] = useState("");
  const handleRefresh = () => refetch();

  const handleReset = async () => {
    Keyboard.dismiss();
    dispatch(resetQuestionQuery());
    setSearchQuery("");
    setInputPage(1);
    await deleteSecureItem(SECURE_STORE_KEYS.QUESTION_QUERY);
  };

  const handlePageChange = () => {
    Keyboard.dismiss();
    if (isLoading || !inputPage || inputPage === query.page || inputPage <= 0 || inputPage > data?.total_pages) return;
    dispatch(updateQuestionQuery({ page: inputPage }));
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    dispatch(updateQuestionQuery({ page: 1, search: searchQuery }));
    setInputPage(1);
  };

  useEffect(() => {
    if (searchQuery === "") {
      dispatch(updateQuestionQuery({ search: searchQuery }));
    }
  }, [searchQuery]);

  useEffect(() => {
    (async () => {
      const saved = await getSecureItem(SECURE_STORE_KEYS.QUESTION_QUERY);
      if (saved && typeof saved === "object") {
        dispatch(updateQuestionQuery(saved));
        if (saved.search) setSearchQuery(saved.search);
        if (saved.page) setInputPage(saved.page);
      }
      setIsQueryHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!isQueryHydrated) return;
    setSecureItem(SECURE_STORE_KEYS.QUESTION_QUERY, query);
  }, [query, isQueryHydrated]);

  useEffect(() => {
    setInputPage(query.page);
  }, [query.page]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (data?.total_pages && query.page > data?.total_pages) {
      dispatch(updateQuestionQuery({ page: 1 }));
    }
    if (data?.total_pages === 0) {
      setInputPage(0);
    } else {
      setInputPage(query.page);
    }
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : "padding"} style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Question / Serial"
            style={styles.searchInput}
          />
          <Pressable onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </Pressable>
          <Pressable onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <GradeFilter />
          <DifficultyFilter />
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <CategoryFilter />
          <StatusFilter />
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <HintFilter />
          <ExplanationFiler />
        </View>

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
          {isLoading || isFetching ? (
            <ActivityIndicator color={COLORS.primary} size="large" style={{ flex: 1 }} />
          ) : (
            <ScrollView
              refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
              style={styles.questionsContainer}>
              {data?.data?.length
                ? data?.data?.map((question) => (
                    <View style={styles.questionItem} key={question._id}>
                      <Text style={styles.serialText}>
                        <Text style={styles.serialLabel}>S/N: </Text>
                        {question.serial}
                      </Text>
                      <QuestionListItem question={question} />
                      <View style={styles.questionBadge}>
                        <Text style={styles.questionBadgeText}>{question.difficulty}</Text>
                        <Text style={styles.questionBadgeText}>{question.status}</Text>
                      </View>
                    </View>
                  ))
                : !isLoading && <Text style={{ fontSize: 20 }}>No Questions Found.</Text>}
            </ScrollView>
          )}
        </TouchableWithoutFeedback>

        <View
          style={[styles.pageSearchContainer, { marginBottom: keyboardVisible && Platform.OS === "ios" ? 100 : 0 }]}>
          <Pressable
            onPress={() => {
              dispatch(updateQuestionQuery({ sort: query.sort === "desc" ? "asc" : "desc" }));
            }}
            style={styles.sortButton}>
            {query.sort === "desc" ? (
              <MaterialCommunityIcons name="sort-calendar-descending" size={28} color="#121212" />
            ) : (
              <MaterialCommunityIcons name="sort-calendar-ascending" size={28} color="#121212" />
            )}
          </Pressable>
          <TextInput
            placeholder="Page"
            value={String(inputPage)}
            onSubmitEditing={handlePageChange}
            onChangeText={setInputPage}
            style={styles.pageInput}
            keyboardType="numeric"
          />
          <Text style={{ flex: 1 }}>of {data?.total_pages}</Text>
          <Pressable onPress={handlePageChange} style={styles.goButton}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.goButtonText}>Go</Text>
            )}
          </Pressable>

          <View style={styles.navigationButtons}>
            <Pressable
              style={styles.navigateButton}
              onPress={() => {
                !isLoading && query.page > 1 && dispatch(updateQuestionQuery({ page: +query.page - 1 }));
                !isLoading && query.page > 1 && setInputPage(+query.page - 1);
              }}>
              <Text style={styles.navigateButtonText}>{"<"}</Text>
            </Pressable>
            <Pressable
              style={styles.navigateButton}
              onPress={() => {
                !isLoading &&
                  query.page < data?.total_pages &&
                  dispatch(updateQuestionQuery({ page: +query.page + 1 }));
                !isLoading && query.page < data?.total_pages && setInputPage(+query.page + 1);
              }}>
              <Text style={styles.navigateButtonText}>{">"}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  searchContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: "#f3f3f3",
    fontSize: 18,
    borderRadius: 8,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: "#e9e9e9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: "#121212",
    fontSize: 16,
  },
  questionsContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  questionItem: {
    position: "relative",
    marginVertical: 10,
  },
  serialText: {
    fontSize: 16,
    marginBottom: 6,
  },
  serialLabel: { fontWeight: "600" },
  questionBadge: {
    position: "absolute",
    gap: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
    top: 12,
    right: -4,
  },
  questionBadgeText: {
    fontSize: 14,
    color: "#000000",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#dddddd",
    borderRadius: 4,
    boxShadow: "0 0 3 0 #00000021",
  },
  pageSearchContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  pageInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    height: 46,
    paddingHorizontal: 8,
  },
  goButton: {
    backgroundColor: COLORS.primary,
    height: 48,
    width: 72,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  goButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  navigationButtons: {
    flexDirection: "row",
    gap: 12,
  },
  navigateButton: {
    backgroundColor: "#e9e9e9",
    height: 48,
    width: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  navigateButtonText: { fontSize: 24 },

  sortButton: {
    backgroundColor: "#e9e9e9",
    height: 48,
    width: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});
