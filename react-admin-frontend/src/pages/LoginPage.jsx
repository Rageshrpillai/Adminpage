import React, { useState } from "react";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <AuthLayout
      title={isLoginMode ? "Welcome Back" : "Create Account"}
      subtitle={
        isLoginMode
          ? "Sign in to your account to continue"
          : "Join us today and get started"
      }
    >
      {isLoginMode ? (
        <LoginForm onToggleMode={handleToggleMode} />
      ) : (
        <RegisterForm onToggleMode={handleToggleMode} />
      )}
    </AuthLayout>
  );
};

export default LoginPage;
