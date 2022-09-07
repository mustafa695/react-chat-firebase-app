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
    updateUser: (state, action) => {
      let dup = [...state.auhtUSer.data];

      dup.map(
        i => (
          (i.avatar = action.payload.avatar),
          (i.name = action.payload.fullName),
          (i.nickname = action.payload.nickName),
          (i.phoneNumber = action.payload.phone),
          (i.status = action.payload.status),
          (i.country = action.payload.country),
          (i.city = action.payload.city),
          (i.bio = action.payload.bio)
        ),
      );
      let obj = {
        currentUser: action.payload.currentUser,
        data: dup,
      };

      state.auhtUSer = obj;
    },
  },
});

// Action creators are generated for each case reducer function
export const {userLogin, updateUser} = authSlice.actions;

export default authSlice.reducer;
