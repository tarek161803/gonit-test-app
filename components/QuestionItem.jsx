import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { UserContext } from "../context/UserContext";
import useQuestionWithLatexAndImage from "../hooks/useQuestionWithLatexAndImage";

const renderHtml = (htmlContent) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>

        * {
          box-sizing: border-box;
          padding: 0;
          margin: 0;
        }

        body {
          margin: 0;
          padding: 0;
          background-color: transparent;
          font-family: Arial, sans-serif;
        }

        p {
          line-height: 1.5;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
        }

         th, td {
          padding: 8px 8px;
        }

        .content {
          display: block;
          padding: 24px;
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
      style={[
        styles.questionContainer,
        { height: webViewHeights[question._id] || 100 }, // Fallback height
      ]}>
      <WebView
        source={{
          html: renderHtml(htmlContent),
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
        style={[styles.webview, { height: webViewHeights[question._id] || 100 }]} // Adjust WebView height
        scrollEnabled={false}
      />
    </Pressable>
  );
};

export default QuestionItem;

const styles = StyleSheet.create({
  questionContainer: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#f3ebe5",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
