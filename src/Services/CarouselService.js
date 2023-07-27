import http from "./httpServices";
const apiUrl = import.meta.env.ENV_API_URL

export const getCarousel = () => {
    const apiEndPoint = `${apiUrl}/carousel`;
    console.log(apiEndPoint,"apiEndPoint")
    return http.get(`${apiEndPoint}`);
  };

  export const getConfigName = () => {
    const apiEndPoint = `${apiUrl}/configMaster?ActiveStatus=A`;
    console.log(apiEndPoint,"apiEndPoint")
    return http.get(`${apiEndPoint}`);
  };

  export const postCarousel = (payload) => {
    console.log('11111111',payload)
    const apiEndPoint = `${apiUrl}/carousel`;
    return http.post(apiEndPoint, payload);
  };