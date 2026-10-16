import React from "react";
import './App.css';
import {BrowserRouter , Routes, Route} from "react-router-dom";
import {LoginPage, SignupPage,ActivationPage } from './Routes.js'
//import { ToastContainer, toast } from 'react-toastify';
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/sign-up' element={<SignupPage/>}/>
      <Route path='/activation/:activation_token' element={<ActivationPage/>}/>

    </Routes>
    <ToastContainer
position="bottom-left"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
transition={Bounce}
/>

    </BrowserRouter>
  )
}

export default App
