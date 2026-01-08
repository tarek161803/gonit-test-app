import { useState } from "react";

import { View } from "react-native";
import useQuestionWithLatexAndImage from "../../hooks/useQuestionWithLatexAndImage";
import DOMComponent from "./DOMComponent";

const Question = ({ question }) => {
  const [height, setHeight] = useState(100);
  const questionHtml = useQuestionWithLatexAndImage(
    question.question,
    question.imageUrls,
    question.latex
  );
  const questionExtra1Html = useQuestionWithLatexAndImage(
    question.questionExtra1 || "",
    question.imageUrls,
    question.latex
  );
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
        mainLatex={question?.mainLatex}
        html={questionHtml
          .replace(/<br>/g, "<span class='line-break'></span>")
          .replace("<p>", "<p><strong>Q: </strong>")}
        questionExtra1Html={questionExtra1Html.replace(
          /<br>/g,
          "<span class='line-break'></span>"
        )}
        mainImage={question?.imageUrl}
      />

      <View />
    </View>
  );
};

export default Question;
