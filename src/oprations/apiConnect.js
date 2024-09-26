import axios from 'axios';

export const axiosmethod=axios.create();
export const apiConnect=async (method,url,body,headers,params)=>{
    return axiosmethod({
        method:`${method}`,
        baseURL:`https://ecomm-backend-1.onrender.com/api/${url}`,
        data:body?body:null,
        headers:headers?headers:null,
        params:params?params:null
    })
}

//