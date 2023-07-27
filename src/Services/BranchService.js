import http from "./httpServices";
const apiUrl = import.meta.env.ENV_API_URL;


export const getBranchData = () => {
    const apiEndPoint = `${apiUrl}/branch`;
    return http.get(`${apiEndPoint}`);
  };