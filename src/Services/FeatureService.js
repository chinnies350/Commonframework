import http from "./httpServices";
const apiUrl = import.meta.env.ENV_API_URL

export const getFeature = () => {
    const apiEndPoint = `${apiUrl}/feature`;
    console.log(apiEndPoint,"apiEndPoint")
    return http.get(`${apiEndPoint}`);
  };