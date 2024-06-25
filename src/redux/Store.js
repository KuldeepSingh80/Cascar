import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import userSlice from "redux/slices/UserSlice";

import ParkingReducer from "redux/slices/ParkingSlice";
import modalReducer from "redux/slices/modalSlice"
import { searchSlice } from "redux/slices/searchSlice";
// import issuperuserReducer from "redux/slices/issuperuserSlice"
import alertReducer from "redux/slices/alertSlice";
const store = configureStore({
  reducer: {

    user: userSlice,

    parking: ParkingReducer,
    modal: modalReducer,
    alert: alertReducer,
    search : searchSlice.reducer,
    // issuperuser: issuperuserReducer,
  },
  middleware: [thunk],
});

export default store;
