import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Box, Typography, useTheme } from "@mui/material";

Chart.register(...registerables);

const DoughnutChart = ({ data }) => {
  const theme = useTheme();

  const getLegendTextColor = () => {
    return theme.palette.mode === "dark"
      ? "#FFFFFF"
      : theme.palette.text.primary;
  };

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.info.main,
          theme.palette.success.main,
          theme.palette.warning.main,
        ],
        hoverBackgroundColor: [
          theme.palette.primary.light,
          theme.palette.secondary.light,
          theme.palette.info.light,
          theme.palette.success.light,
          theme.palette.warning.light,
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: getLegendTextColor(),
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            const total = tooltipItem.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        borderRadius: 2,
        boxShadow: 2,
        margin: 2,
        width: "400px",
        height: "450px",
        position: "relative",
        padding: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        variant="h5"
        component="div"
        sx={{ marginBottom: 2, color: theme.palette.text.primary }}
      >
        PieChart Análises
      </Typography>
      <Doughnut data={chartData} options={options} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "24px",
          fontWeight: "bold",
          color: theme.palette.text.primary,
          textAlign: "center",
        }}
      >
        {totalValue}
        <br />
        Total
      </div>
    </Box>
  );
};

export default DoughnutChart;
