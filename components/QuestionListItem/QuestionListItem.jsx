import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { useDispatch } from "react-redux";
import useQuestionWithLatexAndImage from "../../hooks/useQuestionWithLatexAndImage";
import { setQuestion } from "../../redux/slices/question/questionSlice";
import DOMComponent from "./DOMComponent";

const QuestionListItem = ({ question }) => {
  const [height, setHeight] = useState(50);
  const dispatch = useDispatch();
  const router = useRouter();

  const questionHtml = useQuestionWithLatexAndImage(question.question, question.images, question.latex);
  const questionExtra1Html = useQuestionWithLatexAndImage(question.questionExtra1, question.images, question.latex);

  return (
    <Pressable
      onPress={() => {
        dispatch(setQuestion(question));
        router.push(`/${question._id}`);
      }}
      style={{
        backgroundColor: "#FBF8F6",
        borderRadius: 12,
      }}>
      <DOMComponent
        onLayout={async (size) => {
          if (size[1] !== height + 5 || size[1] !== height - 5) {
            setHeight(size[1]);
          }
        }}
        dom={{
          PointerEvent: "none",
          scrollEnabled: false,
          style: { height },
        }}
        html={questionHtml.replace(/<br>/g, "<span class='line-break'></span>")}
        questionExtra1Html={questionExtra1Html.replace(/<br>/g, "<span class='line-break'></span>")}
      />
    </Pressable>
  );
};

export default QuestionListItem;
