"use dom";
import renderMathInElement from "katex/dist/contrib/auto-render";
import "katex/dist/katex.min.css";
import { useEffect, useRef } from "react";
import "../../styles/list-item.css";

const DOMComponent = ({ setHeight, html }) => {
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

  useEffect(() => {
    const height = containerRef.current.getBoundingClientRect().height;
    setHeight(height);
  }, [containerRef]);

  return <div className="content" dangerouslySetInnerHTML={{ __html: html }} ref={containerRef} />;
};

export default DOMComponent;
