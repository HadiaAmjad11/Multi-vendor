import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";
import {server} from "../../server"
import axios from "axios";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const handleSubmit = (e) => {
  e.preventDefault();

  const newForm = new FormData();

  newForm.append("name", name);
  newForm.append("email", email);
  newForm.append("password", password);
  newForm.append("file", avatar);

  // Check what is being sent
  for (let [key, value] of newForm.entries()) {
    console.log(key, value);
  }

  axios
    .post(`${server}/user/create-user`, newForm)
    .then((res) => {
      console.log("SUCCESS:", res.data);
    })
    .catch((err) => {
      console.log("ERROR:", err.response?.data || err);
    });
};

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-semibold text-gray-900">
          Register as new User
        </h1>
      </div>


      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">

        <div className="bg-white px-6 py-8 shadow sm:rounded-lg">

          <form className="space-y-6" onSubmit={handleSubmit}>


            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e)=>setName(e.target.value)}
                placeholder="Enter your name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>


            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter Your Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>


            
            <div>

              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative mt-1">

                <input
                  type={visible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                />


                {
                  visible ? (
                    <AiOutlineEyeInvisible
                      size={22}
                      className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                      onClick={()=>setVisible(false)}
                    />
                  ) : (
                    <AiOutlineEye
                      size={22}
                      className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                      onClick={()=>setVisible(true)}
                    />
                  )
                }

              </div>

            </div>



            
            <div>

              <label className="block text-sm font-medium text-gray-700">
                Upload Avatar
              </label>


              <div className="mt-2 flex items-center gap-4">

                <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">

                  {
                    avatar ? (

                      <img
                        src={URL.createObjectURL(avatar)}
                        alt="avatar"
                        className="h-full w-full object-cover"
                      />

                    ) : (

                      <RxAvatar className="h-8 w-8 text-gray-400"/>

                    )
                  }

                </span>


                <label
                  htmlFor="file-input"
                  className="px-4 py-2 border rounded-md cursor-pointer text-gray-700 bg-white hover:bg-gray-50"
                >

                  Upload File

                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatar}
                    className="sr-only"
                  />

                </label>


              </div>

            </div>



          
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign Up
            </button>



            
            <div className="flex justify-center">

              <span className="text-gray-700">
                Already have an account?
              </span>

              <Link
                to="/login"
                className="text-blue-600 pl-2 font-medium"
              >
                Login
              </Link>

            </div>


          </form>

        </div>

      </div>

    </div>
  );
};


export default Signup;