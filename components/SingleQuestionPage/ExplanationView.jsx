import React, { useRef, useState } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import useQuestionWithLatexAndImage from "../../hooks/useQuestionWithLatexAndImage";

const renderHtml = (htmlContent, mainImage) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
      <meta name="viewport" content="width=device-width user-scalable=no">
      <style>

      * {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      }
      body {
           font-family: "Lato", sans-serif;
           background-color: #FBF8F6;
           padding-inline: 1px;
      }
     img {
          display: inline-block;
          vertical-align: middle;
          width: 32px;
          height: 32px;
          object-fit: contain;
          margin: 6px 0px;
      }
      p {
          font-size: 20px;
          line-height: 1.3;
          color: #342618;
      }
      ul, ol {
          padding: 0 1rem;
          margin: 0.5rem;
      }
      strong {
          font-weight: bold;
      }
      ul li p, ol li p {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
      }
      ul {
          list-style-type: disc;
      }
      ol {
          list-style-type: upper-alpha;
      }
      ol ::marker {
          font-weight: bold;
          font-size: 20px;
      }
      table {
          border-collapse: collapse;
          margin: 0;
          overflow: hidden;
          table-layout: fixed;
          width: 100%;
      }
      th, td {
          padding: 8px 8px;
      }
      .separated-table {
          border-spacing: 0px 3px;
          border-collapse: separate;
      }
      table td, table th {
          border: 1px solid #222;
          box-sizing: border-box;
          min-width: 1em;
          padding: 4px 6px;
          position: relative;
          text-align: left;
      }
      table th {
          background-color: #ddd;
      }
      .table-cell-no-border {
          border: none;
      }
      .line-break {
          height: 10px;
      }
     

      .main-image-container{
         margin-top: 20px;
      }

      .main-image{
          width: 100%;
          height: auto;
          
      }

      </style>
    </head>
      <body>
        <div>${htmlContent}</div>
        <div class="main-image-container">
          ${
            mainImage &&
            `<img class="main-image" src="data:image/svg+xml;utf8,${encodeURIComponent(mainImage)}" alt="main-image" />`
          }
        </div>
      </body>
    </html>
  `;
};

const ExplanationView = ({ question }) => {
  const htmlContent = useQuestionWithLatexAndImage(question.explanation, question.images, question.latex);
  const [webViewHeights, setWebViewHeights] = useState();
  const webViewRef = useRef(null);
  const handleWebViewMessage = (event) => {
    const height = parseInt(event.nativeEvent.data, 10);
    if (!isNaN(height)) {
      setWebViewHeights(height);
    }
  };

  const webViewScript =
    "(function() {window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);})()";

  return (
    <View style={{ height: webViewHeights || 10, marginTop: 10 }}>
      <WebView
        source={{
          html: renderHtml(htmlContent.replace(/<br>/g, "<div class='line-break'></div>"), question.explanationImage),
        }}
        ref={webViewRef}
        injectedJavaScript={webViewScript}
        onMessage={(event) => handleWebViewMessage(event)}
        javaScriptEnabled={true}
        style={{ height: webViewHeights || 10 }}
        scrollEnabled={false}
        pointerEvents="none"
        onLoadEnd={() => webViewRef.current.injectJavaScript(webViewScript)}
      />
    </View>
  );
};

export default ExplanationView;
