"use dom";
import renderMathInElement from "katex/dist/contrib/auto-render";

import { useEffect, useRef } from "react";
import "../../styles/katex-font.css";
import "../../styles/katex-latex.css";
import "../../styles/list-question.css";
import "../../styles/loto-font-family.css";

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

const DOMComponent = ({ html, onLayout, questionExtra1Html }) => {
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
    <div className="content">
      <div dangerouslySetInnerHTML={{ __html: html }} ref={containerRef} />
      {questionExtra1Html && (
        <div className="question-extra-1">
          <div dangerouslySetInnerHTML={{ __html: questionExtra1Html }} />
        </div>
      )}
    </div>
  );
};

export default DOMComponent;
