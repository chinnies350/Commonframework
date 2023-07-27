import http from "./httpServices";
const apiUrl = import.meta.env.ENV_API_URL

export const getCurrency = () => {
    const apiEndPoint = `${apiUrl}/currency`;
    console.log(apiEndPoint,"apiEndPoint")
    return http.get(`${apiEndPoint}`);
  };

  export const postCurrency = (payload) => {
    console.log('11111111',payload)
    const apiEndPoint = `${apiUrl}/currency`;
    return http.post(apiEndPoint, payload);
  };