import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Rates By Category/Year Range
const fetchRates = (category, search = "", pageNumber, pageSize, yearRange) => {
  return request({
    url: `/rates${
      category ? `/${category}` : ""
    }?page=${pageNumber}&size=${pageSize}&search=${search}&yearRange=${yearRange}`,
    method: "get",
  });
};

export const useFetchRates = (
  category,
  search,
  pageNumber,
  pageSize,
  yearRange
) => {
  return useQuery({
    queryKey: ["rates", category, search, pageNumber, pageSize, yearRange],
    queryFn: () =>
      fetchRates(category, search, pageNumber, pageSize, yearRange),
  });
};

// POST: Create Rate
const createRate = (data) => {
  return request({
    url: "/rates",
    method: "post",
    data,
  });
};

export const useCreateRate = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createRate,
    onSuccess,
    onError,
  });
};


// POST: Add Rate
const addRate = (data) => {
  return request({
    url: "/rates/add",
    method: "post",
    data,
  });
};

export const useAddRate = (onSuccess, onError) => {
  return useMutation({
    mutationFn: addRate,
    onSuccess,
    onError,
  });
};

// GET: Export Rates
const exportRates = (category, yearRange) => {
  return request({
    url: `/rates/export${
      category ? `/${category}` : ""
    }?yearRange=${yearRange}`,
    method: "get",
    responseType: "blob",
  });
};

export const useExportRates = () => {
  return useMutation({
    mutationFn: ({category, yearRange }) =>
      exportRates(category, yearRange),
  });
};