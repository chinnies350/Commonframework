import http from "./httpServices";
const apiUrl = import.meta.env.ENV_API_URL

export const getPricingType= () => {
  const apiEndPoint = `${apiUrl}/pricingType`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};

export const getPricingTag= () => {
  const apiEndPoint = `${apiUrl}/configMaster?TypeName=pricingType`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};

export const getTaxdata= () => {
  const apiEndPoint = `${apiUrl}/adminTax?ActiveStatus=A`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};

export const getCurrData= () => {
  const apiEndPoint = `${apiUrl}/currency?ActiveStatus=A`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};









