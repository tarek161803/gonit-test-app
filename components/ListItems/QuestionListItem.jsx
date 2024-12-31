import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { useDispatch } from "react-redux";
import useQuestionWithLatexAndImage from "../../hooks/useQuestionWithLatexAndImage";
import { setQuestion } from "../../redux/slices/question/questionSlice";
import DOMComponent from "./DOMComponent";

const QuestionListItem = ({ question }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [height, setHeight] = useState(0);

  const questionHtml = useQuestionWithLatexAndImage(question.question, question.images, question.latex);
  return (
    <Pressable
      onPress={() => {
        dispatch(setQuestion(question));
        router.push(`/${question._id}`);
      }}
      style={{
        height,
        backgroundColor: "#FBF8F6",
        borderRadius: 12,
      }}>
      <DOMComponent
        dom={{
          scrollEnabled: false,
        }}
        setHeight={setHeight}
        html={questionHtml}
      />
    </Pressable>
  );
};

export default QuestionListItem;
