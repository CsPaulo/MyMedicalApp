import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Button,
  IconButton,
} from "@mui/material";
import {
  Dashboard,
  Settings,
  ExpandMore,
  ExpandLess,
  ManageAccounts,
  Inbox,
  Search,
  Logout,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const drawerWidth = 240;

const AdminDashboard = () => {
  const [openGerenciamento, setOpenGerenciamento] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [probability, setProbability] = useState(null);
  const [token, setToken] = useState(""); // Adicione um estado para o token
  const navigate = useNavigate();

  // Função para alternar a expansão/colapso
  const handleGerenciamentoClick = () => {
    setOpenGerenciamento(!openGerenciamento);
  };

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redireciona o usuário para a tela de login
    navigate("/");
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Inclua o token JWT no cabeçalho
          },
        }
      );
      setProbability(response.data.probability);
    } catch (error) {
      console.error("Error uploading the file:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer - Barra Lateral */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          {/* Espaço para a Logo */}
          <Box>
            {/* Logo Placeholder */}
            <Typography variant="h6" component="div"></Typography>
          </Box>

          {/* Barra de Pesquisa */}
          <Box sx={{ padding: "10px" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Pesquisa"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Lista de Navegação */}
          <List>
            {/* Dashboard */}
            <ListItem button component={Link} to="/admin/dashboard">
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            {/* Gerenciamento (com colapso/expansão) */}
            <ListItem button onClick={handleGerenciamentoClick}>
              <ListItemIcon>
                <ManageAccounts />
              </ListItemIcon>
              <ListItemText primary="Gerenciamento" />
              {openGerenciamento ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            {/* Submenus de Gerenciamento */}
            <Collapse in={openGerenciamento} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  component={Link}
                  to="/admin/modelos"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <Inbox />
                  </ListItemIcon>
                  <ListItemText primary="Modelos" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/admin/clinicas"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <Inbox />
                  </ListItemIcon>
                  <ListItemText primary="Clínicas" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/admin/solicitacoes"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <Inbox />
                  </ListItemIcon>
                  <ListItemText primary="Solicitações" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/admin/upload"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <Inbox />
                  </ListItemIcon>
                  <ListItemText primary="Upload de Imagem" />
                </ListItem>
              </List>
            </Collapse>
          </List>

          {/* Divider */}
          <Divider />

          {/* Configurações e Perfil no rodapé */}
          <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
            <List>
              {/* Configurações */}
              <ListItem button component={Link} to="/admin/configuracoes">
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Configurações" />
              </ListItem>

              {/* Perfil com botão de logout */}
              <ListItem>
                <ListItemIcon>
                  <Avatar />
                </ListItemIcon>
                <ListItemText primary="Nome" />
                <IconButton onClick={handleLogout}>
                  <Logout />
                </IconButton>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Drawer>

      {/* Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Toolbar />
        {/* Componente de Upload de Imagem */}
        <Box sx={{ padding: "10px" }}>
          <Typography variant="h6">Upload an image to detect cancer</Typography>
          <input type="file" onChange={handleFileChange} />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter JWT Token"
            value={token}
            onChange={handleTokenChange}
            sx={{ marginTop: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ marginTop: "10px" }}
          >
            Upload
          </Button>
          {probability !== null && (
            <Typography variant="h6" sx={{ marginTop: "10px" }}>
              Probability of Cancer: {probability.toFixed(2)}%
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
