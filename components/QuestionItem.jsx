import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Pressable } from "react-native";
import { WebView } from "react-native-webview";
import { UserContext } from "../context/UserContext";
import useQuestionWithLatexAndImage from "../hooks/useQuestionWithLatexAndImage";

const renderHtml = (htmlContent) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>

      * {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      }
      body {
           font-family: "Lato", sans-serif;
      }
      img {
          display: inline-block;
          vertical-align: middle;
          height: 32px;
          width: 32px;
          object-fit: contain;
          margin: 6px 0px;
      }
      p {
          font-size: 20px;
          line-height: 1.3;
          color: #333333;
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
      .content {
          background-color: #FBF8F6;
          padding: 12px;
          border-radius: 12px;
      }

      </style>
    </head>
    <body>
      <div class="content">${htmlContent}</div>
    </body>
    </html>
  `;
};

const QuestionItem = ({ question }) => {
  const { setQuestion } = useContext(UserContext);
  const router = useRouter();
  const htmlContent = useQuestionWithLatexAndImage(question.question, question.images, question.latex);
  const [webViewHeights, setWebViewHeights] = useState({});

  const handleWebViewMessage = (event, questionId) => {
    const height = parseInt(event.nativeEvent.data, 10);
    if (!isNaN(height)) {
      setWebViewHeights((prev) => ({
        ...prev,
        [questionId]: height,
      }));
    }
  };

  return (
    <Pressable
      onPress={() => {
        setQuestion(question);
        router.push(`/${question._id}`);
      }}
      style={{ height: webViewHeights[question._id] || 10 }}>
      <WebView
        source={{
          html: renderHtml(htmlContent.replace(/<br>/g, "<div class='line-break'></div>")),
        }}
        injectedJavaScript={`
          (function() {
            const calculateHeight = () => {
              const height = document.documentElement.scrollHeight;
              window.ReactNativeWebView.postMessage(height.toString());
            };
            calculateHeight();
            window.addEventListener('resize', calculateHeight);
          })();
        `}
        onMessage={(event) => handleWebViewMessage(event, question._id)}
        javaScriptEnabled={true}
        style={{ height: webViewHeights[question._id] || 10 }} // Adjust WebView height
        scrollEnabled={false}
      />
    </Pressable>
  );
};

export default QuestionItem;
