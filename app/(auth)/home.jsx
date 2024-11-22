import React, { useContext, useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import QuestionItem from "../../components/QuestionItem";
import { BASE_URL } from "../../constants/Utils";
import { UserContext } from "../../context/UserContext";

const Home = () => {
  const { user } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);

  const getQuestions = async () => {
    try {
      const response = await fetch(BASE_URL + "questions", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setQuestions(data.data);
      } else {
        Alert.alert("Something Went Wrong!", "Please try again later.");
      }
    } catch {
      Alert.alert("Error", "Failed to fetch questions.");
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.questionsContainer}>
        {questions.length > 0 && questions.map((question) => <QuestionItem key={question._id} question={question} />)}
      </ScrollView>
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
});
