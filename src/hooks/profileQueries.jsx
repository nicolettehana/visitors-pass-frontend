import { useMutation } from "@tanstack/react-query";
import { request } from "../components/utils/request";
import Cookies from "js-cookie";

// const XSRF_TOKEN = Cookies.get("XSRF-TOKEN");

// POST: Update Profile
const updateProfile = (data) => {
  return request({
    url: "/users/update",
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useUpdateProfile = (onSuccess, onError) => {
  return useMutation({
    mutationFn: updateProfile,
    onSuccess,
    onError,
  });
};

// POST: Change Password
const changePassword = (data) => {
  return request({
    url: "/users/change-password",
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useChangePassword = (onSuccess, onError) => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess,
    onError,
  });
};
