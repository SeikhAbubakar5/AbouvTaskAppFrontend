import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/tasks");
    }
  }, [navigate]);

  const handleInputUpdate = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/user/register`, formData);
      toast.success("User registered successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <form onSubmit={registerUser}>
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
            Register
          </Typography>

          <TextField 
          placeholder="Username" 
          value={formData.username} 
          onChange={handleInputUpdate} 
          name="username" 
          margin="normal" 
          required />
          <TextField 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleInputUpdate} 
          name="email" 
          margin="normal" 
          type="email" 
          required />
          <TextField 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleInputUpdate} 
          name="password" 
          margin="normal" 
          type="password" 
          required />
          <TextField 
          placeholder="Confirm Password" 
          value={formData.confirmPassword} 
          onChange={handleInputUpdate} 
          name="confirmPassword" 
          margin="normal" 
          type="password" 
          required />

          <Button type="submit" sx={{ borderRadius: 3, marginTop: 3 }} variant="contained" color="primary">
            Register
          </Button>
          <Button onClick={() => navigate("/login")} sx={{ borderRadius: 3, marginTop: 3 }}>
            Already have an account? Login
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Register;
