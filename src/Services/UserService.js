import http from "./httpServices";
const apiUrl = import.meta.env.ENV_API_URL

export const getUser = () => {
    const apiEndPoint = `${apiUrl}/user`;
    console.log(apiEndPoint,"apiEndPoint")
    return http.get(`${apiEndPoint}`);
  };

export const getCompanyName =() =>{
    const apiEndPoint = `${apiUrl}/company?ActiveStatus=A`;
    console.log(apiEndPoint,"apiEndPoint")
    return http.get(`${apiEndPoint}`);
};

export const getBranchName =() =>{
    const apiEndPoint = `${apiUrl}/branch?ActiveStatus=A`;
    console.log(apiEndPoint,"apiEndPoint")
    return http.get(`${apiEndPoint}`);
}

export const postUser= (payload) => {
    console.log('11111111',payload)
    const apiEndPoint = `${apiUrl}/user`;
    console.log('5555555555',apiEndPoint)
    return http.post(apiEndPoint, payload);
  }