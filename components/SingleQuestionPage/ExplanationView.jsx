import React, { useState } from "react";
import { View } from "react-native";
import useQuestionWithLatexAndImage from "../../hooks/useQuestionWithLatexAndImage";
import DOMComponent from "./DOMComponent";

const ExplanationView = ({ question }) => {
  const [height, setHeight] = useState(200);
  const html = useQuestionWithLatexAndImage(question?.explanation, question?.images, question?.latex);

  return (
    <View style={{ marginTop: 10 }}>
      <DOMComponent
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
        html={html.replace(/<br>/g, "<div class='line-break'></div>")}
        mainImage={question.explanationImage}
      />
    </View>
  );
};

export default ExplanationView;
