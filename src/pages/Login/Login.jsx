import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import { useAuthActions } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../../assets/images/background.png";
import crystalChecksLogo from "../../assets/images/Crystal-check-logo.png";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm();
  const { login } = useAuthActions();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setIsLoading(true);
    await login(data, navigate);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white gap-x-16 px-24 overflow-hidden">
      <div className="w-full hidden md:block">
        <img
          src={backgroundImg}
          alt=""
          className="max-h-[85dvh] w-full rounded-lg"
        />
      </div>
      <div className="pt-6 pb-8 w-full">
        <img src={crystalChecksLogo} alt="" />
        <h2 className="text-[32px] font-[600] text-[#02052F] mb-20">
          Welcome Back
        </h2>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <div className="mb-4">
              <FormInput
                name="email"
                label="Username"
                type="email"
                placeholder=""
                className=" border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                validation={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                }}
              />
            </div>
            <div className="mb-6">
              <FormInput
                name="password"
                label="Password"
                type="password"
                placeholder=""
                className=" border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                validation={{
                  required: "Password is required",
                  minLength: {
                    value: 5,
                    message: "Password must be at least 5 characters",
                  },
                }}
              />
            </div>
            <div className="mb-20">
              <p className="text-right font-[600] text-[16px] text-[#02052F]">
                Forgot Password
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Button
                text="Log In"
                className="bg-[#1710E1] flex text-white justify-center items-center flex-1 rounded-lg px-4 py-3 text-[16px] cursor-pointer font-semibold"
                type="submit"
                loadingText="Submitting..."
                loading={isLoading}
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
