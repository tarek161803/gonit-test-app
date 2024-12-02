import React, { useContext, useEffect, useState } from "react";
import {
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
import SingleQuestion from "../../components/SingleQuestion";
import COLORS from "../../constants/Colors";
import { BASE_URL } from "../../constants/Utils";
import { UserContext } from "../../context/UserContext";

const AnswersSection = () => {
  const { question, user, setQuestion } = useContext(UserContext);
  const answerOptions = [...question.wrongAnswers, question.answer].sort();
  const [isLoading, setIsLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [answerStyle, setAnswerStyle] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");

  const handleCheckAnswer = (selectedAnswer) => {
    setUserAnswer(selectedAnswer);
  };

  const handleVerify = async () => {
    if (question.status === "verified" || question.status === "published") {
      return;
    }

    setIsLoading(true);
    const response = await fetch(BASE_URL + `questions/${question._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ status: "verified" }),
    });

    const data = await response.json();
    if (data.success) {
      setQuestion(data.data);
      setIsLoading(false);
    } else {
      Alert.alert("Error", "Failed to Verify Question.");
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (question.status === "published") {
      return;
    }

    setPublishing(true);
    const response = await fetch(BASE_URL + `questions/${question._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ status: "published" }),
    });

    const data = await response.json();
    if (data.success) {
      setQuestion(data.data);
      setPublishing(false);
    } else {
      Alert.alert("Error", "Failed to Publish Question.");
      setPublishing(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(BASE_URL + `questions/${question._id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setQuestion(data.data);
        setRefreshing(false);
      }
    } catch {
      Alert.alert("Error", "Failed to fetch question.");
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let timeoutId;
    if (userAnswer) {
      if (userAnswer.trim() === question.answer) {
        setAnswerStyle(styles.correctAnswer);
      } else {
        setAnswerStyle(styles.wrongAnswer);
      }

      timeoutId = setTimeout(() => {
        setAnswerStyle(null);
        setUserAnswer(null);
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [userAnswer, question.answer]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FBF8F6" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : "padding"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            contentContainerStyle={{ backgroundColor: "#FBF8F6", flexGrow: 1 }}>
            <View style={{ flex: 1, marginVertical: 12, paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 16, marginBottom: 6 }}>
                <Text style={{ fontFamily: "DefaultBold" }}>S/N: </Text>
                {question.serial}
              </Text>
              <SingleQuestion question={question} />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          {question.answerType === "input" ? (
            <View>
              {question.wrongAnswers &&
                answerOptions.map((option, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleCheckAnswer(option)}
                    style={[styles.answerOption, userAnswer === option && answerStyle]}>
                    <Text style={styles.answerText}>{option}</Text>
                  </Pressable>
                ))}
            </View>
          ) : (
            <View>
              <TextInput
                onChangeText={setInputAnswer}
                value={inputAnswer}
                style={styles.input}
                keyboardType={question.inputType === "number" ? "numeric" : "default"}
                placeholder="Enter Answer Here"
              />
              <Pressable
                onPress={() => handleCheckAnswer(inputAnswer)}
                style={[styles.checkButton, userAnswer === inputAnswer && answerStyle]}>
                <Text style={styles.checkButtonText}>Check Answer</Text>
              </Pressable>
            </View>
          )}

          <View style={{ marginTop: 12 }}>
            {user?.user?.role !== "admin" && question.status === "draft" ? (
              <Pressable
                onPress={handleVerify}
                style={[styles.verifyButton, { marginBottom: Platform.OS === "ios" ? 0 : 16 }]}>
                <Text style={styles.verifyButtonText}>
                  {isLoading
                    ? "Verifying..."
                    : question.status === "verified" || question.status === "published"
                    ? "Verified"
                    : "Verify Question"}
                </Text>
              </Pressable>
            ) : (
              <>
                {user?.user?.role !== "admin" ? (
                  <View style={[styles.verifyButton, { marginBottom: Platform.OS === "ios" ? 0 : 16 }]}>
                    <Text style={styles.verifyButtonText}>
                      {question.status === "verified"
                        ? "Already Verified"
                        : question.status === "published"
                        ? "Already Published"
                        : "Not Verified"}
                    </Text>
                  </View>
                ) : null}
              </>
            )}

            {user?.user?.role === "admin" && (
              <>
                {question.status === "draft" ? (
                  <Pressable
                    onPress={handleVerify}
                    style={[styles.verifyButton, { marginBottom: Platform.OS === "ios" ? 0 : 16 }]}>
                    <Text style={styles.verifyButtonText}>
                      {isLoading ? "Verifying..." : question.status === "verified" ? "Verified" : "Verify Question"}
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={handlePublish}
                    style={[styles.verifyButton, { marginBottom: Platform.OS === "ios" ? 0 : 16 }]}>
                    <Text style={styles.verifyButtonText}>
                      {publishing
                        ? "Publishing..."
                        : question.status === "published"
                        ? "Already Published"
                        : "Publish Question"}
                    </Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AnswersSection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  mainImageContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    borderRadius: 12,
    height: "auto",
  },
  answerOption: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D8D7D6",
    boxShadow: "0 5 0 0 #D8D7D6",
  },

  answerText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  correctAnswer: {
    backgroundColor: COLORS.primary,
  },
  wrongAnswer: {
    backgroundColor: "#ef4444",
  },
  input: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderColor: "#D8D7D6",
    borderWidth: 1,
  },
  checkButton: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    alignItems: "center",
    borderColor: "#D8D7D6",
    borderWidth: 1,
    boxShadow: "0 5 0 0 #D8D7D6",
  },
  checkButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "bold",
  },

  verifyButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },

  verifyButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "DefaultRegular",
  },
});
