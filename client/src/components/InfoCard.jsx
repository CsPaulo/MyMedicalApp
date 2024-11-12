import React from "react";
import { Card, CardContent, Typography, useTheme } from "@mui/material";
import { Line } from "react-chartjs-2"; // Importe o componente de gráfico de linhas

const InfoCard = ({ title, analysisCount }) => {
  const theme = useTheme(); // Hook para acessar o tema atual

  // Dados do gráfico
  const dataValues = [12, 19, 3, 5, 2, 3, 8]; // Exemplo de dados
  const totalAnalyses = dataValues.reduce((acc, value) => acc + value, 0); // Soma dos valores
  const data = {
    labels: ["Dia 1", "Dia 2", "Dia 3", "Dia 4", "Dia 5", "Dia 6", "Dia 7"], // Labels do gráfico
    datasets: [
      {
        label: "Número de Análises",
        data: dataValues, // Dados do gráfico
        fill: false, // Remover preenchimento abaixo da linha
        borderColor: theme.palette.primary.main, // Cor da linha
        borderWidth: 2, // Largura da linha
        tension: 0.1, // Curvatura da linha
      },
    ],
  };

  // Opções do gráfico
  const options = {
    plugins: {
      legend: {
        display: false, // Remover legenda
      },
      tooltip: {
        enabled: true, // Tooltip ativada para mostrar dados ao passar o mouse
      },
    },
    scales: {
      y: {
        display: false, // Remover os números do eixo Y (lateral)
      },
      x: {
        display: false, // Remover os números do eixo X (inferior)
      },
    },
    maintainAspectRatio: false, // Manter proporção do gráfico
  };

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: theme.palette.background.paper, // Cor de fundo do tema
        borderColor: theme.palette.divider, // Cor da borda do tema
        borderRadius: 2, // Arredondar bordas
        boxShadow: 2, // Sombra leve
        margin: 2, // Margem ao redor do card
        width: "400px", // Definir a largura específica do card
        height: "280px", // Definir a altura específica do card
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" sx={{ marginBottom: 1 }}>
          Análises
        </Typography>
        <Typography variant="h4" component="div" sx={{ marginBottom: 1 }}>
          {totalAnalyses} {/* Exibe o número de análises com uma fonte maior */}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, marginBottom: 2 }}
        >
          Última Semana
        </Typography>
        <div style={{ height: "100px" }}>
          <Line data={data} options={options} />{" "}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
