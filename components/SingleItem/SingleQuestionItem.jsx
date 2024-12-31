import React, { useState } from "react";
import { ScrollView, View } from "react-native";

import useQuestionWithLatexAndImage from "../../hooks/useQuestionWithLatexAndImage";
import DOMComponent from "./DOMComponent";

const SingleQuestionItem = ({ question }) => {
  const [height, setHeight] = useState(0);
  const questionHtml = useQuestionWithLatexAndImage(question.question, question.images, question.latex);

  return (
    <ScrollView style={{ height: "100%" }}>
      <View style={{ height }}>
        <DOMComponent
          dom={{
            PointerEvent: "none",
          }}
          setHeight={setHeight}
          html={questionHtml}
          mainImage={question.image}
        />
      </View>
    </ScrollView>
  );
};

export default SingleQuestionItem;
