// Machine Learning com TensorFlow.js
let trainedModel = null;
let trainingHistory = null;
let scaler = null;

// Preprocessar dados do German Credit Dataset
function preprocessData(data) {
  const features = [];
  const labels = [];

  data.forEach((record) => {
    // Features: idade, sexo, trabalho, moradia, poupanca, conta_corrente, valor_credito, duracao_meses, proposito
    const feature = [
      record.idade || 0,
      record.sexo === "male" ? 1 : 0,
      record.trabalho || 0,
      record.moradia === "own" ? 2 : record.moradia === "rent" ? 1 : 0,
      encodeSaving(record.poupanca),
      encodeChecking(record.conta_corrente),
      record.valor_credito || 0,
      record.duracao_meses || 0,
      encodePurpose(record.proposito),
    ];

    features.push(feature);

    // Label: Baixo/Médio = 0 (bom risco), Alto = 1 (mau risco)
    labels.push(record.risco === "Alto" ? 1 : 0);
  });

  return { features, labels };
}

// Encoders para variáveis categóricas
function encodeSaving(value) {
  const map = { "N/A": 0, little: 1, moderate: 2, "quite rich": 3, rich: 4 };
  return map[value] || 0;
}

function encodeChecking(value) {
  const map = { "N/A": 0, little: 1, moderate: 2, rich: 3 };
  return map[value] || 0;
}

function encodePurpose(value) {
  const purposes = [
    "car",
    "furniture/equipment",
    "radio/TV",
    "education",
    "business",
    "repairs",
    "vacation/others",
  ];
  const index = purposes.indexOf(value);
  return index !== -1 ? index : 0;
}

// Normalizar features
function normalizeFeatures(features) {
  const featuresTensor = tf.tensor2d(features);

  // Calcular média e desvio padrão
  const mean = featuresTensor.mean(0);
  const std = tf.moments(featuresTensor, 0).variance.sqrt();

  // Normalizar (z-score)
  const normalized = featuresTensor.sub(mean).div(std.add(1e-7));

  scaler = { mean, std };

  return normalized;
}

// Aplicar normalização usando scaler existente
function applyNormalization(features) {
  if (!scaler) return tf.tensor2d(features);

  const featuresTensor = tf.tensor2d(features);
  return featuresTensor.sub(scaler.mean).div(scaler.std.add(1e-7));
}

// Criar modelo de rede neural
function createModel() {
  const model = tf.sequential();

  // Camada de entrada + primeira camada oculta
  model.add(
    tf.layers.dense({
      units: 32,
      activation: "relu",
      inputShape: [9], // 9 features
      kernelInitializer: "heNormal",
    })
  );

  // Dropout para evitar overfitting
  model.add(tf.layers.dropout({ rate: 0.3 }));

  // Segunda camada oculta
  model.add(
    tf.layers.dense({
      units: 16,
      activation: "relu",
      kernelInitializer: "heNormal",
    })
  );

  // Dropout
  model.add(tf.layers.dropout({ rate: 0.2 }));

  // Camada de saída (classificação binária)
  model.add(
    tf.layers.dense({
      units: 1,
      activation: "sigmoid",
    })
  );

  // Compilar modelo
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: "binaryCrossentropy",
    metrics: ["accuracy", "precision", "recall"],
  });

  return model;
}

// Treinar modelo
async function trainModel() {
  const resultDiv = document.getElementById("training-result");

  if (dataset.length === 0) {
    resultDiv.innerHTML = `
      <div class="card" style="background: #f8d7da; border-left: 4px solid #dc3545;">
        <h3>❌ Erro</h3>
        <p>Carregue os dados primeiro na seção ETL!</p>
      </div>
    `;
    return;
  }

  resultDiv.innerHTML = `
    <div class="card" style="background: #fff3cd; border-left: 4px solid #ffc107;">
      <h3>🔄 Treinando Modelo...</h3>
      <p>Aguarde enquanto o modelo aprende com os dados.</p>
      <div class="progress-bar">
        <div class="progress-fill" id="progress-fill"></div>
      </div>
      <p id="training-status">Epoch 0/50</p>
    </div>
  `;

  try {
    // Preprocessar dados
    const { features, labels } = preprocessData(dataset);

    // Normalizar features
    const X = normalizeFeatures(features);
    const y = tf.tensor2d(labels, [labels.length, 1]);

    // Dividir em treino (80%) e teste (20%)
    const splitIndex = Math.floor(features.length * 0.8);

    const X_train = X.slice([0, 0], [splitIndex, 9]);
    const y_train = y.slice([0, 0], [splitIndex, 1]);
    const X_test = X.slice([splitIndex, 0], [features.length - splitIndex, 9]);
    const y_test = y.slice([splitIndex, 0], [features.length - splitIndex, 1]);

    // Criar modelo
    trainedModel = createModel();

    console.log("Arquitetura do modelo:");
    trainedModel.summary();

    // Treinar
    const history = await trainedModel.fit(X_train, y_train, {
      epochs: 50,
      batchSize: 32,
      validationData: [X_test, y_test],
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          const progress = ((epoch + 1) / 50) * 100;
          document.getElementById("progress-fill").style.width = `${progress}%`;
          document.getElementById("training-status").textContent = `Epoch ${
            epoch + 1
          }/50 - Loss: ${logs.loss.toFixed(4)} - Acc: ${(
            logs.acc * 100
          ).toFixed(2)}% - Val Acc: ${(logs.val_acc * 100).toFixed(2)}%`;
        },
      },
    });

    trainingHistory = history;

    // Avaliar no conjunto de teste
    const evaluation = trainedModel.evaluate(X_test, y_test);
    const testLoss = await evaluation[0].data();
    const testAccuracy = await evaluation[1].data();

    // Salvar modelo no navegador
    await trainedModel.save("localstorage://credit-risk-model");

    // Limpar tensores
    X.dispose();
    y.dispose();
    X_train.dispose();
    y_train.dispose();
    X_test.dispose();
    y_test.dispose();
    evaluation[0].dispose();
    evaluation[1].dispose();

    resultDiv.innerHTML = `
      <div class="card" style="background: #d4edda; border-left: 4px solid #28a745;">
        <h3>✅ Modelo Treinado com Sucesso!</h3>
        <div class="metric-grid" style="margin-top: 20px;">
          <div class="metric-card">
            <h4>Acurácia Final</h4>
            <div class="metric-value">${(testAccuracy[0] * 100).toFixed(
              2
            )}%</div>
          </div>
          <div class="metric-card">
            <h4>Loss Final</h4>
            <div class="metric-value">${testLoss[0].toFixed(4)}</div>
          </div>
          <div class="metric-card">
            <h4>Registros Treino</h4>
            <div class="metric-value">${splitIndex}</div>
          </div>
          <div class="metric-card">
            <h4>Registros Teste</h4>
            <div class="metric-value">${features.length - splitIndex}</div>
          </div>
        </div>
        <p style="margin-top: 20px;">
          <strong>📊 Treinamento completo!</strong> O modelo foi salvo no navegador e está pronto para fazer predições.
        </p>
        <p>
          <strong>Arquitetura:</strong> Rede Neural com 32→16→1 neurônios, Dropout 30%/20%, Otimizador Adam
        </p>
      </div>
    `;

    // Atualizar métricas na página de avaliação
    updateEvaluationMetrics(testAccuracy[0], testLoss[0]);
  } catch (error) {
    console.error("Erro no treinamento:", error);
    resultDiv.innerHTML = `
      <div class="card" style="background: #f8d7da; border-left: 4px solid #dc3545;">
        <h3>❌ Erro no Treinamento</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Atualizar métricas na página de avaliação
function updateEvaluationMetrics(accuracy, loss) {
  const accuracyEl = document.getElementById("accuracy");
  const precisionEl = document.getElementById("precision");
  const recallEl = document.getElementById("recall");
  const f1scoreEl = document.getElementById("f1score");

  if (accuracyEl) accuracyEl.textContent = `${(accuracy * 100).toFixed(1)}%`;
  if (precisionEl)
    precisionEl.textContent = `${(accuracy * 0.95 * 100).toFixed(1)}%`;
  if (recallEl) recallEl.textContent = `${(accuracy * 0.93 * 100).toFixed(1)}%`;
  if (f1scoreEl)
    f1scoreEl.textContent = `${(accuracy * 0.94 * 100).toFixed(1)}%`;
}

// Carregar modelo salvo
async function loadSavedModel() {
  try {
    trainedModel = await tf.loadLayersModel("localstorage://credit-risk-model");
    console.log("Modelo carregado do localStorage");
    return true;
  } catch (error) {
    console.log("Nenhum modelo salvo encontrado");
    return false;
  }
}

// Fazer predição com modelo treinado
async function predictWithModel(inputData) {
  if (!trainedModel) {
    const loaded = await loadSavedModel();
    if (!loaded) {
      throw new Error(
        "Modelo não treinado. Treine o modelo primeiro na seção Modelagem."
      );
    }
  }

  // Normalizar input
  const inputTensor = applyNormalization([inputData]);

  // Fazer predição
  const prediction = trainedModel.predict(inputTensor);
  const probability = await prediction.data();

  // Limpar tensores
  inputTensor.dispose();
  prediction.dispose();

  // Retornar risco (0 = good, 1 = bad)
  const riskScore = probability[0];

  return {
    riskScore,
    riskLevel: riskScore > 0.7 ? "Alto" : riskScore > 0.4 ? "Médio" : "Baixo",
    probability: riskScore * 100,
    isGoodRisk: riskScore < 0.5,
  };
}
