"use dom";
import renderMathInElement from "katex/dist/contrib/auto-render";
import { useEffect, useRef } from "react";
import "../../styles/katex-font.css";
import "../../styles/katex-latex.css";
import "../../styles/loto-font-family.css";
import "../../styles/single-question.css";

function useSize(callback) {
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        callback([width, height]);
      }
    });

    observer.observe(document.body);

    callback([document.body.clientWidth, document.body.clientHeight]);

    return () => {
      observer.disconnect();
    };
  }, [callback]);
}

const DOMComponent = ({ html, questionExtra1Html, mainImage, onLayout }) => {
  useSize(onLayout);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      renderMathInElement(containerRef.current, {
        delimiters: [
          { left: "€€", right: "€€", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "€", right: "€", display: false },
          { left: "\\(", right: "\\)", display: false },
        ],
      });
    }
  }, [containerRef.current, html]);

  return (
    <div className="content" ref={containerRef}>
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
      {mainImage && (
        <div className="main-image-container">
          <img
            className="main-image"
            src={`data:image/svg+xml;utf8,${encodeURIComponent(mainImage)}`}
            alt="main-image"
          />
        </div>
      )}
      {questionExtra1Html && (
        <div className="question-extra-1">
          <div dangerouslySetInnerHTML={{ __html: questionExtra1Html }} />
        </div>
      )}
    </div>
  );
};

export default DOMComponent;
