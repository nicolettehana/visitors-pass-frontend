import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";


// GET: Office List
const fetchOffices = () => {
  return request({
    url: "/offices",
    method: "get",
  });
};

export const useFetchOffices = () => {
  return useQuery({
    queryKey: ["fetch-offices"],
    queryFn: fetchOffices,
    retry: 0,
  });
};

// POST: Create Office
const createOffice = (data) => {
  return request({
    url: "/offices",
    method: "post",
    data,
  });
};

export const useCreateOffice = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createOffice,
    onSuccess,
    onError,
  });
};

// POST: Update Office
const updateOffice = (data) => {
  return request({
    url: "/offices",
    method: "post",
    data,
  });
};

export const useUpdateOffice = (onSuccess, onError) => {
  return useMutation({
    mutationFn: updateOffice,
    onSuccess,
    onError,
  });
};
