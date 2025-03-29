import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast"; 
import { API_BASE_URL } from "../../config";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/tasks"); 
    }
  }, [navigate]);

  const handleInputUpdate = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${API_BASE_URL}/user/login`, formData);
      toast.success("User logged in successfully"); 
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId); 
      navigate("/tasks");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Toaster /> 
      <form onSubmit={loginUser}>
        <Box
          maxWidth={450}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          margin="auto"
          marginTop={5}
          boxShadow="10px 10px 20px #ccc"
          padding={3}
          borderRadius={5}
        >
          <Typography variant="h4" sx={{ textTransform: "uppercase" }} padding={3} textAlign="center">
            Login
          </Typography>

          <TextField
            placeholder="Email"
            value={formData.email}
            name="email"
            margin="normal"
            type="email"
            required
            onChange={handleInputUpdate}
          />
          <TextField
            placeholder="Password"
            value={formData.password}
            name="password"
            margin="normal"
            type="password"
            required
            onChange={handleInputUpdate}
          />

          <Button type="submit" sx={{ borderRadius: 3, marginTop: 3 }} variant="contained" color="primary">
            Submit
          </Button>
          <Button onClick={() => navigate("/register")} sx={{ borderRadius: 3, marginTop: 3 }}>
            Not a user? Register
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Login;
