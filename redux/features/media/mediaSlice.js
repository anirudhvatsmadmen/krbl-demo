import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addComment,
  eventCreatePost,
  eventMediaLike,
  getAllMedia,
  getComment,
  getMedia,
  saveMedia,
} from "./mediaService";

// const fromLocalStorage = localStorage?.getItem("user")
//   ? JSON.parse(localStorage.getItem("user"))
//   : null;

// Define the initial state
const initialState = {
  media: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// GET ALL MEDIA
export const getAllMediaInfo = createAsyncThunk(
  "media/get-all",
  async (_, thunkAPI) => {
    try {
      return await getAllMedia();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const mediaLike = createAsyncThunk(
  "media/like",
  async (mediaId, thunkAPI) => {
    try {
      return await eventMediaLike(mediaId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  "media/create-post",
  async (postData, thunkAPI) => {
    try {
      return await eventCreatePost(postData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const UserAddComment = createAsyncThunk(
  "comment/add",
  async ({ mediaId, text }, thunkAPI) => {
    try {
      return await addComment(mediaId, text);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const userGetComment = createAsyncThunk(
  "comment/get",
  async (mediaId, thunkAPI) => {
    try {
      return await getComment(mediaId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getSingleMedia = createAsyncThunk(
  "comment/get/single-media",
  async (mediaId, thunkAPI) => {
    try {
      return await getMedia(mediaId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const userSaveMedia = createAsyncThunk(
  "comment/media/save-media",
  async (mediaId, thunkAPI) => {
    try {
      return await saveMedia(mediaId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// CREATE MEDIA SLICE
export const mediaSlice = createSlice({
  name: "media",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMediaInfo.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllMediaInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.media = action.payload;
        state.isSuccess = true;
        // state.eventMedia = action.payload;
      })
      .addCase(getAllMediaInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(mediaLike.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(mediaLike.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mediaLike = action.payload;
        state.isSuccess = true;
        // state.eventMedia = action.payload;
      })
      .addCase(mediaLike.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.post = action.payload;
        state.isSuccess = true;
        // state.eventMedia = action.payload;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(UserAddComment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(UserAddComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comment = action.payload;
        state.isSuccess = true;
        // state.eventMedia = action.payload;
      })
      .addCase(UserAddComment.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(userGetComment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(userGetComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getCommentInfo = action.payload;
        state.isSuccess = true;
        // state.eventMedia = action.payload;
      })
      .addCase(userGetComment.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getSingleMedia.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getSingleMedia.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getSingleMedia = action.payload;
        state.isSuccess = true;
        // state.eventMedia = action.payload;
      })
      .addCase(getSingleMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(userSaveMedia.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(userSaveMedia.fulfilled, (state, action) => {
        state.isLoading = false;
        state.saveMedia = action.payload;
        state.isSuccess = true;
        // state.eventMedia = action.payload;
      })
      .addCase(userSaveMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      });
  },
});

export default mediaSlice.reducer;
