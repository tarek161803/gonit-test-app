import React, { useEffect, useState } from "react";
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

import { useLocalSearchParams } from "expo-router";
import AnswerOptions from "../../components/SingleQuestionPage/AnswerOptions";
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
            keyboardShouldPersistTaps="handled"
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
            contentContainerStyle={{ backgroundColor: "#FBF8F6", flexGrow: 1 }}>
            <View style={{ flex: 1, marginVertical: 12, paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 16, marginBottom: 8, textAlign: "right", color: "#666666", fontWeight: "500" }}>
                {question.serial}
              </Text>
              <SingleQuestion question={question} />

              {showHint && (
                <>
                  {question.hint ? (
                    <Text
                      style={{
                        fontSize: 16,
                        marginBottom: 8,
                        textAlign: "right",
                        color: "#666666",
                        fontWeight: "500",
                      }}>
                      {question.hint}
                    </Text>
                  ) : (
                    <View>
                      <Text>No Hint Available</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        <View style={[styles.container, { paddingBottom: Platform.OS === "ios" && keyboardVisible ? 110 : 0 }]}>
          <InfoBtnContainer showHint={showHint} setShowHint={setShowHint} />
          <AnswerOptions />
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
    position: "relative",
  },
});
