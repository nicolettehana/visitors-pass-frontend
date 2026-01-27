import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../components/utils/request";

// GET: Get items by level
const fetchItemsLevelList = (level) => {
  return request({
    url: `/stock/${level}`, // <-- use path variable
    method: "get",
  });
};

export const useFetchItemsLevelList = (level) => {
  return useQuery({
    queryKey: ["fetch-items-level-list", level],
    queryFn: () => fetchItemsLevelList(level),
    retry: 0,
  });
};
