import React, { useContext, useEffect, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SvgXml } from "react-native-svg";
import QuestionItem from "../../components/QuestionItem";
import { BASE_URL } from "../../constants/Utils";
import { UserContext } from "../../context/UserContext";

const AnswersSection = () => {
  const { question, user, setQuestion } = useContext(UserContext);
  const answerOptions = [...question.wrongAnswers, question.answer].sort();
  const [isLoading, setIsLoading] = useState(false);

  const [answerStyle, setAnswerStyle] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");

  const handleCheckAnswer = (selectedAnswer) => {
    setUserAnswer(selectedAnswer);
  };

  const handleVerify = async () => {
    if (question.status === "verified") {
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
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
        <View style={{ marginVertical: 12 }}>
          <QuestionItem question={question} />
        </View>

        {question.image && (
          <View style={styles.mainImageContainer}>
            <SvgXml xml={question.image} width="100%" height="200" />
          </View>
        )}

        {question.answerType === "multiple" ? (
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

        <Pressable onPress={handleVerify} style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>
            {isLoading ? "Verifying..." : question.status === "verified" ? "Verified" : "Verify Question"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnswersSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainImageContainer: {
    marginVertical: 10,
    padding: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    borderRadius: 12,
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
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
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

  verifyButton: {
    padding: 16,
    marginVertical: 16,
    borderRadius: 8,
    backgroundColor: "#22c55e",
    alignItems: "center",
  },

  verifyButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
