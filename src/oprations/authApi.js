import { json } from "react-router-dom";
import { setOtpToken,setToken } from "../slices/authSlice";
import toast from "react-hot-toast";
import { apiConnect } from "./apiConnect";
import { getUserDetails } from "./userApi";





const signup = (udata, navigate, dispatch) => {


    return async () => {
        const toastId = toast.loading('Loading...');
        try {

            /* let result = await fetch('http://localhost:5000/api/auth/register', {
                method: 'post',
                body: JSON.stringify(udata),
                headers: {
                    'content-type': 'application/json'
                }
            })

            result = await result.json();
 */

            let result=await apiConnect(
                'POST',
                'auth/register',
                udata,
                { 'Content-Type': 'application/json' }
            );

            result = result.data;

            if (result.token) {
                /* sessionStorage.setItem('user', JSON.stringify(result.result));
                sessionStorage.setItem('token', JSON.stringify(result.auth));
                navigate('/'); */
                // alert(result.message)

                let token = result.token;
                dispatch(setOtpToken(token));
                toast.success('otp sent successfully', {
                    id: toastId,
                });
                navigate('/otp')
            }
            else if (result.error) {
                toast.error(result.error, {
                    id: toastId,
                });
            }
            else {

                toast.error('user exist or invalid field', {
                    id: toastId,
                });
                // alert('user exist or invalid field');
            }
        }
        catch (err) {

            //toast.error("something went wrong",{position:'top-center',toastId:'random' ,className:'toastBody',style:{},bodyClassName: "toastBody"});
            //alert('problem occured');
            toast.error('something went wrong', {
                id: toastId,
            });
        }

    }


}

const adduser = (otp, token, navigate,dispatch) => {
    return async () => {
        // console.log(`otp is : ${otp} \n token is : ${token}`)
        const toastId = toast.loading('Loading...');
        try {
            let vdata = {
                otp,
                token
            }
            let result = await apiConnect(
                'POST',
                'auth/verify',
                vdata,
                { 'Content-Type': 'application/json' }
            );

            result = result.data
            if (result.token) {
                console.log(result)
                sessionStorage.setItem('user', JSON.stringify(result.user));
                sessionStorage.setItem('token', JSON.stringify(result.token));
                toast.success('sign in successfully', {
                    id: toastId,
                });
                dispatch(setToken(result.token));
                navigate('/')
            }
            else {
                //alert('something went wrong',result);
                toast.error('please enter valid otp', {
                    id: toastId,
                });
                console.log(result.msg)
            }


        }
        catch (err) {
            toast.error('something went wrong', {
                id: toastId,
            });
            //alert('error occure : ', err)

        }

    }
}

const login = (udata, navigate,dispatch) => {
    return async () => {
        const toastId = toast.loading('Loading...');
        try {
            //console.log(udata)
            /*  let result = await fetch('http://localhost:5000/api/auth/login', {
                 method: 'post',
                 body: JSON.stringify(udata),
                 headers: {
                     'content-type': 'application/json'
                 }
             })
                 result = await result.json();  */



            let result = await apiConnect(
                'POST',
                'auth/login',
                udata,
                { 'Content-Type': 'application/json' }
            );

            result = result.data;
            //console.log("checking", result.user)

            if (result.user) {
                sessionStorage.setItem('user', JSON.stringify(result.user));
                sessionStorage.setItem('token', JSON.stringify(result.token));
                toast.success('logged in successfully', {
                    id: toastId,
                });
                dispatch(setToken(result.token))
                dispatch(getUserDetails(result.token,dispatch))
                navigate('/')
                //alert('login successfully');
            }
            else {
                //alert('invalid information');
                toast.error('invalid information', {
                    id: toastId,
                });
            }

        }
        catch (err) {
            //alert('faied to login ' + err)
            toast.error('something went wrong', {
                id: toastId,
            });

        }
    }
}

export { signup, login, adduser };

