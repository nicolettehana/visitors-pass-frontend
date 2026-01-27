import axios from "axios";

const BASE_URL = import.meta.env.VITE_EPROPOSAL_URL;

const client = axios.create({
  // withCredentials: true,
  baseURL: BASE_URL,
  headers: {
    "Referrer-Policy": "strict-origin-when-cross-origin",
  },
});

export const eProposalAPI = async ({ ...option }) => {
  const onSuccess = (response) => {
    return response;
  };
  const onError = async (error) => {
    throw error;
  };

  return await client(option).then(onSuccess).catch(onError);
};
