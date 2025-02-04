import React, { useState } from "react";

import { View } from "react-native";
import useQuestionWithLatexAndImage from "../../hooks/useQuestionWithLatexAndImage";
import DOMComponent from "./DOMComponent";

const Question = ({ question }) => {
  const [height, setHeight] = useState(100);
  const questionHtml = useQuestionWithLatexAndImage(question.question, question.images, question.latex);

  return (
    <View>
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
        html={questionHtml.replace(/<br>/g, "<div class='line-break'></div>")}
        mainImage={question.image}
      />

      <View />
    </View>
  );
};

export default Question;
