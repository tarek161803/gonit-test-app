import { useMemo } from "react";

const useQuestionWithLatexAndImage = (question, images, latex = []) => {
  const contentString = useMemo(() => {
    return question.replace(/{(img|lat)(\d+)}/g, (match, type, index) => {
      const parsedIndex = parseInt(index, 10) - 1;
      if (type === "img") {
        return `<img src="data:image/svg+xml;utf8,${encodeURIComponent(
          images[parsedIndex]
        )}" alt="image-${parsedIndex}" />`;
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
