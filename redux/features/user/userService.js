import axios from "axios";
import { BASE_URL, config } from "../../../utils/axiosConfig";

// CREATE USER ACCOUNT
const createUserAccount = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, userData);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

const signInUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, userData);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

const editProfile = async (userData) => {
  try {
    const authConfig = await config();
    const response = await axios.put(
      `${BASE_URL}/auth/edit-profile`,
      userData,
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

const getProfile = async () => {
  try {
    const authConfig = await config();
    const response = await axios.get(
      `${BASE_URL}/auth/user-profile`,
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

const changePassword = async (userData) => {
  try {
    const authConfig = await config();
    const response = await axios.put(
      `${BASE_URL}/auth/change-password`,
      userData,
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

const getSavePost = async () => {
  try {
    const authConfig = await config();
    const response = await axios.get(`${BASE_URL}/auth/saved`, authConfig);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

const uploadUserDocument = async (docData) => {
  try {
    const authConfig = await config();
    const response = await axios.post(
      `${BASE_URL}/auth/document`,
      docData,
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

const getUserDocument = async (docData) => {
  try {
    const authConfig = await config();
    const response = await axios.get(`${BASE_URL}/auth/document`, authConfig);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

const deleteUserDocument = async (docId) => {
  try {
    const authConfig = await config();
    const response = await axios.delete(
      `${BASE_URL}/auth/document/${docId}`,
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

const downloadUserDocument = async (id) => {
  try {
    const authConfig = await config();
    const response = await axios.get(
      `${BASE_URL}/auth/document/${id}/download`,
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
  createUserAccount,
  signInUser,
  editProfile,
  getProfile,
  changePassword,
  getSavePost,
  uploadUserDocument,
  getUserDocument,
  deleteUserDocument,
  downloadUserDocument,
};
