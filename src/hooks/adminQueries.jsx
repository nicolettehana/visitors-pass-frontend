import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";
import Cookies from "js-cookie";

// const XSRF_TOKEN = Cookies.get("XSRF-TOKEN");

// GET: Audit Trail
const fetchAuditTrail = (pageNumber, pageSize, fromDate, toDate) => {
  return request({
    url: `/audit-trail?page=${pageNumber}&size=${pageSize}&fromDate=${fromDate}&toDate=${toDate}`,
    method: "get",
  });
};

export const useFetchAuditTrail = (pageNumber, pageSize, fromDate, toDate) => {
  return useQuery({
    queryKey: ["fetch-audit-trail", pageNumber, pageSize, fromDate, toDate],
    queryFn: () => fetchAuditTrail(pageNumber, pageSize, fromDate, toDate),
  });
};

// GET: All Users
const fetchAllUsers = (pageNumber, pageSize) => {
  return request({
    url: `/users/all?page=${pageNumber}&size=${pageSize}`,
    method: "get",
  });
};

export const useFetchAllUsers = (pageNumber, pageSize) => {
  return useQuery({
    queryKey: ["fetch-all-users", pageNumber, pageSize],
    queryFn: () => fetchAllUsers(pageNumber, pageSize),
  });
};

// POST: Enable-Disable User
const enableDisableUsers = (data) => {
  return request({
    url: `/users/enable-disable`,
    method: "post",
    // headers: {
    //   "X-XSRF-TOKEN": XSRF_TOKEN,
    // },
    data,
  });
};

export const useEnableDisableUsers = (onSuccess, onError) => {
  return useMutation({
    mutationFn: enableDisableUsers,
    onSuccess,
    onError,
  });
};
