import React, { useContext, useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import QuestionItem from "../../../components/QuestionItem";
import { UserContext } from "../../../context/UserContext";

const AnswersSection = () => {
  const { question } = useContext(UserContext);
  const answerOptions = [...question.wrongAnswers, question.answer].sort();

  const [answerStyle, setAnswerStyle] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");

  const handleCheckAnswer = (selectedAnswer) => {
    setUserAnswer(selectedAnswer);
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
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [userAnswer, question.answer]);

  return (
    <SafeAreaView>
      <ScrollView>
        <QuestionItem question={question} />

        {question.answerType === "input" ? (
          <View style={styles.container}>
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
          <View style={styles.container}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnswersSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  answerOption: {
    marginVertical: 5,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
  },
  answerText: {
    fontSize: 16,
    color: "#333",
  },
  correctAnswer: {
    backgroundColor: "#22c55e",
  },
  wrongAnswer: {
    backgroundColor: "#ef4444",
  },
  input: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  checkButton: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#555",
    alignItems: "center",
  },
  checkButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
