import React, { useState } from "react";

import { View } from "react-native";
import useQuestionWithLatexAndImage from "../../hooks/useQuestionWithLatexAndImage";
import DOMComponent from "./DOMComponent";

const Question = ({ question }) => {
  const [height, setHeight] = useState(200);
  const questionHtml = useQuestionWithLatexAndImage(question.question, question.images, question.latex);

  return (
    <View style={{ height }}>
      <DOMComponent
        onLayout={async (size) => {
          if (size[1] !== height) {
            setHeight(size[1]);
          }
        }}
        dom={{
          PointerEvent: "none",
          scrollEnabled: false,
        }}
        html={questionHtml}
        mainImage={question.image}
      />
    </View>
  );
};

export default Question;
