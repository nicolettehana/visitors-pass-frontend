import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Fetch Items Paged by category
const fetchItemsByType = (category, search = "", pageNumber, pageSize) => {
  return request({
    url: `/items${
      category ? `/${category}` : ""
    }?page=${pageNumber}&size=${pageSize}&search=${search}`,
    method: "get",
  });
};

export const useFetchItemsByType = (category, search, pageNumber, pageSize) => {
  return useQuery({
    queryKey: ["items", category, search, pageNumber, pageSize],
    queryFn: () => fetchItemsByType(category, search, pageNumber, pageSize),
  });
};

// POST: Create Item
const createItem = (data) => {
  return request({
    url: "/items",
    method: "post",
    data,
  });
};

export const useCreateItem = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createItem,
    onSuccess,
    onError,
  });
};

// GET: Fetch Items List
const fetchItemsList = (category, search = "") => {
  return request({
    url: `/items/list${category ? `/${category}` : ""}?search=${search}`,
    method: "get",
  });
};

export const useFetchItemsList = (category, search) => {
  return useQuery({
    queryKey: ["items-list", category, search],
    queryFn: () => fetchItemsList(category, search),
  });
};

// GET: Export Items
const exportItems = (category) => {
  return request({
    url: `/items/export?category=${category}`,
    method: "get",
    responseType: "blob",
  });
};

export const useExportItems = () => {
  return useMutation({
    mutationFn: ({category }) =>
      exportItems(category),
  });
};