import React, { useState } from "react";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Input, Logo } from "../components/index";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";

function Signup() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();



  const create = async (data) => {
    setError(" ");
    try {
      const userData = await authService.createAccount(data);
      if (userData) {
        const userData = await authService.currentUser();
        if (userData) {
          console.log('✅ Dispatching login with userData:', userData);
          dispatch(login({ userData }));
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className=" flex item-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 `}>
          <div className="mb-2 flex justify-center">
            <span className="inline-block w-full  max-w-[100px]">
                      <Logo width="100%" />
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-5 text-center">
                    Create your account
                  </h2>
                <p
                    className="mt-2 text-center text-base text-black/60">
                      Already have an account?&nbsp;
                    <Link
                      to="/signup"
                      className="font-medium text-primary
                      transition-all duration-200 hover: underline">
                      Sign Up
                    </Link>
                </p>
        {error && <p className="text-red-600  mt-8 text-center">{error}</p>}
          <form onSubmit={handleSubmit(create)}>
            <div className="space-y-5">
              <Input 
              label = " full name"
              placeholder="Enter your full name"
              {...register("name " , {
                required : true
              })}
              />
              <Input 
              label = "Email"
              placeholder="Enter your Email"
              type = "email"
              {...register("email" , {
              required : true ,
              validate : {
              matchPattern : (value) => 
              /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Please enter a valid email address",}
              })}
              />
              <Input 
              label = "Password"
              placeholder="Enter your Password"
              type = "password"
              {...register("password" , {
                required : true ,
                minLength : {
                  value : 8 ,
                  message : "Password must be at least 8 characters long"
                }
              })}
              />
              <Button type= "submit" className = "w-full" >
                create account
              </Button>
            </div>
          </form>
        </div>
    </div>
  );
}

export default Signup;
