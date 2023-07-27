

import http from "./httpServices";
const apiUrl = import.meta.env.ENV_API_URL

export const getAdmin = () => {
  const apiEndPoint = `${apiUrl}/adminTax`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};
