import React, { useState } from "react";
import { View } from "react-native";

import useQuestionWithLatexAndImage from "../../hooks/useQuestionWithLatexAndImage";
import DOMComponent from "./DOMComponent";

const SingleQuestionItem = ({ question }) => {
  const [height, setHeight] = useState(0);
  const questionHtml = useQuestionWithLatexAndImage(question.question, question.images, question.latex);

  return (
    <View style={{ height: height + 16 }}>
      <DOMComponent
        dom={{
          PointerEvent: "none",
          scrollEnabled: false,
        }}
        setHeight={setHeight}
        html={questionHtml}
        mainImage={question.image}
      />
    </View>
  );
};

export default SingleQuestionItem;
