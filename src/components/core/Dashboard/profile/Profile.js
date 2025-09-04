import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdEdit } from "react-icons/md";
import { BsPersonCheckFill } from "react-icons/bs";
import { FaKey } from "react-icons/fa";
import { updateProfilePicture } from '../../../../oprations/userApi';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cropper from "react-easy-crop";

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

  // cropper states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    if (userDetails) {
      setUsername(userDetails.username || "");
      setEmail(userDetails.email || "");
      setPreview(userDetails.profilePicture?.secure_url);
    }
  }, [userDetails])

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handlePfp = (input) => {
    const file = input.files ? input.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
      setPfpFile(file);
    }
  }

  const getCroppedImg = async () => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((res) => (image.onload = res));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const base64 = canvas.toDataURL("image/jpeg");
    setPreview(base64);
    setShowCropper(false);
  };

  const handlePassword = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setPasswordFields((prev) => ({
      ...prev,
      [name]: value
    }));
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

      if (!username.trim()) {
        newErrors.username = "Username is required";
      }

      if (isChangePassword) {
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

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});

      if (isChangePassword) {
        await updateProfilePicture(
          token,
          dispatch,
          pfpFile,
          username,
          passwordFields,
          userDetails
        );
        return;
      }

      await updateProfilePicture(
        token,
        dispatch,
        pfpFile,
        username,
        false,
        userDetails
      );
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-semibold mb-5'>
        Hi, <span className='text-teal-600 font-bold'>{userDetails?.username}</span>
      </h1>
      <div className='flex max-md:flex-col justify-center items-center gap-10 py-10 px-5 md:px-10 bg-zinc-900 w-full max-w-[500px]'>
        {/* Profile Picture */}
        <div className='self-start md:order-2 mx-auto'>
          <div className='grid place-items-center h-[100px] w-[100px] rounded-full bg-zinc-800 relative'>
            {(preview || userDetails?.profilePicture) ? (
              <img
                src={preview || userDetails?.profilePicture.secure_url}
                alt="pfp"
                className='h-full w-full max-w-[100px] max-h-[100px] object-cover object-center rounded-full'
              />
            ) : (
              <p className='grid place-items-center rounded-full bg-red-600 w-full h-full text-6xl font-bold'>
                {userDetails?.username?.slice(0, 1).toUpperCase()}
              </p>
            )}
            <input
              type='file'
              id='pfp'
              name='pfp'
              accept='image/*'
              onChange={(e) => handlePfp(e.target)}
              className='hidden'
            />
            <label
              htmlFor="pfp"
              className='absolute bottom-0 right-0 bg-white rounded-full text-black p-[5px] font-bold cursor-pointer'
            >
              <MdEdit />
            </label>
          </div>
        </div>

        {/* Details */}
        <div className='flex flex-col w-full'>
          <div className='flex flex-col gap-4 mb-10'>
            <h3 className='font-bold text-zinc-300 text-xs'>EMAIL ADDRESS</h3>
            <input defaultValue={email} className='py-2 px-3 text-sm rounded-md text-zinc-500 bg-zinc-800' disabled />
            <div className='flex justify-center items-center max-w-[90px] text-center text-xs border border-teal-500 rounded-2xl py-2 px-2 text-teal-500 font-semibold'>
              <BsPersonCheckFill className='text-sm mr-2' />Verified
            </div>
          </div>

          <div className='flex flex-col gap-4 mb-10'>
            <h3 className='font-bold text-zinc-300 text-xs'>USERNAME</h3>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='text-sm py-2 px-3 rounded-md outline-none bg-zinc-800'
            />
            {errors.username && <p className="text-red-500 -mt-2 text-xs">{errors.username}</p>}
          </div>

          <button
            className='flex items-center text-sm font-bold text-zinc-700 hover:text-zinc-500 cursor-pointer mb-10'
            onClick={() => setIsChangePassword(!isChangePassword)}
          >
            <FaKey className='mr-2' />Change Password
          </button>

          <div className={`flex flex-col gap-10 w-full overflow-hidden transition-all duration-500 ${isChangePassword ? "max-h-[500px] mb-10" : "max-h-0"}`}>
            {/* Password fields */}
            {["current", "new", "confirm"].map((field) => (
              <div key={field} className='flex flex-col gap-4'>
                <h3 className='font-bold text-zinc-300 text-xs'>
                  {field.toUpperCase()} PASSWORD
                </h3>
                <div className='bg-zinc-800 py-2 px-3 rounded-md flex justify-between'>
                  <input
                    type={showPassword[field] ? "text" : "password"}
                    value={passwordFields[`${field}Password`]}
                    name={`${field}Password`}
                    onChange={handlePassword}
                    className='text-sm rounded-md outline-none bg-transparent'
                  />
                  <button type="button" onClick={() => togglePassword(field)} className="text-sm">
                    {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors[`${field}Password`] && (
                  <p className="text-red-500 -mt-2 text-xs">{errors[`${field}Password`]}</p>
                )}
              </div>
            ))}
          </div>

          <button
            className='w-full py-2 px-2 transition-all duration-500 border border-teal-500 rounded-md text-teal-500 hover:bg-teal-500 hover:text-zinc-950 mb-10'
            onClick={updateProfile}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
          <div className="relative w-[300px] h-[300px] bg-black">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button onClick={() => setShowCropper(false)} className="px-4 py-2 bg-gray-500 text-white rounded">
              Cancel
            </button>
            <button onClick={getCroppedImg} className="px-4 py-2 bg-teal-600 text-white rounded">
              Crop & Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
