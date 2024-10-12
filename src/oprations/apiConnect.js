import axios from 'axios';
import { baseUrl } from './api';

export const axiosmethod=axios.create();
export const apiConnect=async (method,url,body,headers,params)=>{
    return axiosmethod({
        method:`${method}`,
        baseURL:`${baseUrl+url}`,
        data:body?body:null,
        headers:headers?headers:null,
        params:params?params:null
    })
}

