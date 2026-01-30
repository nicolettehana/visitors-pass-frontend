import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// POST: Register
const createRegistration = (data) => {
  return request({
    url: "/visitor",
    method: "post",
    data,
  });
};

export const useCreateRegistration = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createRegistration,
    onSuccess,
    onError,
  });
};
