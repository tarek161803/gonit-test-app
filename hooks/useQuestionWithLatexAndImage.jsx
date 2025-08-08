import { useMemo } from "react";

const useQuestionWithLatexAndImage = (question, images, latex = []) => {
  const contentString = useMemo(() => {
    if (!question) {
      return "";
    }

    return question.replace(/{(img|lat)(\d+)}/g, (match, type, index) => {
      const parsedIndex = parseInt(index, 10) - 1;
      if (type === "img") {
        return `<img src="${images[parsedIndex]}?v=123" alt="image-${parsedIndex}" />`;
      }
      if (type === "lat") {
        return latex[parsedIndex] || "";
      }
      return match;
    });
  }, [question, images, latex]);

  return contentString;
};

export default useQuestionWithLatexAndImage;
