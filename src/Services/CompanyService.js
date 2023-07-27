import http from "./httpServices";
const apiUrl = import.meta.env.ENV_API_URL;


export const getCompanyData = () => {
    const apiEndPoint = `${apiUrl}/company`;
    return http.get(`${apiEndPoint}`);
  };