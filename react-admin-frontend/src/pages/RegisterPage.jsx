import React from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleToggleMode = () => {
    navigate("/login");
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us today and get started with your admin dashboard"
    >
      <RegisterForm onToggleMode={handleToggleMode} />
    </AuthLayout>
  );
};

export default RegisterPage;
