import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  changePassword,
  createUserAccount,
  deleteUserDocument,
  downloadUserDocument,
  editProfile,
  getProfile,
  getSavePost,
  getUserDocument,
  signInUser,
  uploadUserDocument,
} from "./userService";

const initialState = {
  user: null,
  isAuthenticated: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Async action to load user from AsyncStorage on app start
export const loadUserFromStorage = createAsyncThunk(
  "user/loadFromStorage",
  async (_, thunkAPI) => {
    try {
      const user = await AsyncStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to load user.");
    }
  }
);

// Register
export const createUser = createAsyncThunk(
  "user/create",
  async (userdata, thunkAPI) => {
    try {
      const response = await createUserAccount(userdata);
      await AsyncStorage.setItem("user", JSON.stringify(response));
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Login
export const signin = createAsyncThunk(
  "user/signin",
  async (userdata, thunkAPI) => {
    try {
      const response = await signInUser(userdata);
      await AsyncStorage.setItem("user", JSON.stringify(response));
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const userEditProfile = createAsyncThunk(
  "auth/edit-profile",
  async (userData, thunkAPI) => {
    try {
      return await editProfile(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/get-profile",
  async (_, thunkAPI) => {
    try {
      return await getProfile();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "auth/change-password",
  async (userData, thunkAPI) => {
    try {
      return await changePassword(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getUserSavePost = createAsyncThunk(
  "auth/get/save-post",
  async (_, thunkAPI) => {
    try {
      return await getSavePost();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const uploadDocument = createAsyncThunk(
  "auth/upload/document",
  async (docData, thunkAPI) => {
    try {
      return await uploadUserDocument(docData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getDocument = createAsyncThunk(
  "auth/get/document",
  async (docData, thunkAPI) => {
    try {
      return await getUserDocument();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteDocument = createAsyncThunk(
  "auth/delete/document",
  async (docId, thunkAPI) => {
    try {
      return await deleteUserDocument(docId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const downloadDocument = createAsyncThunk(
  "auth/download/document",
  async (docId, thunkAPI) => {
    try {
      return await downloadUserDocument(docId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      AsyncStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isSuccess = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
      })
      .addCase(signin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isSuccess = true;
      })
      .addCase(signin.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
      })
      .addCase(userEditProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userEditProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editUserData = action.payload;
        // state.editUserData = true;
        state.isSuccess = true;
      })
      .addCase(userEditProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
        // state.userData = true;
        state.isSuccess = true;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userChangePassword = action.payload;
        // state.userData = true;
        state.isSuccess = true;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
      })
      .addCase(getUserSavePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserSavePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPost = action.payload;
        // state.userData = true;
        state.isSuccess = true;
      })
      .addCase(getUserSavePost.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
      })
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDoc = action.payload;
        // state.userData = true;
        state.isSuccess = true;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
      })
      .addCase(getDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getUserDoc = action.payload;
        // state.userData = true;
        state.isSuccess = true;
      })
      .addCase(getDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
      })
      .addCase(deleteDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteUserDoc = action.payload;
        // state.userData = true;
        state.isSuccess = true;
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
