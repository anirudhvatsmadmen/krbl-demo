import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// export const BASE_URL = "http://192.168.0.103:5000/api/v1";
// export const BASE_URL = "http://192.168.31.112:5000/api/v1";
export const BASE_URL = "https://krbl-backend.vercel.app/api/v1";


export const config = async (contentType = "application/json", navigation) => {
  try {
    const userData = await AsyncStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!user) {
      // Redirect to login page if user is not found
      router.push("/auth/sign-in");
      return {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
    }

    const token = user?.data?.token || "";

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: contentType,
    };

    if (contentType !== "multipart/form-data") {
      headers["Content-Type"] = contentType;
    }

    return { headers };
  } catch (error) {
    console.error("Error getting user from storage:", error);
    return {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  }
};
