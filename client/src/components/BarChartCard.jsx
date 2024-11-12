import React from "react";
import { Card, CardContent, Typography, useTheme } from "@mui/material";
import { Bar } from "react-chartjs-2"; // Importe o gráfico de barras
import { Chart, registerables } from "chart.js"; // Registro de elementos do Chart.js
Chart.register(...registerables); // Registro necessário para que o Chart.js funcione corretamente

const BarChartCard = ({ title, dataValues }) => {
  const theme = useTheme();

  // Total dos valores
  const total = dataValues.reduce((acc, item) => acc + item, 0);

  // Dados do gráfico
  const data = {
    labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"], // Labels de 6 meses
    datasets: [
      {
        label: "Número de Análises",
        data: dataValues, // Valores passados como props
        backgroundColor: theme.palette.primary.main, // Cor das barras
        borderColor: theme.palette.primary.dark, // Cor da borda das barras
        borderWidth: 2, // Largura da borda
        borderRadius: 10, // Arredondamento das bordas
      },
    ],
  };

  // Opções do gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Para permitir altura customizada
    plugins: {
      legend: {
        display: false, // Remover legenda
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return ` ${tooltipItem.dataset.label}: ${tooltipItem.raw}`; // Personalizar tooltip
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Começar o eixo Y do zero
        ticks: {
          padding: 20, // Espaçamento entre os números do eixo Y
          // Diminui o número de linhas horizontais
          stepSize: Math.ceil(total / 5), // Divide em 5 linhas horizontais
        },
        grid: {
          display: true, // Exibir linhas horizontais
          drawBorder: false, // Remover a linha do eixo Y
          color: theme.palette.divider, // Cor das linhas horizontais
          lineWidth: 1, // Largura das linhas horizontais
        },
      },
      x: {
        ticks: {
          padding: 20, // Espaçamento entre os números do eixo X
        },
        grid: {
          display: false, // Remover linhas verticais
        },
      },
    },
  };

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        borderRadius: 2,
        boxShadow: 2,
        margin: 2,
        height: "550px", //altura do card
        width: "600px", //largura do card aqui
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" sx={{ marginBottom: 1 }}>
          {title}
        </Typography>
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: "bold",
            marginBottom: 2,
          }}
        >
          {total}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, marginBottom: 2 }}
        >
          Última Semana
        </Typography>
        <div style={{ height: "400px" }}>
          {" "}
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChartCard;
