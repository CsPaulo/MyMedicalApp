import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "client") {
        navigate("/client-dashboard");
      }
    }
  }, [navigate]);

  const handleLogin = async () => {
    const credentials = {
      username: username.trim(),
      password: password.trim(),
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, role } = data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "client") {
          navigate("/client-dashboard");
        }
      } else {
        setErrorMessage("Login Falhou. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Something went wrong.");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px",
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ marginBottom: "15px", color: "#1976d2" }}
        >
          Entrar
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ marginBottom: "25px", color: "#1976d2" }}
        >
          Bem-vindo(a)!
        </Typography>

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Nome de Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Senha"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            marginTop: "25px",
            padding: "12px 0",
            backgroundColor: "#1976d2",
            ":hover": {
              backgroundColor: "#115293",
            },
          }}
          onClick={handleLogin}
        >
          Entrar
        </Button>

        {errorMessage && (
          <Typography color="error" sx={{ marginTop: "15px" }}>
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Login;
