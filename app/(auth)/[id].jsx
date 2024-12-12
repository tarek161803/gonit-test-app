import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import SingleQuestion from "../../components/SingleQuestion";

import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import AnswerOptions from "../../components/SingleQuestionPage/AnswerOptions";
import ExplanationView from "../../components/SingleQuestionPage/ExplanationView";
import FooterButtons from "../../components/SingleQuestionPage/FooterButtons";
import InfoBtnContainer from "../../components/SingleQuestionPage/InfoBtnContainer";
import { useGetQuestionByIdQuery } from "../../redux/slices/question/questionApi";
import { setQuestion } from "../../redux/slices/question/questionSlice";

const AnswersSection = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { question } = useSelector((state) => state.question);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [skip, setSkip] = useState(true);
  const { data, isLoading, refetch } = useGetQuestionByIdQuery(id, { skip });

  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const [checkHintAndExplanation, setCheckHintAndExplanation] = useState({ hint: false, explanation: false });

  useEffect(() => {
    if (data?.success) {
      dispatch(setQuestion(data.data));
    }
  }, [data]);

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
  const scrollViewRef = useRef(null);
  const hintRef = useRef(null);
  const explanationRef = useRef(null);

  const handleHintShow = () => {
    setShowHint((prevState) => !prevState);
    setCheckHintAndExplanation((prevState) => ({ ...prevState, hint: true }));
    setTimeout(() => {
      hintRef.current?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y, animated: true });
        },
        (error) => console.error(error)
      );
    }, 100);
  };

  const handleExplanationShow = () => {
    setShowExplanation((prevState) => !prevState);
    setCheckHintAndExplanation((prevState) => ({ ...prevState, explanation: true }));
    setTimeout(() => {
      explanationRef.current?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y, animated: true });
        },
        (error) => console.error(error)
      );
    }, 600);
  };

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FBF8F6" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : "padding"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
          <ScrollView
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
            contentContainerStyle={{ backgroundColor: "#FBF8F6", flexGrow: 1 }}>
            <View style={{ flex: 1, marginVertical: 12, paddingHorizontal: 16, paddingBottom: 70 }}>
              <Text style={{ fontSize: 16, marginBottom: 8, textAlign: "right", color: "#666666", fontWeight: "500" }}>
                {question.serial}
              </Text>
              <SingleQuestion question={question} />
              <>
                {showHint && (
                  <View ref={hintRef}>
                    {question.hint ? (
                      <View style={{ marginTop: 10 }}>
                        <View style={styles.infoTitle}>
                          <AntDesign name="questioncircleo" size={20} color="#1BB3FC" />
                          <Text style={styles.infoTitleText}>Hint</Text>
                        </View>
                        <Text style={styles.hintText}>{question.hint}</Text>
                      </View>
                    ) : (
                      <View style={{ marginTop: 20, flexDirection: "row", gap: 5, alignItems: "center" }}>
                        <View style={{ height: 24, width: 24 }}>
                          <MaterialIcons name="error-outline" size={24} color="red" />
                        </View>
                        <Text style={{ fontSize: 18, color: "#333333" }}>Hint Not Available</Text>
                      </View>
                    )}
                  </View>
                )}

                {showExplanation && (
                  <View ref={explanationRef}>
                    {question.explanation || question.explanationImage ? (
                      <View style={{ marginTop: 16 }}>
                        <View style={styles.infoTitle}>
                          <AntDesign name="questioncircleo" size={20} color="#1BB3FC" />
                          <Text style={styles.infoTitleText}>Explanation</Text>
                        </View>
                        <ExplanationView question={question} />
                      </View>
                    ) : (
                      <View style={{ marginTop: 10, flexDirection: "row", gap: 5, alignItems: "center" }}>
                        <View style={{ height: 24, width: 24 }}>
                          <MaterialIcons name="error-outline" size={24} color="red" />
                        </View>
                        <Text style={{ fontSize: 18, color: "#333333" }}>Explanation Not Available</Text>
                      </View>
                    )}
                  </View>
                )}
              </>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        <View style={[styles.container, { paddingBottom: Platform.OS === "ios" && keyboardVisible ? 110 : 0 }]}>
          <InfoBtnContainer
            showHint={showHint}
            showExplanation={showExplanation}
            handleHintShow={handleHintShow}
            handleExplanationShow={handleExplanationShow}
          />
          <AnswerOptions />
          <FooterButtons checkHintAndExplanation={checkHintAndExplanation} />
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
    position: "relative",
  },

  infoTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: "#1BB3FC",
  },

  infoTitleText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1BB3FC",
  },

  hintText: {
    fontSize: 18,
    marginTop: 6,
    color: "#342618",
  },
});
