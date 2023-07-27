import http from "./httpServices";
const apiUrl = import.meta.env.ENV_API_URL

export const getAppMenu = (AppId) => {
  const apiEndPoint = `${apiUrl}/appMenu?AppId=${AppId}`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};

export const getAppMenuList = () => {
  const apiEndPoint = `${apiUrl}/appMenu`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};
