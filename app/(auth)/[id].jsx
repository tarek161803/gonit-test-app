import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import SingleQuestion from "../../components/SingleQuestion";

import { useLocalSearchParams } from "expo-router";
import FooterButtons from "../../components/SingleQuestionPage/FooterButtons";
import COLORS from "../../constants/Colors";
import { useGetQuestionByIdQuery } from "../../redux/slices/question/questionApi";
import { setQuestion } from "../../redux/slices/question/questionSlice";

const AnswersSection = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();

  const { question } = useSelector((state) => state.question);
  const answerOptions = [...question.wrongAnswers, question.answer].sort();

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [skip, setSkip] = useState(true);
  const { data, isLoading, refetch } = useGetQuestionByIdQuery(id, { skip });

  const [answerStyle, setAnswerStyle] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");

  useEffect(() => {
    if (data?.success) {
      dispatch(setQuestion(data.data));
    }
  }, [data]);

  const handleCheckAnswer = (selectedAnswer) => {
    setUserAnswer(selectedAnswer);
  };

  const handleRefresh = async () => {
    try {
      if (!skip) {
        refetch();
      } else {
        setSkip(false);
      }
    } catch {
      Alert.alert("Error", "Failed to fetch question.");
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
              <Text style={[styles.answerText, { color: userAnswer === option ? "#ffffff" : "#333333" }]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      );
    }

    if (answerOptions.some((option) => option.length > 5)) {
      return (
        <View style={{ gap: 20, marginBottom: 10, marginTop: 10 }}>
          {question.wrongAnswers &&
            answerOptions.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => handleCheckAnswer(option)}
                style={[styles.answerOption, userAnswer === option && answerStyle]}>
                <Text style={[styles.answerText, { color: userAnswer === option ? "#ffffff" : "#333333" }]}>
                  {option}
                </Text>
              </Pressable>
            ))}
        </View>
      );
    }

    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
        {answerOptions.map((option, index) => (
          <Pressable
            key={index}
            onPress={() => handleCheckAnswer(option)}
            style={[styles.answerOption, userAnswer === option && answerStyle, { width: (width - 52) / 2 }]}>
            <Text style={[styles.answerText, { color: userAnswer === option ? "#ffffff" : "#333333" }]}>{option}</Text>
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
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
            contentContainerStyle={{ backgroundColor: "#FBF8F6", flexGrow: 1 }}>
            <View style={{ flex: 1, marginVertical: 12, paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 16, marginBottom: 8, textAlign: "right", color: "#666666", fontWeight: "500" }}>
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
                <Text style={[styles.checkButtonText, { color: userAnswer ? "#ffffff" : "#333333" }]}>
                  Check Answer
                </Text>
              </Pressable>
            </View>
          )}

          <FooterButtons />
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
    fontFamily: "DefaultRegular",
  },
  correctAnswer: {
    backgroundColor: COLORS.primary,
    boxShadow: "0 5 0 0 #1a9b49",
    borderColor: COLORS.primary,
  },
  wrongAnswer: {
    backgroundColor: "#FF4B4C",
    boxShadow: "0 5 0 0 #E12C2E",
    borderColor: "#FF4B4C",
  },
  input: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderColor: "#D8D7D6",
    borderWidth: 1,
    fontFamily: "DefaultRegular",
    fontSize: 18,
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
    fontSize: 18,
    fontFamily: "DefaultBold",
  },
});
