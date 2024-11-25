import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import QuestionItem from "../../components/QuestionItem";
import { BASE_URL } from "../../constants/Utils";
import { UserContext } from "../../context/UserContext";

const Home = () => {
  const { user, setTotalPages, totalPages } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [inputPage, setInputPage] = useState(1);
  const [page, setPage] = useState(null);

  const getQuestions = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(BASE_URL + `questions?page=${page}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
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
  };

  const handleRefresh = () => {
    getQuestions();
  };

  const handlePageChange = () => {
    if (totalPages && inputPage > totalPages) {
      Alert.alert("Invalid Page", `Please enter a valid full number less than or equal to ${totalPages}.`);
      return;
    }

    if (!inputPage) {
      return;
    }

    if (inputPage === page) {
      return;
    }

    if (refreshing) {
      return;
    }

    if (!Number.isInteger(+inputPage) || inputPage <= 0) {
      Alert.alert("Invalid Page", "Please enter a valid full number greater than 0.");
      return;
    }

    setPage(inputPage);
  };

  useEffect(() => {
    getQuestions();
  }, [page]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        style={styles.questionsContainer}>
        {questions.length > 0 &&
          questions.map((question) => (
            <View style={styles.questionItem} key={question._id}>
              <QuestionItem question={question} />
              <View style={styles.questionBadge}>
                <Text style={styles.questionBadgeText}>{question.status}</Text>
              </View>
            </View>
          ))}
      </ScrollView>
      <View style={styles.pageSearchContainer}>
        <TextInput
          placeholder="Page"
          value={String(inputPage)}
          onSubmitEditing={handlePageChange}
          onChangeText={(value) => {
            setInputPage(value);
          }}
          style={styles.pageInput}
          keyboardType="numeric"
        />
        <Pressable onPress={handlePageChange} style={styles.goButton}>
          {refreshing ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.goButtonText}>Go</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  questionsContainer: {
    padding: 10,
  },

  questionItem: {
    position: "relative",
    backgroundColor: "#f8f8f8",
    marginVertical: 10,
  },

  questionBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    elevation: 2,
  },

  questionBadgeText: {
    fontSize: 14,
    color: "#333",
  },

  pageSearchContainer: {
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
    backgroundColor: "#22c55e",
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
});
