
import { setUserDetails } from "../slices/userSlice";
import { baseUrl } from "./api";
import { apiConnect } from "./apiConnect";
import toast from "react-hot-toast";

const getUserDetails = (token, dispatch) => {
    return async () => {
        try {



            let userDetail = await apiConnect(
                'get',
                'user/getUser',
                null,
                {
                    Authorization: `berear ${token}`,
                    'Content-Type': 'application/json'
                }
            )
            userDetail = userDetail.data;

            if (!userDetail.success) {
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

const updateProfilePicture = async (token, dispatch, file,username,passwordField, userDetails) => {
    const toastId = toast.loading('updating...');
    try {
        const formData = new FormData();
        formData.append("profilePicture", file);
        formData.append("username",username);
        
        if(passwordField){
            formData.append("currentPassword",passwordField.currentPassword);
            formData.append("newPassword",passwordField.newPassword);
            formData.append("confirmPassword",passwordField.confirmPassword);

            if(passwordField.newPassword != passwordField.confirmPassword){
                throw new Error("please confirm new password");
            }
                
        }

        const res = await fetch(`${baseUrl}user/updateProfilePicture`,
            {
                method: "post",
                headers: {
                    Authorization: `berear ${token}`
                },
                body: formData
            }
        );

        const data = await res.json();
        if (!data.success) {
            throw new Error(data.message);
        }




        // Merge only profilePicture into existing user state
        if (data.user) {
            dispatch(
                setUserDetails({
                    ...data.user
                })
            );

        }

       // console.log("updated bro ", data);

        toast.success('Profile Updated successfully', {
            id: toastId,
        });

        return data;
    } catch (err) {
        toast.error(`${err.response?.data?.message || err.message || 'Something went wrong'}`, {
            id: toastId,
        });
        console.log("failed due to", err);
        // throw err;
    }
};



export { getUserDetails, updateProfilePicture };