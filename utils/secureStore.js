import * as SecureStore from "expo-secure-store";

export const getSecureItem = async (key) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch {
    return null;
  }
};

export const setSecureItem = async (key, value) => {
  try {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    await SecureStore.setItemAsync(key, serialized);
    return true;
  } catch {
    return false;
  }
};

export const deleteSecureItem = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch {
    return false;
  }
};

export const SECURE_STORE_KEYS = {
  USER: "user",
  TOKEN: "token",
  QUESTION_QUERY: "questionQuery",
  SOUND_ENABLED: "soundEnabled",
};
