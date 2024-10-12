
import { setUserDetails } from "../slices/userSlice";
import { apiConnect } from "./apiConnect";

const getUserDetails = (token, dispatch) => {
    return async () => {
        try {

            

            let userDetail = await apiConnect(
                'get',
                'user/getUser',
                null,
                {
                    Authorization: `berear ${token}`,
                    'Content-Type':'application/json'
                }
            )
            userDetail=userDetail.data;

             if(!userDetail.success){
                throw new Error(userDetail.message)
            }
            if (userDetail) {
                dispatch(setUserDetails(userDetail.user))
                //console.log(userDetail)
            } 
        }
        catch (err) {
            console.log("failed due to ", err)
        }

    }
}

export { getUserDetails };