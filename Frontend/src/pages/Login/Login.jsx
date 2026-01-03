import React, { useState } from "react";
import AuthForm from "../../assets/components/AuthForm";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("LOGIN:", formData);
  };

  return (
    <AuthForm
      isLogin={true}
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default Login;
