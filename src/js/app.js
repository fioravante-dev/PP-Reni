// Dados globais
// Usar uma variável interna para armazenar os dados
let _dataset = [];
let model = null;
let charts = {};

// Expor dataset globalmente com getter/setter para compatibilidade
Object.defineProperty(window, "dataset", {
  get: function () {
    return _dataset;
  },
  set: function (val) {
    _dataset = val;
  },
  configurable: true,
});

// Garantir que referências locais a 'dataset' usem a variável global
// (Isso é um hack para evitar refatorar todo o arquivo onde 'dataset' é usado)
let dataset = _dataset;
// Nota: Como 'dataset' era uma variável let, ela não atualiza automaticamente se _dataset mudar via window.
// A melhor abordagem é remover 'let dataset' e deixar o escopo global resolver,
// mas para garantir, vamos atualizar as funções que usam dataset.

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
    if (window.dataset.length === 0) {
      await window.generateData();
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

  // Gerar gráficos de avaliação e treinar modelo se necessário
  if (index === 4) {
    setTimeout(async () => {
      // createEvaluationCharts();

      // Verificar se modelo já existe
      if (
        typeof loadSavedModel === "function" &&
        typeof trainModel === "function"
      ) {
        const modelExists = await loadSavedModel();
        let metricsLoaded = false;

        if (modelExists && typeof loadSavedMetrics === "function") {
          metricsLoaded = loadSavedMetrics();
        }

        if (!modelExists || !metricsLoaded) {
          // Se não tem modelo ou métricas, treinar automaticamente
          console.log(
            "Modelo ou métricas não encontrados, treinando automaticamente..."
          );

          // Limpar métricas antigas se existirem mas estiverem inválidas
          localStorage.removeItem("model-metrics");

          // Carregar dados se necessário
          if (window.dataset.length === 0) {
            console.log("Carregando dataset para treinamento...");
            await window.generateData();
          }

          if (window.dataset.length > 0) {
            // Treinar modelo
            await trainModel();
          } else {
            console.error("Falha ao carregar dataset. Não é possível treinar.");
          }
        }
      }
    }, 500); // Aumentado timeout para garantir carregamento do DOM
  }

  // Atualizar acurácia na página de conclusão
  if (index === 6) {
    setTimeout(() => {
      const metricsJson = localStorage.getItem("model-metrics");
      if (metricsJson) {
        try {
          const metrics = JSON.parse(metricsJson);
          const accEl = document.getElementById("final-accuracy");
          if (accEl && metrics.accuracy) {
            accEl.textContent = `${(metrics.accuracy * 100).toFixed(1)}%`;
            accEl.style.fontWeight = "bold";
            accEl.style.color = "#28a745";
          }
        } catch (e) {
          console.error("Erro ao ler métricas para conclusão:", e);
        }
      }
    }, 100);
  }
}

// Carregar dados do German Credit Dataset
window.generateData = async function () {
  console.log("generateData: Iniciando carregamento...");
  try {
    const response = await fetch("src/data/german_credit_processed.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("generateData: Dados carregados, registros:", data.length);

    // Atualizar via window para disparar o setter (se houvesse lógica lá)
    window.dataset = data;
    // Atualizar referência local se necessário (embora devêssemos usar window.dataset diretamente)
    _dataset = data;
    // Atualizar referência local 'dataset' também para compatibilidade
    dataset = data;

    // Atualizar estatísticas
    const stats = {
      baixo: window.dataset.filter((d) => d.risco === "Baixo").length,
      medio: window.dataset.filter((d) => d.risco === "Médio").length,
      alto: window.dataset.filter((d) => d.risco === "Alto").length,
    };

    const resultElement = document.getElementById("etl-result");
    if (resultElement) {
      resultElement.innerHTML = `
        <div class="result-box low-risk" style="margin-top: 20px;">
            ✅ German Credit Dataset carregado com sucesso!<br>
            <span style="font-size: 0.9em;">
                1.000 registros | Baixo: ${stats.baixo} | Médio: ${stats.medio} | Alto: ${stats.alto}
            </span>
        </div>
      `;
    }
    return true;
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    const resultElement = document.getElementById("etl-result");
    if (resultElement) {
      resultElement.innerHTML = `<div class="result-box high-risk">❌ Erro ao carregar dados: ${error.message}</div>`;
    }
    return false;
  }
};

// Inicialização
window.addEventListener("load", function () {
  // Gerar dados iniciais
  if (typeof window.generateData === "function") {
    window.generateData();
  }

  // Verificar se Chart.js carregou
  if (typeof Chart === "undefined") {
    console.error("Chart.js não carregou corretamente");
  }
});
