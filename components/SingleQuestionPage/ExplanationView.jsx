import React from "react";
import { View } from "react-native";
import useQuestionWithLatexAndImage from "../../hooks/useQuestionWithLatexAndImage";
import DOMComponent from "./DOMComponent";

const ExplanationView = ({ question }) => {
  const html = useQuestionWithLatexAndImage(question?.explanation, question?.images, question?.latex);

  return (
    <View>
      <DOMComponent
        dom={{
          PointerEvent: "none",
          scrollEnabled: false,
          matchContents: true,
        }}
        html={html}
        mainImage={question.explanationImage}
      />
    </View>
  );
};

export default ExplanationView;
