import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Visitors
const fetchVisitors = (
  searchValue = "",
  pageNumber,
  pageSize,
  startDate,
  endDate,
  officeCode
) => {
  return request({
    url: `/visitor?page=${pageNumber}&size=${pageSize}&search=${searchValue}&startDate=${startDate}&endDate=${endDate}&officeCode=${officeCode}`,
    method: "get",
  });
};

export const useFetchVisitors = (
  searchValue,
  pageNumber,
  pageSize,
  startDate,
  endDate,
  officeCode
) => {
  return useQuery({
    queryKey: [
      "visitors",
      searchValue,
      pageNumber,
      pageSize,
      startDate,
      endDate,
      officeCode
    ],
    queryFn: () =>
      fetchVisitors(searchValue, pageNumber, pageSize, startDate, endDate, officeCode),
  });
};

// GET: Fetch visitor photo
const fetchVisitorPhoto = async (visitorCode) => {
  if (!visitorCode) {
    return null;
  }

  const response = await request({
    url: `/visitor/${visitorCode}/photo`,
    method: "get",
    responseType: "blob",
  });

  return response;
};

export const useFetchVisitorPhoto = (visitorCode, enabled = true) => {
  return useQuery({
    queryKey: ["visitorPhoto", visitorCode],
    queryFn: () => fetchVisitorPhoto(visitorCode),
    enabled: !!visitorCode && enabled,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};

// GET: Fetch visitor pass
const fetchVisitorPass = async (visitorCode) => {
  if (!visitorCode) {
    return null;
  }

  const response = await request({
    url: `/visitor/${visitorCode}/pass`,
    method: "get",
    responseType: "blob",
  });

  return response;
};

export const useFetchVisitorPass = (visitorCode, enabled = true) => {
  return useQuery({
    queryKey: ["visitorPass", visitorCode],
    queryFn: () => fetchVisitorPass(visitorCode),
    enabled: !!visitorCode && enabled,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};

// GET: Export Visitors
const exportVisitors = ({ format, startDate, endDate, withPhoto, officeCode }) => {
  return request({
    url: `/visitor/export`,
    method: "get",
    params: { format, startDate, endDate, withPhoto, officeCode },
    responseType: "blob",
  });
};

export const useExportVisitors = () => {
  return useMutation({
    mutationFn: exportVisitors,
  });
};

// GET: Fetch visitor information
const fetchVisitorInformation = async (mobileNo) => {
  if (!mobileNo) {
    return null;
  }

  const response = await request({
    url: `/visitor/get-info?mobileNo=${mobileNo}`,
    method: "get",
  });

  return response;
};

export const useFetchVisitorInformation = (mobileNo, enabled = true) => {
  return useQuery({
    queryKey: ["visitorInformation", mobileNo],
    queryFn: () => fetchVisitorInformation(mobileNo),
    enabled: !!mobileNo && enabled && mobileNo.length === 10,
  });
};

// GET: Get Stats
const fetchStats = (
  month,
  year,
  purpose,
  officeCode
) => {
  return request({
    url: `/visitor/stats?month=${month}&year=${year}&purpose=${purpose}&officeCode=${officeCode}`,
    method: "get",
  });
};

export const useFetchStats = (
  month,
  year,
  purpose,
  officeCode
) => {
  return useQuery({
    queryKey: [
      "visitors",
      month,
  year,
  purpose,
  officeCode
    ],
    queryFn: () =>
      fetchStats(month, year, purpose, officeCode),
  });
};

// GET: Get Purpose Stats
const fetchPurposeStats = (
  month,
  year,
  officeCode
) => {
  return request({
    url: `/visitor/purpose-stats?month=${month}&year=${year}&officeCode=${officeCode}`,
    method: "get",
  });
};

export const useFetchPurposeStats = (
  month,
  year,
  officeCode
) => {
  return useQuery({
    queryKey: [
      "visitors",
      month,
  year,
  officeCode
    ],
    queryFn: () =>
      fetchPurposeStats(month, year, officeCode),
  });
};