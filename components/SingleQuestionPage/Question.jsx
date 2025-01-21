import React from "react";

import useQuestionWithLatexAndImage from "../../hooks/useQuestionWithLatexAndImage";
import DOMComponent from "./DOMComponent";

const Question = ({ question }) => {
  const questionHtml = useQuestionWithLatexAndImage(question.question, question.images, question.latex);

  return (
    <DOMComponent
      dom={{
        PointerEvent: "none",
        scrollEnabled: false,
        matchContents: true,
      }}
      html={questionHtml}
      mainImage={question.image}
    />
  );
};

export default Question;
