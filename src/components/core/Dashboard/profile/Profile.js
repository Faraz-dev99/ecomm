import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdEdit } from "react-icons/md";
import { BsPersonCheckFill } from "react-icons/bs";
import { FaKey } from "react-icons/fa";
import { updateProfilePicture } from '../../../../oprations/userApi';
import { FaEye,FaEyeSlash } from "react-icons/fa";

const Profile = () => {
  const { userDetails } = useSelector((state) => state.user)
  const [username, setUsername] = useState("");
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState("");
  const [pfpFile, setPfpFile] = useState();
  const dispatch = useDispatch();
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });



  useEffect(() => {
    if (userDetails) {
      setUsername(userDetails.username || "");
      setEmail(userDetails.email || "");
      setPreview(userDetails.profilePicture?.secure_url);
    }
  }, [userDetails])
  const handlePfp = (e) => {
    let name = e.name;
    let value = e.value;

    const file = e.files ? e.files[0] : null;
    if (file) {
      let preview = URL.createObjectURL(file);
      setPfpFile(file);
      setPreview(preview)
      /* setProductInformation((prev) => {
        return {
          ...prev,
          [name]: [file, preview]
        }
      }) */
      console.log(preview)
      return;
    }
  }

  const handlePassword = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setPasswordFields((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const togglePassword = (field) => {
  setShowPassword((prev) => ({
    ...prev,
    [field]: !prev[field]
  }));
};


  const updateProfile = async () => {
    try {
      const token = sessionStorage.getItem("token").replace(/^"|"$/g, "");
      let newErrors = {};

      // username validation
      if (!username.trim()) {
        newErrors.username = "Username is required";
      }

      if (isChangePassword) {
        // password validations
        if (!passwordFields.currentPassword.trim()) {
          newErrors.currentPassword = "Current password is required";
        }
        if (!passwordFields.newPassword.trim()) {
          newErrors.newPassword = "New password is required";
        }
        if (!passwordFields.confirmPassword.trim()) {
          newErrors.confirmPassword = "Confirm password is required";
        }
        if (
          passwordFields.newPassword &&
          passwordFields.confirmPassword &&
          passwordFields.newPassword !== passwordFields.confirmPassword
        ) {
          newErrors.confirmPassword = "Passwords do not match";
        }
      }

      // if errors exist → stop
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({}); // clear old errors


      if (isChangePassword) {
        const data = await updateProfilePicture(
          token,
          dispatch,
          pfpFile,
          username,
          passwordFields, // include passwords
          userDetails
        );
        console.log("Profile updated with password change", data);
        return;
      }

      // normal update (no password change)
      const data = await updateProfilePicture(
        token,
        dispatch,
        pfpFile,
        username,
        false, // passwordFlag = false
        userDetails
      );
      console.log("Profile updated without password change", data);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  return (
    <div className=' flex flex-col justify-center items-center'>
      <h1 className=' text-2xl font-semibold mb-5'>Hi, <span className=' text-teal-600 font-bold'>{userDetails?.username}</span></h1>
      <div className=' flex max-md:flex-col justify-center items-center gap-10 py-10 px-5 md:px-10  bg-zinc-900 w-full max-w-[500px]'>
        <div className=' self-start md:order-2 mx-auto'>
          <div className=' grid place-items-center h-[100px] w-[100px] rounded-full bg-zinc-800  relative'>
            {(userDetails?.profilePicture || preview) ? <img src={preview || userDetails?.profilePicture.secure_url} alt="pfp" className=' grid place-items-center h-full w-full rounded-full ' /> : <p className=' grid place-items-center rounded-full bg-red-600 w-full h-full text-6xl font-bold'>{userDetails?.username?.slice(0, 1).toUpperCase()}</p>}
            <input type='file' id='pfp' name='pfp' onChange={(e) => handlePfp(e.target)} className=' hidden' />
            <label htmlFor="pfp" className=' absolute bottom-0 right-0 bg-white rounded-full text-black p-[5px] font-bold cursor-pointer'><MdEdit /></label>
          </div>
        </div>

        <div className=' flex flex-col  w-full'>
          <div className=' flex flex-col gap-4 mb-10'>
            <h3 className=' font-bold text-zinc-300 text-xs'>EMAIL ADDRESS</h3>
            <input defaultValue={email} className=' py-2 px-3 text-sm rounded-md text-zinc-500 bg-zinc-800' disabled />
            <div className='flex justify-center items-center max-w-[90px] text-center text-xs border border-teal-500 rounded-2xl py-2 px-2 text-teal-500 font-semibold'><BsPersonCheckFill className=' text-sm mr-2' />Verified</div>
          </div>

          <div className=' flex flex-col gap-4 mb-10'>
            <h3 className=' font-bold text-zinc-300 text-xs'>USERNAME</h3>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className=' text-sm py-2 px-3 rounded-md outline-none bg-zinc-800' />
            {errors.username && <p className="text-red-500 -mt-2 text-xs">{errors.username}</p>}
          </div>

          <button className=' flex items-center text-sm font-bold text-zinc-700 hover:text-zinc-500 cursor-pointer mb-10' onClick={() => setIsChangePassword(!isChangePassword)}><FaKey className=' mr-2' />Change Password</button>

          <div className={` flex flex-col gap-10 w-full overflow-hidden transition-all duration-500 ${isChangePassword ? " max-h-[500px] mb-10" : "max-h-0"}`}>
            <div className=' flex flex-col gap-4'>
              <h3 className=' font-bold text-zinc-300 text-xs'>CURRENT PASSWORD</h3>
              <div className=' bg-zinc-800 py-2 px-3 rounded-md flex justify-between'>
                <input type={showPassword.current ? "text" : "password"} value={passwordFields.currentPassword} name="currentPassword" onChange={handlePassword} className=' text-sm  rounded-md outline-none bg-transparent' />
              <button
                type="button"
                onClick={() => togglePassword("current")}
                className=" text-sm"
              >
                {showPassword.current ? <FaEyeSlash /> : <FaEye />}
              </button>
              </div>
              
              {errors.currentPassword && <p className="text-red-500 -mt-2 text-xs">{errors.currentPassword}</p>}
            </div>
            <div className=' flex flex-col gap-4'>
              <h3 className=' font-bold text-zinc-300 text-xs'>NEW PASSWORD</h3>
               <div className=' bg-zinc-800 py-2 px-3 rounded-md flex justify-between'>
              <input type={showPassword.new ? "text" : "password"} value={passwordFields.newPassword} name="newPassword" onChange={handlePassword} className=' text-sm  rounded-md outline-none bg-transparent' />
              <button
                type="button"
                onClick={() => togglePassword("new")}
                className=" text-sm"
              >
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </button>
              </div>
              {errors.newPassword && <p className="text-red-500 -mt-2 text-xs">{errors.newPassword}</p>}
            </div>
            <div className=' flex flex-col gap-4'>
              <h3 className=' font-bold text-zinc-300 text-xs'>CONFIRM PASSWORD</h3>
              <div className=' bg-zinc-800 py-2 px-3 rounded-md flex justify-between'>
              <input type={showPassword.confirm ? "text" : "password"} value={passwordFields.confirmPassword} name="confirmPassword" onChange={handlePassword} className=' text-sm  rounded-md outline-none bg-transparent' />
              <button
                type="button"
                onClick={() => togglePassword("confirm")}
                className=" text-sm"
              >
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 -mt-2 text-xs">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button className=' w-full py-2 px-2 transition-all duration-500 border border-teal-500 rounded-md text-teal-500 hover:bg-teal-500 hover:text-zinc-950 mb-10' onClick={updateProfile}>Save Changes</button>
        </div>

      </div>
    </div>
  )
}

export default Profile
