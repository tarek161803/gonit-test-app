module.exports = {
  extends: "expo",
  ignorePatterns: ["/dist/*"],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    "react-hooks/exhaustive-deps": "off",
  },
};
