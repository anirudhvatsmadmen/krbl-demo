import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addActivityByDay,
  createEvent,
  deleteActivityService,
  editActivitySingle,
  getActivityByDay,
  getAllEvent,
  getEventDayDetails,
  getEventInfo,
  getSingleActivityInfo,
  updateDays,
} from "./eventService";

// const fromLocalStorage = localStorage?.getItem("user")
//   ? JSON.parse(localStorage.getItem("user"))
//   : null;

// Define the initial state
const initialState = {
  eventData: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

//  CREATE EVENT
export const createEvents = createAsyncThunk(
  "event/create",
  async (eventData, thunkAPI) => {
    try {
      return await createEvent(eventData);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response.data.data,
        statusCode: error.statusCode,
        errors: error.errors || [],
      });
    }
  }
);

// GET ALL EVENTS
export const getAllEvents = createAsyncThunk(
  "event/get-all",
  async (eventData, thunkAPI) => {
    try {
      return await getAllEvent(eventData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// GET EVENT INFORMATION
export const getEvent = createAsyncThunk(
  "event/get-event",
  async (eventId, thunkAPI) => {
    try {
      return await getEventInfo(eventId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//  GET ACTIVITY BT DAY
export const getActivity = createAsyncThunk(
  "event/get-activity",
  async ({ eventId, dayId }, thunkAPI) => {
    try {
      return await getActivityByDay(eventId, dayId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//  GET SINGLE ACTIVITY INFORMATION
export const getSingleActivity = createAsyncThunk(
  "event/get-single-activity",
  async (activityId, thunkAPI) => {
    try {
      return await getSingleActivityInfo(activityId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteActivity = createAsyncThunk(
  "event/delete-activity",
  async (activityId, thunkAPI) => {
    try {
      return await deleteActivityService(activityId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateEventDays = createAsyncThunk(
  "event/update-event-days",
  async (dayData, thunkAPI) => {
    try {
      return await updateDays(dayData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addActivity = createAsyncThunk(
  "event/activity/add-activity",
  async (activityData, thunkAPI) => {
    try {
      return await addActivityByDay(activityData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editActivity = createAsyncThunk(
  "event/edit-activity",
  async ({ activityId, activityData }, thunkAPI) => {
    try {
      return await editActivitySingle(activityId, activityData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getDayDetails = createAsyncThunk(
  "event/get-day-details",
  async (dayId, hunkAPI) => {
    try {
      return await getEventDayDetails(dayId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// CREATE EVENT SLICE
export const eventSlice = createSlice({
  name: "event",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEvents.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
        state.eventData = action.payload;
      })
      .addCase(createEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getAllEvents.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
        state.eventData = action.payload;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getEvent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
        state.eventInfo = action.payload;
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getActivity.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
        state.activityInfo = action.payload;
      })
      .addCase(getActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getSingleActivity.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getSingleActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
        state.singleActivityInfo = action.payload;
      })
      .addCase(getSingleActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(deleteActivity.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
        state.singleActivityInfo = action.payload;
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(updateEventDays.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateEventDays.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
        state.dayData = action.payload;
      })
      .addCase(updateEventDays.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(addActivity.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(addActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
        state.activityData = action.payload;
      })
      .addCase(addActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(editActivity.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(editActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
        state.editActivityData = action.payload;
      })
      .addCase(editActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getDayDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getDayDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
        state.dayDetails = action.payload;
      })
      .addCase(getDayDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
        state.isSuccess = false;
      });
  },
});

export default eventSlice.reducer;
