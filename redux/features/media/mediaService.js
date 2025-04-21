import axios from "axios";
import { BASE_URL, config, configMultipart } from "../../../utils/axiosConfig";

//  GET ALL EVENTS
const getAllMedia = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/media/event-media`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

const eventMediaLike = async (mediaId) => {
  try {
    const authConfig = await config();
    const response = await axios.post(
      `${BASE_URL}/like/${mediaId}`,
      {},
      authConfig
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

const eventCreatePost = async (postData) => {
  try {
    const authConfig = await config();
    const response = await axios.post(
      `${BASE_URL}/media/upload`,
      postData,
      authConfig
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

const addComment = async (mediaId, text) => {
  try {
    const authConfig = await config();
    const response = await axios.post(
      `${BASE_URL}/comment/add/${mediaId}`,
      { text }, // send as object
      authConfig
    );
    return response.data;
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

const getComment = async (mediaId) => {
  try {
    const authConfig = await config();
    const response = await axios.get(
      `${BASE_URL}/comment/media/${mediaId}`,
      authConfig
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

const saveMedia = async (mediaId) => {
  try {
    const authConfig = await config();
    const response = await axios.post(
      `${BASE_URL}/media/save/${mediaId}`,
      {},
      authConfig
    );
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

const getMedia = async (mediaId) => {
  try {
    const authConfig = await config();
    const response = await axios.get(
      `${BASE_URL}/media/single-media/${mediaId}`,
      authConfig
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
  getAllMedia,
  eventMediaLike,
  eventCreatePost,
  addComment,
  getComment,
  getMedia,
  saveMedia,
};
