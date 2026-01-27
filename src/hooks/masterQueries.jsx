import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Year Range
const fetchYearRange = () => {
  return request({
    url: "/year-range",
    method: "get",
  });
};

export const useFetchYearRange = () => {
  return useQuery({
    queryKey: ["fetch-year-range"],
    queryFn: fetchYearRange,
    retry: 0,
  });
};

// GET: Units
const fetchUnits = () => {
  return request({
    url: "/unit",
    method: "get",
  });
};

export const useFetchUnits = () => {
  return useQuery({
    queryKey: ["fetch-units"],
    queryFn: fetchUnits,
    retry: 0,
  });
};

// GET: Category List
const fetchCategories = () => {
  return request({
    url: "/category",
    method: "get",
  });
};

export const useFetchCategories = () => {
  return useQuery({
    queryKey: ["fetch-categories"],
    queryFn: fetchCategories,
    retry: 0,
  });
};

// GET: Category Statistics
const fetchCategoryStats = (yearRangeId) => {
  return request({
    url: `/category/stats?yearRangeId=${yearRangeId}`,
    method: "get",
  });
};

export const useFetchCategoryStats = (yearRangeId) => {
  return useQuery({
    queryKey: ["fetch-category-stats", yearRangeId],
    queryFn: () => fetchCategoryStats(yearRangeId),
    retry: 0,
  });
};

// GET: Item Category Statistics
const fetchItemCategoryStats = () => {
  return request({
    url: "/items/stats",
    method: "get",
  });
};

export const useFetchItemCategoryStats = () => {
  return useQuery({
    queryKey: ["fetch-item-category-stats"],
    queryFn: fetchItemCategoryStats,
    retry: 0,
  });
};

// GET: Fetch Unit-Rate List based on purchaseDate means year Range
const fetchUnitsRates = (purchaseDate) => {
  return request({
    url: `/unit/rates?purchaseDate=${purchaseDate}`,
    method: "get",
  });
};

export const useFetchUnitsRates = (purchaseDate) => {
  return useQuery({
    queryKey: ["fetchUnitsRates", purchaseDate],
    queryFn: () => fetchUnitsRates(purchaseDate),
    enabled: !!purchaseDate,
  });
};

// GET: Fetch Unit-Balance
const fetchUnitsBalance = () => {
  return request({
    url: `/unit/balance`,
    method: "get",
  });
};

export const useFetchUnitsBalance = () => {
  return useQuery({
    queryKey: ["fetchUnitsBalance"],
    queryFn: () => fetchUnitsBalance(),
  });
};

// POST: Create Year Range
const createYearRange = (data) => {
  return request({
    url: "/year-range",
    method: "post",
    data,
  });
};

export const useCreateYearRange = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createYearRange,
    onSuccess,
    onError,
  });
};

// POST: Create Category
const createCategory = (data) => {
  return request({
    url: "/category",
    method: "post",
    data,
  });
};

export const useCreateCategory = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createCategory,
    onSuccess,
    onError,
  });
};

// POST: Create Unit
const createUnit = (data) => {
  return request({
    url: "/unit",
    method: "post",
    data,
  });
};

export const useCreateUnit = (onSuccess, onError) => {
  return useMutation({
    mutationFn: createUnit,
    onSuccess,
    onError,
  });
};

// GET: Item In Stock Category Statistics
const fetchItemInStockCategoryStats = () => {
  return request({
    url: "/stock/stats",
    method: "get",
  });
};

export const useFetchItemInStockCategoryStats = () => {
  return useQuery({
    queryKey: ["fetch-item-in-stock-category-stats"],
    queryFn: fetchItemInStockCategoryStats,
    retry: 0,
  });
};

// POST: Update Category
const updateCategory = (data) => {
  return request({
    url: "/category/update",
    method: "post",
    data,
  });
};

export const useUpdateCategory = (onSuccess, onError) => {
  return useMutation({
    mutationFn: updateCategory,
    onSuccess,
    onError,
  });
};
