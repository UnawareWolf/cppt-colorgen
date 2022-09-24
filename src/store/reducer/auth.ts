import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GraphState {
  isAuthenticated: boolean;
  email: string;
  password: string;
}

const initialState: GraphState = {
  isAuthenticated: false,
  email: 'cppt@example.com',
  password: 'cppt',
};

export const authSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    authenticateAdmin: (state, data: PayloadAction<{ password: string }>) => {
      const { password } = data.payload;

      if (password === state.password) {
        state.isAuthenticated = true;
      }
    },
    resetAuth: (state) => {
      state.isAuthenticated = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { authenticateAdmin, resetAuth } = authSlice.actions;

export default authSlice.reducer;
