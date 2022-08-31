import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  auhtUSer: {},
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // increment: state => {
    //   state.value += 1;
    // },
    // decrement: state => {
    //   state.value -= 1;
    // },
    userLogin: (state, action) => {
      state.auhtUSer = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {userLogin} = authSlice.actions;

export default authSlice.reducer;
