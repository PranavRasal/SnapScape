import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    // Define your initial state here
    status :false,
    userData : null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Define your reducers here
        login(state , action) {
            state.status = true;
            state.userData = action.payload.userData;
        },
        logout (state , action){
            state.status = false;
            state.userData = null;
         }
    },
});

export const {login , logout } =authSlice.actions;
export default authSlice.reducer;