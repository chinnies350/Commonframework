import http from "./httpServices";
const apiUrl = import.meta.env.ENV_API_URL;


export const getApplicationImageData = () => {
    const apiEndPoint = `${apiUrl}/appImage`;
    return http.get(`${apiEndPoint}`);
  };