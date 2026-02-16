import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Users Profile
const fetchUsersProfile = () => {
  return request({
    url: "/users/profile",
    method: "get",
  });
};

export const useFetchUsersProfile = () => {
  return useQuery({
    queryKey: ["fetch-users-profile"],
    queryFn: fetchUsersProfile,
    retry: 0,
  });
};

// POST: Update Mobile Number
const updateMobileNo = (data) => {
  return request({
    url: `/users/send-otp-update-mobile`,
    method: "post",
    data,
  });
};

export const useUpdateMobileNo = (onSuccess, onError) => {
  return useMutation({
    mutationFn: updateMobileNo,
    onSuccess,
    onError,
  });
};

// POST: Verify Change Mobile OTP
const verifyChangeMobileOTP = (data) => {
  return request({
    url: `/users/verify-otp-update-mobile`,
    method: "post",
    data,
  });
};

export const useVerifyChangeMobileOTP = (onSuccess, onError) => {
  return useMutation({
    mutationFn: verifyChangeMobileOTP,
    onSuccess,
    onError,
  });
};

// POST: Create User
const createUser = (data) => {
  return request({
    url: "/users/register",
    method: "post",
    data,
  });
};

export const useCreateUser = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createUser,
    onSuccess,
    onError,
  });
};

// POST: Update User
const updateUser = (data) => {
  return request({
    url: "/users/update",
    method: "post",
    data,
  });
};

export const useUpdateUser = (onSuccess, onError) => {
  return useMutation({
    mutationFn: updateUser,
    onSuccess,
    onError,
  });
};