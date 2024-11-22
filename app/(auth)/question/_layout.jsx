import { Stack } from "expo-router";
import React from "react";

const QuestionPageLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: "Question" }} />
    </Stack>
  );
};

export default QuestionPageLayout;
