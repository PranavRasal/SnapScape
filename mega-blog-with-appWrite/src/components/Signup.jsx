import React , { useState } from 'react'
import authService from '../appwrite/auth';
import {Link , useNavigate} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, input, Logo } from "../components/index";
import { useDispatch } from "react-redux";
import { login  } from "../store/authSlice";


function Signup() {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register , handleSubmit} = useForm();

    const create = async (data) =>{
        setError(" ");
     try {
        const userData = await authService.createAccount(data);
        if(userData){
            const userData = await authService.currentUser();
            if(userData){
                dispatch(login(userData));
                navigate("/");
            }
        }
     } catch (error) {
        setError(error.message); 
     }
    }
  return (
    <div>
      
    </div>


  )
}

export default Signup
