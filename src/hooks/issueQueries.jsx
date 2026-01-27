import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Issue List
const fetchIssues = (
  categoryCode,
  searchValue = "",
  pageNumber,
  pageSize,
  startDate,
  endDate
) => {
  return request({
    url: `/issue${
      categoryCode ? `/${categoryCode}` : ""
    }?page=${pageNumber}&size=${pageSize}&search=${searchValue}&startDate=${startDate}&endDate=${endDate}`,
    method: "get",
  });
};

export const useFetchIssues = (
  categoryCode,
  searchValue,
  pageNumber,
  pageSize,
  startDate,
  endDate
) => {
  return useQuery({
    queryKey: [
      "issue",
      categoryCode,
      searchValue,
      pageNumber,
      pageSize,
      startDate,
      endDate,
    ],
    queryFn: () =>
      fetchIssues(
        categoryCode,
        searchValue,
        pageNumber,
        pageSize,
        startDate,
        endDate
      ),
  });
};

// POST: Create Issue
const createIssue = (data) => {
  return request({
    url: "/issue/create",
    method: "post",
    data,
  });
};

export const useCreateIssue = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createIssue,
    onSuccess,
    onError,
  });
};

// GET: Export Issues
const exportIssues = (startDate,
  endDate,
  categoryCode) => {
  return request({
    url: `/issue/export${
      categoryCode ? `/${categoryCode}` : ""
    }?startDate=${startDate}&endDate=${endDate}`,
    method: "get",
    responseType: "blob",
  });
};

export const useExportIssue = () => {
  return useMutation({
    mutationFn: ({startDate, endDate, categoryCode }) =>
      exportIssues(startDate, endDate, categoryCode),
  });
};