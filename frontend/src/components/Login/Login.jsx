import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
const navigate = useNavigate();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [visible, setVisible] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();

//console.log("Email:", email);
//console.log("Password:", password);

try {
  await axios.post(
    `${server}/user/login-user`,
    {
      email,
      password,
    },
    { withCredentials: true }
  );

  toast.success("Login Success!");
  navigate("/");
} catch (err) {
  console.log(err);
  toast.error(
    err.response?.data?.message || "Login failed. Please try again."
  );
}

};

return (
<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

  {/* Title */}
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <h1 className="text-center text-3xl font-semibold text-gray-900">
      Login to your account
    </h1>
  </div>

  {/* Form container */}
  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div className="bg-white px-6 py-8 shadow sm:rounded-lg">

      <form className="space-y-6" onSubmit={handleSubmit}>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative mt-1">
            <input
              type={visible ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10 focus:ring-2 focus:ring-blue-500"
            />

            {visible ? (
              <AiOutlineEyeInvisible
                size={22}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setVisible(false)}
              />
            ) : (
              <AiOutlineEye
                size={22}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setVisible(true)}
              />
            )}
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />

            <label
              htmlFor="remember-me"
              className="ml-2 text-sm text-gray-900"
            >
              Remember Me
            </label>
          </div>

          <a
            href="#"
            className="text-sm font-medium text-blue-800 hover:text-blue-500"
          >
            Forgot Password?
          </a>

        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          Sign In
        </button>

        {/* Signup */}
        <div className="flex items-center justify-center">
          <span className="text-gray-700">
            Don't have an account?
          </span>

          <Link
            to="/sign-up"
            className="text-blue-600 pl-2 font-medium"
          >
            Sign Up
          </Link>
        </div>

      </form>

    </div>
  </div>

</div>

);
};

export default Login;