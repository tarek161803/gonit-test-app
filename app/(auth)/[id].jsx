import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
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
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const { width } = Dimensions.get("window");

  const renderOptions = () => {
    if (answerOptions.every((option) => option.length === 1)) {
      return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
          {answerOptions.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => handleCheckAnswer(option)}
              style={[styles.answerOption, userAnswer === option && answerStyle, { flex: 1 }]}>
              <Text style={styles.answerText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      );
    }

    if (answerOptions.every((option) => option.length > 1 && option.length < 6)) {
      return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
          {answerOptions.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => handleCheckAnswer(option)}
              style={[styles.answerOption, userAnswer === option && answerStyle, { width: (width - 52) / 2 }]}>
              <Text style={styles.answerText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      );
    }

    return (
      <View style={{ gap: 20, marginBottom: 10, marginTop: 10 }}>
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
    );
  };

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
        <View style={[styles.container, { paddingBottom: Platform.OS === "ios" && keyboardVisible ? 110 : 0 }]}>
          {question.answerType === "multiple" ? (
            renderOptions(answerOptions)
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
    boxShadow: "0 -5 10  #0000001d",
  },

  answerOption: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D8D7D6",
    boxShadow: "0 5 0 0 #D8D7D6",
  },

  answerText: {
    fontSize: 24,
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
