import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Purchases List
const fetchPurchases = (
  categoryCode,
  searchValue = "",
  pageNumber,
  pageSize,
  startDate,
  endDate,
  status
) => {
  return request({
    url: `/purchase${
      categoryCode ? `/${categoryCode}` : ""
    }?page=${pageNumber}&size=${pageSize}&search=${searchValue}&startDate=${startDate}&endDate=${endDate}&status=${status}`,
    method: "get",
  });
};

export const useFetchPurchases = (
  categoryCode,
  searchValue,
  pageNumber,
  pageSize,
  startDate,
  endDate,
  status
) => {
  return useQuery({
    queryKey: [
      "purchase",
      categoryCode,
      searchValue,
      pageNumber,
      pageSize,
      startDate,
      endDate,
      status,
    ],
    queryFn: () =>
      fetchPurchases(
        categoryCode,
        searchValue,
        pageNumber,
        pageSize,
        startDate,
        endDate,
        status
      ),
  });
};

// POST: Create Purchase
const createPurchase = (data) => {
  return request({
    url: "/purchase/create",
    method: "post",
    data,
  });
};

export const useCreatePurchase = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createPurchase,
    onSuccess,
    onError,
  });
};

// GET: Get amount by fin-year
const fetchAmount = (year) => {
  return request({
    url: `/purchase/year/${year}`,
    method: "get",
  });
};

export const useFetchAmount = (year) => {
  return useQuery({
    queryKey: ["fetch-amount", year],
    queryFn: () => fetchAmount(year),
    retry: 0,
  });
};

// GET: Export Purchases
const exportPurchases = (startDate, endDate, categoryCode) => {
  return request({
    url: `/purchase/export${
      categoryCode ? `/${categoryCode}` : ""
    }?startDate=${startDate}&endDate=${endDate}`,
    method: "get",
    responseType: "blob",
  });
};

export const useExportPurchase = () => {
  return useMutation({
    mutationFn: ({ startDate, endDate, categoryCode }) =>
      exportPurchases(startDate, endDate, categoryCode),
  });
};

// POST: Create Purchase Receipt
const createPurchaseReceipt = (data) => {
  return request({
    url: "/purchase/receipt",
    method: "post",
    data,
  });
};

export const useCreatePurchaseReceipt = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createPurchaseReceipt,
    onSuccess,
    onError,
  });
};
