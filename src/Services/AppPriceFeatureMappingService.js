import http from "./httpServices";
// const apiUrl = require("../config.json").apiUrl;
//const apiUrl ="http://192.168.1.25:3000"
const apiUrl = import.meta.env.ENV_API_URL

export const getApplication = () => {
  const apiEndPoint = `${apiUrl}/application`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};

export const getpricingAppFeatMap = () => {
  const apiEndPoint = `${apiUrl}/pricingAppFeatMap`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};

export const getPricingType= (AppId) => {
  const apiEndPoint = `${apiUrl}/pricingType?AppId=${AppId}`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};

export const getFeatureList= () => {
  const apiEndPoint = `${apiUrl}/feature`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};









// http://192.168.1.20:8000/application