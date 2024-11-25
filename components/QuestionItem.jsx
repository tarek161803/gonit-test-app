import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { UserContext } from "../context/UserContext";
import useQuestionWithLatexAndImage from "../hooks/useQuestionWithLatexAndImage";

const renderHtml = (htmlContent) => {
  return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <style>
                body {
                  margin: 0;
                 background-color: transparent;
                  font-family: Arial, sans-serif;
                  color: #333333;
                }
                  table {
                  border-collapse: collapse;
                  margin: 0;
                  overflow: hidden;
                  table-layout: fixed;
                  width: 100%;}


                td,
                th {
                  border: 1px solid #222222;
                  box-sizing: border-box;
                  min-width: 1em;
                  padding-top: 0px;
                  padding-bottom: 0px;
                  padding-left: 8px;
                  padding-right: 8px;
                  position: relative;
                }
     
                .content {
                background-color: #f3ebe5;
                  border-radius: 12px;
                  padding: 15px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    setWebViewHeights((prev) => ({
      ...prev,
      [questionId]: height,
    }));
  };

  return (
    <Pressable
      onPress={() => {
        setQuestion(question);
        router.navigate(`/question/${question._id}`);
      }}
      key={question._id}
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
            setTimeout(function() {
              window.ReactNativeWebView.postMessage(
                document.documentElement.scrollHeight
              );
            }, 0);
          })();
        `}
        onMessage={(event) => handleWebViewMessage(event, question._id)}
        javaScriptEnabled={true}
        style={styles.webview}
        scrollEnabled={false}
        scalesPageToFit={false}
      />
    </Pressable>
  );
};

export default QuestionItem;

const styles = StyleSheet.create({
  questionContainer: {
    borderRadius: 14,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
  },
});
