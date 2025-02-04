"use dom";
import renderMathInElement from "katex/dist/contrib/auto-render";

import { useEffect, useRef } from "react";
import "../../styles/katex-font.css";
import "../../styles/katex-latex.css";
import "../../styles/list-question.css";
import "../../styles/loto-font-family.css";

const DOMComponent = ({ html }) => {
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

  return <div className="content" dangerouslySetInnerHTML={{ __html: html }} ref={containerRef} />;
};

export default DOMComponent;
