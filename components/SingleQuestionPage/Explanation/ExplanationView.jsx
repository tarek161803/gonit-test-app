import React, { useState } from "react";
import { View } from "react-native";
import useQuestionWithLatexAndImage from "../../../hooks/useQuestionWithLatexAndImage";
import ExplanationDom from "./ExplanationDom";

const ExplanationView = ({ question }) => {
  const [height, setHeight] = useState(200);
  const explanation = useQuestionWithLatexAndImage(question?.explanation, question?.images, question?.latex);
  const explanationExtra1 = useQuestionWithLatexAndImage(
    question?.explanationExtra1,
    question?.images,
    question?.latex
  );

  return (
    <View style={{ marginTop: 10 }}>
      <ExplanationDom
        onLayout={async (size) => {
          if (size[1] !== height) {
            setHeight(size[1]);
          }
        }}
        dom={{
          PointerEvent: "none",
          scrollEnabled: false,
          style: { height },
        }}
        html={explanation.replace(/<br>/g, "<div class='line-break'></div>")}
        explanationExtra1={explanationExtra1.replace(/<br>/g, "<div class='line-break'></div>")}
        mainImage={question.explanationImage}
      />
    </View>
  );
};

export default ExplanationView;
