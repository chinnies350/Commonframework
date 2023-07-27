import http from "./httpServices";
const apiUrl = import.meta.env.ENV_API_URL

export const getConfigurationType = () => {
  const apiEndPoint = `${apiUrl}/configType`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};

export const postConfigurationType = (payload) => {
  console.log('payload', payload)
  const apiEndPoint = `${apiUrl}/configType`;
  return http.post(apiEndPoint, payload);
};

export const putConfigurationType = (payload) => {
  console.log('11111111',payload)
  const apiEndPoint = `${apiUrl}/configType`;
  return http.put(apiEndPoint, payload);
};

export const getConfiguration = () => {
  const apiEndPoint = `${apiUrl}/configMaster`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};

export const getConfigName = () => {
  const apiEndPoint = `${apiUrl}/configMaster?ActiveStatus=A`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};

export const getConfigTypeName = () => {
  const apiEndPoint = `${apiUrl}/configType?ActiveStatus=A`;
  console.log(apiEndPoint,"apiEndPoint")
  return http.get(`${apiEndPoint}`);
};








// export const createNewConfigurationType = (data) => {
//   const apiEndPoint = `${apiUrl}/configType`;
//   return axios.post(apiEndPoint, data);
// };
// export const updateCmpMasterData = (data) => {
//   const apiEndPoint = `${apiUrl}/updateCmpMaster`;
//   return http.put(`${apiEndPoint}`, data);
// };


// export const addCmpMasterData = (data) => {
//   const apiEndPoint = `${apiUrl}/addCmpMaster`;
//   return http.post(`${apiEndPoint}`, data);
// };


// export const deleteStoreMasterData = (data) => {
//   const apiEndPoint = `${apiUrl}/deleteCmpMaster`;
//   return http.delete(`${apiEndPoint}`, { params: data });
// };