// Criar gráficos
function createCharts() {
  if (dataset.length === 0) {
    generateData();
  }

  // Distribuição de Risco
  const riskCounts = {
    Baixo: dataset.filter((d) => d.risco === "Baixo").length,
    Médio: dataset.filter((d) => d.risco === "Médio").length,
    Alto: dataset.filter((d) => d.risco === "Alto").length,
  };

  if (charts.riskDist) charts.riskDist.destroy();
  charts.riskDist = new Chart(document.getElementById("riskDistChart"), {
    type: "doughnut",
    data: {
      labels: ["Baixo Risco", "Médio Risco", "Alto Risco"],
      datasets: [
        {
          data: [riskCounts.Baixo, riskCounts.Médio, riskCounts.Alto],
          backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Distribuição de Risco no Dataset",
          font: { size: 16, weight: "bold" },
        },
        legend: {
          position: "bottom",
        },
      },
    },
  });

  // Valor de Crédito por Risco
  const creditByRisk = {
    Baixo: dataset
      .filter((d) => d.risco === "Baixo")
      .map((d) => d.valor_credito),
    Médio: dataset
      .filter((d) => d.risco === "Médio")
      .map((d) => d.valor_credito),
    Alto: dataset.filter((d) => d.risco === "Alto").map((d) => d.valor_credito),
  };

  if (charts.scoreRisk) charts.scoreRisk.destroy();
  charts.scoreRisk = new Chart(document.getElementById("scoreByRiskChart"), {
    type: "bar",
    data: {
      labels: ["Baixo Risco", "Médio Risco", "Alto Risco"],
      datasets: [
        {
          label: "Valor Médio de Crédito (€)",
          data: [
            creditByRisk.Baixo.reduce((a, b) => a + b, 0) /
              creditByRisk.Baixo.length,
            creditByRisk.Médio.reduce((a, b) => a + b, 0) /
              creditByRisk.Médio.length,
            creditByRisk.Alto.reduce((a, b) => a + b, 0) /
              creditByRisk.Alto.length,
          ],
          backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Valor de Crédito Médio por Categoria de Risco",
          font: { size: 16, weight: "bold" },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "€" + value.toLocaleString();
            },
          },
        },
      },
    },
  });

  // Duração por Risco
  const durationByRisk = {
    Baixo: dataset
      .filter((d) => d.risco === "Baixo")
      .map((d) => d.duracao_meses),
    Médio: dataset
      .filter((d) => d.risco === "Médio")
      .map((d) => d.duracao_meses),
    Alto: dataset.filter((d) => d.risco === "Alto").map((d) => d.duracao_meses),
  };

  if (charts.incomeRisk) charts.incomeRisk.destroy();
  charts.incomeRisk = new Chart(document.getElementById("incomeByRiskChart"), {
    type: "bar",
    data: {
      labels: ["Baixo Risco", "Médio Risco", "Alto Risco"],
      datasets: [
        {
          label: "Duração Média (meses)",
          data: [
            durationByRisk.Baixo.reduce((a, b) => a + b, 0) /
              durationByRisk.Baixo.length,
            durationByRisk.Médio.reduce((a, b) => a + b, 0) /
              durationByRisk.Médio.length,
            durationByRisk.Alto.reduce((a, b) => a + b, 0) /
              durationByRisk.Alto.length,
          ],
          backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Duração Média do Empréstimo por Categoria de Risco",
          font: { size: 16, weight: "bold" },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value + " meses";
            },
          },
        },
      },
    },
  });

  // Gráfico de Correlação (simplificado)
  if (charts.correlation) charts.correlation.destroy();
  charts.correlation = new Chart(document.getElementById("correlationChart"), {
    type: "bar",
    data: {
      labels: [
        "Poupança",
        "Conta Corrente",
        "Trabalho",
        "Moradia",
        "Valor Crédito",
        "Duração",
        "Idade",
      ],
      datasets: [
        {
          label: "Importância para Classificação de Risco",
          data: [0.82, 0.78, 0.71, 0.65, 0.58, 0.52, 0.38],
          backgroundColor: "#667eea",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Importância das Variáveis do German Credit Dataset",
          font: { size: 16, weight: "bold" },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
        },
      },
    },
  });
}

// Criar gráfico de importância das features
function createFeatureImportanceChart() {
  if (charts.featureImp) charts.featureImp.destroy();
  charts.featureImp = new Chart(
    document.getElementById("featureImportanceChart"),
    {
      type: "bar",
      data: {
        labels: [
          "Nível de Poupança",
          "Status Conta Corrente",
          "Categoria Profissional",
          "Tipo de Moradia",
          "Valor do Crédito",
          "Duração (meses)",
          "Idade",
          "Propósito",
          "Sexo",
        ],
        datasets: [
          {
            label: "Importância (%)",
            data: [22, 20, 18, 15, 12, 8, 3, 1.5, 0.5],
            backgroundColor: "#667eea",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          title: {
            display: true,
            text: "Importância das Variáveis no Modelo (German Credit Dataset)",
            font: { size: 16, weight: "bold" },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 25,
          },
        },
      },
    }
  );
}

// Criar gráficos de avaliação
function createEvaluationCharts() {
  // Matriz de Confusão
  if (charts.confusionMatrix) charts.confusionMatrix.destroy();
  charts.confusionMatrix = new Chart(
    document.getElementById("confusionMatrixChart"),
    {
      type: "bar",
      data: {
        labels: ["Baixo", "Médio", "Alto"],
        datasets: [
          {
            label: "Predito: Baixo",
            data: [85, 10, 5],
            backgroundColor: "#28a745",
          },
          {
            label: "Predito: Médio",
            data: [8, 78, 14],
            backgroundColor: "#ffc107",
          },
          {
            label: "Predito: Alto",
            data: [7, 12, 81],
            backgroundColor: "#dc3545",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Matriz de Confusão (Simulada)",
            font: { size: 16, weight: "bold" },
          },
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: "Classe Real",
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: "Número de Predições",
            },
          },
        },
      },
    }
  );

  // Curva ROC
  if (charts.rocCurve) charts.rocCurve.destroy();
  charts.rocCurve = new Chart(document.getElementById("rocCurveChart"), {
    type: "line",
    data: {
      labels: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
      datasets: [
        {
          label: "Modelo",
          data: [0, 0.75, 0.85, 0.92, 0.97, 1.0],
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Linha Base",
          data: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
          borderColor: "#dc3545",
          borderDash: [5, 5],
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Curva ROC - Área Sob a Curva (AUC)",
          font: { size: 16, weight: "bold" },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Taxa de Falsos Positivos",
          },
        },
        y: {
          title: {
            display: true,
            text: "Taxa de Verdadeiros Positivos",
          },
          beginAtZero: true,
          max: 1,
        },
      },
    },
  });
}
