import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import COLORS from "../../constants/Colors";
import useGetUserRole from "../../hooks/useGetUserRole";
import { useGetQuestionsQuery, useUpdateQuestionMutation } from "../../redux/slices/question/questionApi";
import { setQuestion, updateQuestionQuery } from "../../redux/slices/question/questionSlice";
import { buildQuery } from "../../utils/utils";

const FooterButtons = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  const userRole = useGetUserRole();
  const { query } = useSelector((state) => state.question);
  const { question } = useSelector((state) => state.question);

  const [verifiedMessage, setVerifiedMessage] = useState("Already Verified");
  const [publishedMessage, setPublishedMessage] = useState("Already Published");

  const [verifyQuestion, { isLoading: verifying }] = useUpdateQuestionMutation();
  const [publishQuestion, { isLoading: publishing }] = useUpdateQuestionMutation();

  const { data, isFetching } = useGetQuestionsQuery(buildQuery(query));
  const handleVerify = async () => {
    if (question.status === "verified" || question.status === "published") {
      return;
    }
    const response = await verifyQuestion({ id: question._id, body: { status: "verified" } }).unwrap();
    if (response.success) {
      dispatch(setQuestion(response.data));
      setVerifiedMessage("Successfully Verified");
    } else {
      Alert.alert("Error", "Failed to Verify Question.");
    }
  };

  const handlePublish = async () => {
    if (question.status === "published") {
      return;
    }
    const response = await publishQuestion({ id, body: { status: "published" } }).unwrap();
    if (response.success) {
      dispatch(setQuestion(response.data));
      setPublishedMessage("Successfully Published");
    } else {
      Alert.alert("Error", "Failed to Publish Question.");
    }
  };

  const handleNextQuestionNavigation = () => {
    if (isFetching) return;
    if (data?.total_pages === query.page && data?.data[data?.data?.length - 1]._id === id) {
      Alert.alert("End of Questions", "No more questions to show.");
      return;
    }
    if (data?.success) {
      const currentQuestionIndex = data.data.findIndex((q) => q._id === id);
      if (currentQuestionIndex < data?.data?.length - 1) {
        dispatch(setQuestion(data.data[currentQuestionIndex + 1]));
        router.replace(`/${data.data[currentQuestionIndex + 1]._id}`);
      } else {
        dispatch(updateQuestionQuery({ page: +query.page + 1 }));
      }
    }
  };

  useEffect(() => {
    if (data?.success) {
      if (data?.data?.every((q) => q._id !== id)) {
        dispatch(setQuestion(data.data[0]));
        router.replace(`/${data.data[0]._id}`);
      }
    }
  }, [data]);

  return (
    <View style={styles.container}>
      {userRole !== "admin" && question.status === "draft" ? (
        <Pressable
          onPress={handleVerify}
          style={[styles.verifyButton, { marginBottom: Platform.OS === "ios" ? 0 : 16 }]}>
          <Text style={styles.verifyButtonText}>
            {verifying
              ? "Verifying..."
              : question.status === "verified" || question.status === "published"
              ? "Verified"
              : "Verify Question"}
          </Text>
        </Pressable>
      ) : (
        <>
          {userRole !== "admin" ? (
            <View style={[styles.verifyButton, { marginBottom: Platform.OS === "ios" ? 0 : 16 }]}>
              <Text style={styles.verifyButtonText}>
                {question.status === "verified"
                  ? verifiedMessage
                  : question.status === "published"
                  ? publishedMessage
                  : "Not Verified"}
              </Text>
            </View>
          ) : null}
        </>
      )}

      {userRole === "admin" && (
        <>
          {question.status === "draft" ? (
            <Pressable
              onPress={handleVerify}
              style={[styles.verifyButton, { marginBottom: Platform.OS === "ios" ? 0 : 16 }]}>
              <Text style={styles.verifyButtonText}>
                {verifying ? "Verifying..." : question.status === "verified" ? "Verified" : "Verify Question"}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handlePublish}
              style={[styles.verifyButton, { marginBottom: Platform.OS === "ios" ? 0 : 16 }]}>
              <Text style={styles.verifyButtonText}>
                {publishing ? "Publishing..." : question.status === "published" ? publishedMessage : "Publish Question"}
              </Text>
            </Pressable>
          )}
        </>
      )}
      <Pressable onPress={handleNextQuestionNavigation} style={styles.nextBtn}>
        {isFetching ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.nextBtnText}>Next</Text>}
      </Pressable>
    </View>
  );
};

export default FooterButtons;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },

  verifyButton: {
    height: 50,
    width: "75%",
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  verifyButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "DefaultRegular",
  },

  nextBtn: {
    height: 50,
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#0faca5",
    alignItems: "center",
    justifyContent: "center",
  },

  nextBtnText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "DefaultRegular",
  },
});
