import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

import { default as QuestionItem } from "../../components/QuestionItem";
import COLORS from "../../constants/Colors";
import { BASE_URL } from "../../constants/Utils";
import { UserContext } from "../../context/UserContext";

const Home = () => {
  const { user, setTotalPages, totalPages } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [inputPage, setInputPage] = useState(1);
  const [page, setPage] = useState(1);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchQuestions = useCallback(
    async (query = "") => {
      setRefreshing(true);
      const url = BASE_URL + `questions?page=${page}${query && `&search=${query}`}`;
      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data = await response.json();
        if (data.success) {
          setQuestions(data.data);
          setRefreshing(false);
          setTotalPages(data.total_pages);
        } else {
          Alert.alert("Something Went Wrong!", "Please try again later.");
          setRefreshing(false);
        }
      } catch {
        Alert.alert("Error", "Failed to fetch questions.");
        setRefreshing(false);
      }
    },
    [page, user?.token, setTotalPages]
  );

  const handleRefresh = () => fetchQuestions(searchQuery);

  const handlePageChange = () => {
    Keyboard.dismiss();
    if (refreshing || !inputPage || inputPage === page || inputPage <= 0 || inputPage > totalPages) return;
    setPage(inputPage);
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    setPage(1);
    setInputPage(1);
    if (searchQuery) fetchQuestions(searchQuery);
  };

  useEffect(() => {
    if (!searchQuery) fetchQuestions();
  }, [searchQuery]);

  useEffect(() => {
    fetchQuestions(searchQuery);
  }, [page, fetchQuestions]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : "padding"} style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <TextInput onChangeText={setSearchQuery} placeholder="Question / Serial" style={styles.searchInput} />
          <Pressable onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </Pressable>
        </View>

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
          <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            style={styles.questionsContainer}>
            {questions.length
              ? questions.map((question) => (
                  <View style={styles.questionItem} key={question._id}>
                    <Text style={styles.serialText}>
                      <Text style={styles.serialLabel}>S/N: </Text>
                      {question.serial}
                    </Text>
                    <QuestionItem question={question} />
                    <View style={styles.questionBadge}>
                      <Text style={styles.questionBadgeText}>{question.status}</Text>
                    </View>
                  </View>
                ))
              : !refreshing && <Text style={{ fontSize: 20 }}>No Questions Found.</Text>}
          </ScrollView>
        </TouchableWithoutFeedback>

        <View
          style={[styles.pageSearchContainer, { marginBottom: keyboardVisible && Platform.OS === "ios" ? 100 : 0 }]}>
          <TextInput
            placeholder="Page"
            value={String(inputPage)}
            onSubmitEditing={handlePageChange}
            onChangeText={setInputPage}
            style={styles.pageInput}
            keyboardType="numeric"
          />
          <Text style={{ flex: 1 }}>of {totalPages}</Text>
          <Pressable onPress={handlePageChange} style={styles.goButton}>
            {refreshing ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.goButtonText}>Go</Text>
            )}
          </Pressable>

          <View style={styles.navigationButtons}>
            <Pressable
              style={styles.navigateButton}
              onPress={() => {
                !refreshing && page > 1 && setPage(+page - 1);
                !refreshing && page > 1 && setInputPage(+page - 1);
              }}>
              <Text style={styles.navigateButtonText}>{"<"}</Text>
            </Pressable>
            <Pressable
              style={styles.navigateButton}
              onPress={() => {
                !refreshing && page < totalPages && setPage(+page + 1);
                !refreshing && page < totalPages && setInputPage(+page + 1);
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
    padding: 10,
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
  questionsContainer: {
    flex: 1,
    padding: 10,
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
    flex: 1,
    position: "absolute",
    top: 14,
    right: -4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#ececec",
    borderRadius: 6,
    elevation: 2,
  },
  questionBadgeText: {
    flex: 1,
    textTransform: "capitalize",
    fontSize: 14,
    color: "#333",
  },
  pageSearchContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
  },
  pageInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 8,
  },
  goButton: {
    backgroundColor: COLORS.primary,
    height: 48,
    width: 96,
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
});
