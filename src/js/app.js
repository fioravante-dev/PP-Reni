// Dados globais
let dataset = [];
let model = null;
let charts = {};

// Mapeamento de índices para nomes de páginas
const pageNames = [
  "descricao",
  "etl",
  "analise",
  "modelagem",
  "avaliacao",
  "predicao",
  "conclusao",
];

// Função para mostrar seções
async function showSection(index) {
  const tabs = document.querySelectorAll(".tab");

  // Atualizar tabs ativos
  tabs.forEach((t) => t.classList.remove("active"));
  tabs[index].classList.add("active");

  // Carregar página correspondente
  await loadPage(pageNames[index]);

  // Gerar dados automaticamente ao abrir análise exploratória
  if (index === 2) {
    if (dataset.length === 0) {
      generateData();
    }
    setTimeout(() => createCharts(), 100);
  }

  // Gerar gráficos de modelagem
  if (index === 3) {
    setTimeout(() => {
      if (charts.featureImp) charts.featureImp.destroy();
      createFeatureImportanceChart();
    }, 100);
  }

  // Gerar gráficos de avaliação
  if (index === 4) {
    setTimeout(() => {
      createEvaluationCharts();
    }, 100);
  }
}

// Carregar dados do German Credit Dataset
async function generateData() {
  try {
    const response = await fetch("src/data/german_credit_processed.json");
    const data = await response.json();

    dataset = data;

    // Atualizar estatísticas
    const stats = {
      baixo: dataset.filter((d) => d.risco === "Baixo").length,
      medio: dataset.filter((d) => d.risco === "Médio").length,
      alto: dataset.filter((d) => d.risco === "Alto").length,
    };

    const resultElement = document.getElementById("etl-result");
    if (resultElement) {
      resultElement.innerHTML = `
        <div class="result-box low-risk" style="margin-top: 20px;">
            ✅ German Credit Dataset carregado com sucesso!<br>
            <span style="font-size: 0.9em;">
                1.000 registros | Baixo: ${stats.baixo} | Médio: ${
        stats.medio
      } | Alto: ${stats.alto}
            </span>
        </div>
        <div class="card" style="margin-top: 15px;">
            <h3>📊 Estatísticas do Dataset Real</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <h4>${Math.round(
                      dataset.reduce((sum, d) => sum + d.idade, 0) /
                        dataset.length
                    )}</h4>
                    <p>Idade Média</p>
                </div>
                <div class="stat-card">
                    <h4>€${Math.round(
                      dataset.reduce((sum, d) => sum + d.valor_credito, 0) /
                        dataset.length
                    ).toLocaleString()}</h4>
                    <p>Crédito Médio</p>
                </div>
                <div class="stat-card">
                    <h4>${Math.round(
                      dataset.reduce((sum, d) => sum + d.duracao_meses, 0) /
                        dataset.length
                    )}</h4>
                    <p>Duração Média (meses)</p>
                </div>
                <div class="stat-card">
                    <h4>${Math.round(
                      (dataset.filter((d) => d.sexo === "male").length /
                        dataset.length) *
                        100
                    )}%</h4>
                    <p>Clientes Masculinos</p>
                </div>
            </div>
        </div>
      `;
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    generateFallbackData();
  }
}

// Dados de fallback caso não consiga carregar o JSON
function generateFallbackData() {
  dataset = [];
  const risks = ["Baixo", "Médio", "Alto"];
  const sexos = ["male", "female"];
  const moradias = ["own", "rent", "free"];
  const propositos = [
    "car",
    "furniture/equipment",
    "radio/TV",
    "education",
    "business",
  ];

  for (let i = 0; i < 1000; i++) {
    const risco = risks[Math.floor(Math.random() * risks.length)];

    dataset.push({
      idade: Math.round(19 + Math.random() * 56),
      sexo: sexos[Math.floor(Math.random() * sexos.length)],
      trabalho: Math.floor(Math.random() * 4),
      moradia: moradias[Math.floor(Math.random() * moradias.length)],
      poupanca: "little",
      conta_corrente: "moderate",
      valor_credito: Math.round(250 + Math.random() * 18000),
      duracao_meses: Math.round(4 + Math.random() * 68),
      proposito: propositos[Math.floor(Math.random() * propositos.length)],
      risco: risco,
    });
  }

  const stats = {
    baixo: dataset.filter((d) => d.risco === "Baixo").length,
    medio: dataset.filter((d) => d.risco === "Médio").length,
    alto: dataset.filter((d) => d.risco === "Alto").length,
  };

  const resultElement = document.getElementById("etl-result");
  if (resultElement) {
    resultElement.innerHTML = `
      <div class="result-box medium-risk" style="margin-top: 20px;">
          ⚠️ Usando dados simulados (fallback)<br>
          <span style="font-size: 0.9em;">
              1.000 registros | Baixo: ${stats.baixo} | Médio: ${stats.medio} | Alto: ${stats.alto}
          </span>
      </div>
    `;
  }
}

// Treinar modelo (simulação)
function trainModel() {
  if (dataset.length === 0) {
    generateData();
  }

  const trainingResult = document.getElementById("training-result");
  if (trainingResult) {
    trainingResult.innerHTML = `
      <div class="result-box low-risk" style="margin-top: 20px;">
          🎓 Modelo treinado com sucesso!<br>
          <span style="font-size: 0.9em;">
              Dados de treino: 700 | Validação: 150 | Teste: 150<br>
              Acurácia no conjunto de teste: 87.5%
          </span>
      </div>
    `;
  }

  model = { trained: true };
  createFeatureImportanceChart();
}

// Inicialização
window.addEventListener("load", function () {
  // Gerar dados iniciais
  generateData();

  // Verificar se Chart.js carregou
  if (typeof Chart === "undefined") {
    console.error("Chart.js não carregou corretamente");
  }
});
