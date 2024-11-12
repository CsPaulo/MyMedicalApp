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
  Avatar,
  Divider,
  Button,
  createTheme,
  ThemeProvider,
  TextField,
  FormControlLabel,
  Switch,
  Popover,
  Card,
  Grid,
  CardContent,
  CircularProgress,
  Badge,
} from "@mui/material";
import {
  Dashboard,
  Settings,
  Inbox,
  Logout,
  Menu,
  ChevronLeft,
  Brightness4,
  Brightness7,
  Notifications,
  NotificationsNone,
} from "@mui/icons-material";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import BarChartCard from "../components/BarChartCard";
import DoughnutChart from "../components/DoughnutChart";
import DataTable from "../components/DataTable";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const drawerWidth = 240;
const drawerWidthMinimized = 60;

const ClientDashboard = () => {
  const [selectedContent, setSelectedContent] = useState("dashboard");
  const [title, setTitle] = useState("Dashboard");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [showText, setShowText] = useState(isDrawerOpen);
  const [imageFile, setImageFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notifications] = useState([
    "Notificação 1",
    "Notificação 2",
    "Notificação 3",
  ]);
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setProfileAnchorEl(null);
  };

  const profileOpen = Boolean(profileAnchorEl);
  const profileId = profileOpen ? "profile-popover" : undefined;

  const theme = createTheme({
    palette: {
      mode: isDarkTheme ? "dark" : "light",
      primary: {
        main: "#1976d2", // Azul padrão do Material-UI
      },
      secondary: {
        main: "#f50057", // Rosa padrão do Material-UI
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
      h4: {
        fontWeight: 600,
      },
      body1: {
        lineHeight: 1.6,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            },
          },
        },
      },
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size <= 5 * 1024 * 1024) {
        // Limite de 5MB
        setImageFile(file);
        setUploadStatus("");
        setAnalysisResult(null); // Redefine o resultado da análise
        setShowResult(false); // Esconde a seção de resultado
      } else {
        setUploadStatus("O arquivo é muito grande. O limite é de 5MB.");
      }
    } else {
      setUploadStatus("Por favor, selecione um arquivo de imagem válido.");
    }
  };

  const handleSavePDF = () => {
    if (imageFile) {
      const doc = new jsPDF();
      doc.text("Resultado da Análise:", 10, 10);
      doc.text(analysisResult, 10, 20);
      doc.text("Imagem:", 10, 30);
      doc.addImage(URL.createObjectURL(imageFile), "JPEG", 10, 40, 180, 160);
      doc.save("relatorio.pdf");
    } else {
      console.error("Nenhuma imagem disponível para gerar o PDF.");
    }
  };

  const handleImageSubmit = () => {
    if (imageFile) {
      setUploadStatus("Enviando imagem...");
      setTimeout(() => {
        const mockResult =
          "Análise concluída. Resultados: Sem anomalias detectadas.";
        setAnalysisResult(mockResult);
        setShowResult(true);
        setUploadStatus("Imagem enviada com sucesso.");
        // Remova ou comente a linha abaixo se quiser manter a imagem na tela
        // setImageFile(null);
      }, 2000);
    } else {
      setUploadStatus("Por favor, selecione uma imagem.");
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const renderContent = () => {
    switch (selectedContent) {
      case "dashboard":
        return (
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Bem-vindo ao Dashboard!
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={20} md={3.5}>
                <InfoCard />
                <InfoCard />
              </Grid>
              <Grid item xs={20} md={5}>
                <BarChartCard
                  title="Gráfico de Análises"
                  dataValues={[12, 19, 3, 5, 2, 3, 8]}
                />
              </Grid>
              <Grid item xs={20} md={1}>
                <DoughnutChart
                  data={[
                    { label: "Red", value: 12 },
                    { label: "Blue", value: 19 },
                    { label: "Yellow", value: 3 },
                    { label: "Purple", value: 2 },
                  ]}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case "envioImagens":
        return (
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
              Envio de Imagens Histopatológicas
            </Typography>

            {/* Seção de Upload de Imagem */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  fullWidth
                >
                  Escolher Imagem
                  <input
                    accept="image/*"
                    type="file"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button>
                {imageFile && (
                  <Box
                    sx={{
                      mt: 2,
                      textAlign: "center",
                      overflow: "hidden",
                      maxWidth: "100%",
                      maxHeight: "400px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      key={imageFile.name} // Aqui a chave muda, forçando o React a re-renderizar
                      src={URL.createObjectURL(imageFile)}
                      alt="Pré-visualização"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleImageSubmit}
                  disabled={!imageFile}
                >
                  Enviar Imagem
                </Button>
                {uploadStatus && (
                  <Typography
                    variant="body2"
                    color={uploadStatus.includes("sucesso") ? "green" : "red"}
                    sx={{ mt: 2 }}
                    align="center"
                  >
                    {uploadStatus}
                  </Typography>
                )}
                {uploadStatus === "Enviando imagem..." && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Seção de Resultado da Análise */}
            {showResult && (
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6">Resultado da Análise:</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {analysisResult}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={termsAccepted}
                          onChange={() => setTermsAccepted(!termsAccepted)}
                        />
                      }
                      label="Aceito os termos de compromisso"
                    />
                  </Box>
                  {termsAccepted && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSavePDF}
                        sx={{ width: "100%" }}
                      >
                        Gerar PDF com Análise
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        );

      case "configuracoes":
        return (
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Configurações do Usuário
            </Typography>

            {/* Seção de Conta */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6">Conta</Typography>
                <TextField
                  label="Nome de Usuário"
                  fullWidth
                  margin="normal"
                  defaultValue="Nome de Usuário"
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  defaultValue="usuario@exemplo.com"
                />
              </CardContent>
            </Card>

            {/* Seção de Segurança */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6">Segurança</Typography>
                <TextField
                  label="Senha Atual"
                  type="password"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Nova Senha"
                  type="password"
                  fullWidth
                  margin="normal"
                />
                <Button variant="contained" sx={{ mt: 2 }}>
                  Salvar Senha
                </Button>
              </CardContent>
            </Card>

            {/* Seção de Notificações */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6">Notificações</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationsEnabled}
                      onChange={() =>
                        setNotificationsEnabled(!notificationsEnabled)
                      }
                    />
                  }
                  label={
                    notificationsEnabled
                      ? "Ativar Notificações"
                      : "Desativar Notificações"
                  }
                />
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return <Typography variant="h4">Selecione uma opção.</Typography>;
    }
  };

  const handleMenuClick = (content, newTitle) => {
    setSelectedContent(content);
    setTitle(newTitle);
  };

  const toggleDrawer = () => {
    if (!isDrawerOpen) {
      setIsDrawerOpen(true);
      setTimeout(() => setShowText(true), 100); // Atraso de 300ms após abrir o drawer
    } else {
      setShowText(false);
      setTimeout(() => setIsDrawerOpen(false), 100); // Fechar após esconder o texto
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${
              isDrawerOpen ? drawerWidth : drawerWidthMinimized
            }px)`,
            ml: `${isDrawerOpen ? drawerWidth : drawerWidthMinimized}px`,
            boxShadow: "none",
            transition: "width 0.3s ease, margin-left 0.3s ease",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              sx={{ mr: 2 }}
            >
              {isDrawerOpen ? <ChevronLeft /> : <Menu />}
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => setIsDarkTheme(!isDarkTheme)}
            >
              {isDarkTheme ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={notifications.length} color="secondary">
                {notifications.length > 0 ? (
                  <Notifications />
                ) : (
                  <NotificationsNone />
                )}
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            width: isDrawerOpen ? drawerWidth : drawerWidthMinimized,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isDrawerOpen ? drawerWidth : drawerWidthMinimized,
              boxSizing: "border-box",
              transition: "width 0.3s ease",
              overflow: "hidden",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Box
            sx={{
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <List>
              <ListItem
                button
                onClick={() => setSelectedContent("dashboard")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  minWidth: "240px",
                }}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <Dashboard />
                </ListItemIcon>
                {isDrawerOpen && showText && (
                  <ListItemText primary="Dashboard" />
                )}
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  handleMenuClick("envioImagens", "Envio de Imagens")
                }
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  minWidth: "240px",
                }}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <Inbox />
                </ListItemIcon>
                {isDrawerOpen && showText && (
                  <ListItemText primary="Envio de Imagens" />
                )}
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  handleMenuClick("configuracoes", "Configurações")
                }
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  minWidth: "240px",
                }}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <Settings />
                </ListItemIcon>
                {isDrawerOpen && showText && (
                  <ListItemText primary="Configurações" />
                )}
              </ListItem>
            </List>
            <Divider />
            <Box sx={{ marginTop: "auto" }}>
              <List>
                <ListItem
                  button
                  onClick={handleProfileClick} // Clique no avatar para abrir o popover
                  sx={{ marginLeft: -0.7 }}
                >
                  <ListItemIcon>
                    <Avatar />
                  </ListItemIcon>
                  {isDrawerOpen && showText && (
                    <ListItemText
                      primary={
                        <Typography noWrap sx={{ maxWidth: "400" }}>
                          Nome de Usuário
                        </Typography>
                      }
                    />
                  )}
                </ListItem>
                <ListItem
                  button
                  onClick={handleLogout}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    minWidth: "240px",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "40px" }}>
                    <Logout />
                  </ListItemIcon>
                  {isDrawerOpen && showText && <ListItemText primary="Sair" />}
                </ListItem>
              </List>
            </Box>
          </Box>
        </Drawer>
        <Popover
          id={profileId}
          open={profileOpen}
          anchorEl={profileAnchorEl}
          onClose={handleCloseProfile}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Avatar
              sx={{ width: 80, height: 80, margin: "0 auto" }}
              src="/path/to/profile-image.jpg" // Substitua pelo caminho real da imagem
            />
            <Typography variant="h6" sx={{ mt: 1 }}>
              Nome de Usuário
            </Typography>
            <Typography variant="body2" color="textSecondary">
              usuario@exemplo.com
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Outras informações pessoais
            </Typography>
          </Box>
        </Popover>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseNotifications}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Notificações</Typography>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <Typography key={index} variant="body2">
                  {notification}
                </Typography>
              ))
            ) : (
              <Typography variant="body2">Nenhuma notificação</Typography>
            )}
          </Box>
        </Popover>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 2,
            transition: "margin 0.3s ease, padding 0.3s ease",
            marginLeft: `${72}px`,
          }}
        >
          <Toolbar />
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
};
export default ClientDashboard;
