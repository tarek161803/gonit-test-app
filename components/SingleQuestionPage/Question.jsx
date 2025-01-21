import React from "react";
import { View } from "react-native";

import useQuestionWithLatexAndImage from "../../hooks/useQuestionWithLatexAndImage";
import DOMComponent from "./DOMComponent";

const Question = ({ question }) => {
  const questionHtml = useQuestionWithLatexAndImage(question.question, question.images, question.latex);

  return (
    <View>
      <DOMComponent
        dom={{
          PointerEvent: "none",
          scrollEnabled: false,
          matchContents: true,
        }}
        html={questionHtml}
        mainImage={question.image}
      />
    </View>
  );
};

export default Question;
