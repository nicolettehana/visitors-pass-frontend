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
  const response = await request({
    url: `/visitor/${visitorCode}/photo`,
    method: "get",
    responseType: "blob", // IMPORTANT for images
  });

  return URL.createObjectURL(response.data);
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
