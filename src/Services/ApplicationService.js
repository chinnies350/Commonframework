import http from "./httpServices";
const apiUrl = import.meta.env.ENV_API_URL;


export const getApplicationData = () => {
    const apiEndPoint = `${apiUrl}/application`;
    return http.get(`${apiEndPoint}`);
  };