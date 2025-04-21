import axios from "axios";
import { BASE_URL } from "../../../utils/axiosConfig";

// CREATE EVENT
const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${BASE_URL}/event/create`, eventData);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

//  GET ALL EVENTS
const getAllEvent = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/event/get-all`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

//  GET EVENTS INFORMATION
const getEventInfo = async (eventId) => {
  try {
    const response = await axios.get(`${BASE_URL}/event/${eventId}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

// GET ACTIVITY BY DAY
const getActivityByDay = async (eventId, dayId) => {
  try {
    const response = await axios.post(`${BASE_URL}/event/activity-by-day`, {
      eventId,
      dayId,
    });
    return response.data;
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

// GET SINGLE ACTIVITY INFORMATION
const getSingleActivityInfo = async (activityId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/event/activity/${activityId}`
    );
    return response.data;
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

// DELETE ACTIVITY
const deleteActivityService = async (activityId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/event/activity/${activityId}`
    );
    return response.data;
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

//  UPDATE THE DAYS OF THE EVENT
const updateDays = async (dayData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/event/update-eventDay`,
      dayData
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

//  ADD ACTIVITY BY DAY and EVENT ID
const addActivityByDay = async (dayData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/event/add-activity`,
      dayData
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

const editActivitySingle = async (activityId, ActivityData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/event/edit-activity/${activityId}`,
      ActivityData
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

// GET EVENT DETAILS
const getEventDayDetails = async (dayId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/event/day/${dayId}`
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

export {
  createEvent,
  getAllEvent,
  getEventInfo,
  getActivityByDay,
  getSingleActivityInfo,
  deleteActivityService,
  updateDays,
  addActivityByDay,
  editActivitySingle,
  getEventDayDetails,
};
