import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Firms By Type
const fetchFirmsByType = (
  category,
  search = "",
  pageNumber,
  pageSize,
  yearRangeId = null
) => {
  return request({
    url: `/firms${
      category ? `/${category}` : ""
    }?page=${pageNumber}&size=${pageSize}&search=${search}&yearRangeId=${yearRangeId}`,
    method: "get",
  });
};

export const useFetchFirmsByType = (
  category,
  search,
  pageNumber,
  pageSize,
  yearRangeId
) => {
  return useQuery({
    queryKey: ["firms", category, search, pageNumber, pageSize, yearRangeId],
    queryFn: () =>
      fetchFirmsByType(category, search, pageNumber, pageSize, yearRangeId),
  });
};

// POST: Create Firm
const createFirm = (data) => {
  return request({
    url: "/firms",
    method: "post",
    data,
  });
};

export const useCreateFirm = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createFirm,
    onSuccess,
    onError,
  });
};

// GET: Firms List
const fetchFirmsList = (date) => {
  return request({
    url: `/firms/list?date=${date}`,
    method: "get",
  });
};

export const useFetchFirmsList = (date) => {
  return useQuery({
    queryKey: ["fetch-firms-list", date],
    queryFn: () => fetchFirmsList(date),
    retry: 0,
  });
};

// GET: Firms List
const fetchFirmsListt = () => {
  return request({
    url: `/firms/listt`,
    method: "get",
  });
};

export const useFetchFirmsListt = () => {
  return useQuery({
    queryKey: ["fetch-firms-listt"],
    queryFn: () => fetchFirmsListt(),
    retry: 0,
  });
};

// POST: Create Approved Firm
const createFirmYear = (data) => {
  return request({
    url: "/firms/add-approved",
    method: "post",
    data,
  });
};

export const useCreateFirmYear = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createFirmYear,
    onSuccess,
    onError,
  });
};

// GET: Fetch All Firms By Type And Year Range
const fetchAllFirmsByType = (
  category,
  search = "",
  pageNumber,
  pageSize,
  yearRangeId = null
) => {
  return request({
    url: `/firms/all${
      category ? `/${category}` : ""
    }?page=${pageNumber}&size=${pageSize}&search=${search}&yearRangeId=${yearRangeId}`,
    method: "get",
  });
};

export const useFetchAllFirmsByType = (
  category,
  search,
  pageNumber,
  pageSize,
  yearRangeId
) => {
  return useQuery({
    queryKey: ["firms", category, search, pageNumber, pageSize, yearRangeId],
    queryFn: () =>
      fetchAllFirmsByType(category, search, pageNumber, pageSize, yearRangeId),
  });
};


// POST: Remove/Add Approved Firm by category and yearRange
const updateFirmYear = (data) => {
  return request({
    url: "/firms/approve",
    method: "post",
    data,
  });
};

export const useUpdateFirmYear = (onSuccess, onError) => {
  return useMutation({
    mutationFn: updateFirmYear,
    onSuccess,
    onError,
  });
};

// POST: Update Firm
const updateFirm = (data) => {
  return request({
    url: "/firms/update",
    method: "post",
    data,
  });
};

export const useUpdateFirm = (onSuccess, onError) => {
  return useMutation({
    mutationFn: updateFirm,
    onSuccess,
    onError,
  });
};

// GET: Export Firms
const exportFirms = (yearRangeId, category) => {
  return request({
    url: `/firms/export?yearRangeId=${yearRangeId}&category=${category}`,
    method: "get",
    responseType: "blob",
  });
};

export const useExportFirms = () => {
  return useMutation({
    mutationFn: ({ yearRangeId, category }) =>
      exportFirms(yearRangeId, category),
  });
};