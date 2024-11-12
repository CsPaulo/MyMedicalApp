import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
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
import { Outlet, Link } from "react-router-dom"; // Importando Link e Outlet para navegação
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const AdminDashboard = () => {
  const [openGerenciamento, setOpenGerenciamento] = useState(false);
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

      {/* Conteúdo Principal (Componente Outlet vai renderizar as rotas aqui) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Toolbar />
        <Outlet />{" "}
        {/* O conteúdo correspondente à rota será renderizado aqui */}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
