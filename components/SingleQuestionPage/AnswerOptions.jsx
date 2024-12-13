import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, Pressable, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import COLORS from "../../constants/Colors";

const AnswerOptions = () => {
  const { width } = Dimensions.get("window");

  const [answerStyle, setAnswerStyle] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const { question } = useSelector((state) => state.question);

  const answerOptions = useMemo(
    () => [...question.wrongAnswers, question.answer].sort(() => Math.random() - 0.5),
    [answerOptions]
  );

  useEffect(() => {
    let timeoutId;
    if (userAnswer) {
      if (userAnswer.trim() === question.answer) {
        setAnswerStyle(styles.correctAnswer);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setAnswerStyle(styles.wrongAnswer);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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

  const renderOptions = () => {
    if (answerOptions.every((option) => option.length === 1)) {
      return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
          {answerOptions.sort().map((option, index) => (
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
        <View style={{ gap: 16, marginBottom: 10, marginTop: 10 }}>
          {question.wrongAnswers &&
            answerOptions.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => handleCheckAnswer(option)}
                style={[styles.answerOption, userAnswer === option && answerStyle]}>
                <Text
                  style={[
                    styles.answerText,
                    { fontSize: 20 },
                    { color: userAnswer === option ? "#ffffff" : "#333333" },
                  ]}>
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

  const handleCheckAnswer = (selectedAnswer) => {
    setUserAnswer(selectedAnswer);
  };

  return question.answerType === "multiple" ? (
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
        <Text style={[styles.checkButtonText, { color: userAnswer ? "#ffffff" : "#333333" }]}>Check Answer</Text>
      </Pressable>
    </View>
  );
};

export default AnswerOptions;

const styles = {
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
    fontFamily: "DefaultBold",
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
};
