import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  soundEnabled: true,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSoundEnabled: (state, action) => {
      state.soundEnabled = action.payload;
    },

    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
  },
});

export const { setSoundEnabled, toggleSound } = settingsSlice.actions;
export default settingsSlice.reducer;
