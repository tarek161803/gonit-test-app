import React, { useState } from "react";
import { View } from "react-native";
import useQuestionWithLatexAndImage from "../../hooks/useQuestionWithLatexAndImage";
import DOMComponent from "../SingleItem/DOMComponent";

const ExplanationView = ({ question }) => {
  const [height, setHeight] = useState("100%");
  const html = useQuestionWithLatexAndImage(question?.explanation, question?.images, question?.latex);

  return (
    <View style={{ height: height ? height + 16 : 0 }}>
      <DOMComponent
        dom={{
          PointerEvent: "none",
        }}
        setHeight={setHeight}
        html={html}
        mainImage={question.explanationImage}
      />
    </View>
  );
};

export default ExplanationView;
