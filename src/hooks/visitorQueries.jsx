import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Visitors
const fetchVisitors = (
  searchValue = "",
  pageNumber,
  pageSize,
  startDate,
  endDate,
) => {
  return request({
    url: `/visitor?page=${pageNumber}&size=${pageSize}&search=${searchValue}&startDate=${startDate}&endDate=${endDate}`,
    method: "get",
  });
};

export const useFetchVisitors = (
  searchValue,
  pageNumber,
  pageSize,
  startDate,
  endDate,
) => {
  return useQuery({
    queryKey: [
      "visitors",
      searchValue,
      pageNumber,
      pageSize,
      startDate,
      endDate,
    ],
    queryFn: () =>
      fetchVisitors(searchValue, pageNumber, pageSize, startDate, endDate),
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
const fetchVisitorPass= async (visitorCode) => {
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
// const exportVisitors = (
//   format,
//   startDate,
//   endDate,
// ) => {
//   return request({
//     url: `/visitor/export?format=${format}&startDate=${startDate}&endDate=${endDate}`,
//     method: "get",
//   });
// };

// export const useExportVisitors = (
//   format,
//   startDate,
//   endDate,
// ) => {
//   return useMutation({
//     queryKey: [
//       "export-visitors",
//       format,
//       startDate,
//       endDate,
//     ],
//     queryFn: () =>
//       exportVisitors(format, startDate, endDate),
//     //enabled: !!startDate && !!endDate,
//   });
// };

// GET: Export Visitors
const exportVisitors = ({ format, startDate, endDate }) => {
  return request({
    url: `/visitor/export`,
    method: "get",
    params: { format, startDate, endDate },
    responseType: "blob",
  });
};

export const useExportVisitors = () => {
  return useMutation({
    mutationFn: exportVisitors,
  });
};
