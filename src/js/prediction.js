// Função para configurar formulário de predição
function setupPredictionForm() {
  const form = document.getElementById("predictionForm");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Obter valores do formulário (German Credit Dataset)
    const idade = parseInt(document.getElementById("idade").value);
    const sexo = document.getElementById("sexo").value;
    const trabalho = parseInt(document.getElementById("trabalho").value);
    const moradia = document.getElementById("moradia").value;
    const poupanca = document.getElementById("poupanca").value;
    const conta_corrente = document.getElementById("conta_corrente").value;
    const valor_credito = parseInt(
      document.getElementById("valor_credito").value
    );
    const duracao_meses = parseInt(
      document.getElementById("duracao_meses").value
    );
    const proposito = document.getElementById("proposito").value;

    // Tentar usar modelo treinado
    try {
      // Preparar input para o modelo
      const inputFeatures = [
        idade,
        sexo === "male" ? 1 : 0,
        trabalho,
        moradia === "own" ? 2 : moradia === "rent" ? 1 : 0,
        encodeSaving(poupanca),
        encodeChecking(conta_corrente),
        valor_credito,
        duracao_meses,
        encodePurpose(proposito),
      ];

      // Fazer predição com modelo treinado
      const result = await predictWithModel(inputFeatures);

      displayMLPrediction(result, {
        idade,
        sexo,
        trabalho,
        moradia,
        poupanca,
        conta_corrente,
        valor_credito,
        duracao_meses,
        proposito,
      });
    } catch (error) {
      console.warn(
        "Modelo não disponível, usando sistema de regras:",
        error.message
      );
      // Fallback para sistema de regras
      useFallbackPrediction({
        idade,
        sexo,
        trabalho,
        moradia,
        poupanca,
        conta_corrente,
        valor_credito,
        duracao_meses,
        proposito,
      });
    }
  });
}

// Exibir predição do modelo ML
function displayMLPrediction(result, data) {
  const {
    idade,
    sexo,
    trabalho,
    moradia,
    poupanca,
    conta_corrente,
    valor_credito,
    duracao_meses,
    proposito,
  } = data;
  const { riskLevel, probability, isGoodRisk } = result;

  const classe =
    riskLevel === "Baixo"
      ? "low-risk"
      : riskLevel === "Médio"
      ? "medium-risk"
      : "high-risk";
  const icon =
    riskLevel === "Baixo" ? "✅" : riskLevel === "Médio" ? "⚠️" : "❌";

  // Análise de fatores
  let fatores = [];
  if (idade < 25 || idade > 60) fatores.push("Idade fora da faixa ideal");
  if (trabalho === 0) fatores.push("Desempregado");
  if (moradia === "rent") fatores.push("Moradia alugada");
  if (poupanca === "N/A" || poupanca === "little")
    fatores.push("Poupança insuficiente");
  if (conta_corrente === "N/A" || conta_corrente === "little")
    fatores.push("Saldo conta corrente baixo");
  if (valor_credito > 7000) fatores.push("Valor do crédito alto");
  if (duracao_meses > 36) fatores.push("Prazo longo de pagamento");

  let positivos = [];
  if (idade >= 25 && idade <= 60) positivos.push("Idade na faixa ideal");
  if (trabalho === 3) positivos.push("Profissional altamente qualificado");
  if (moradia === "own") positivos.push("Moradia própria");
  if (poupanca === "rich" || poupanca === "quite rich")
    positivos.push("Boa reserva de poupança");
  if (conta_corrente === "rich" || conta_corrente === "moderate")
    positivos.push("Bom saldo em conta corrente");
  if (valor_credito < 3000) positivos.push("Valor de crédito moderado");
  if (duracao_meses <= 18) positivos.push("Prazo curto de pagamento");

  document.getElementById("predictionResult").innerHTML = `
    <div class="result-box ${classe}">
      <div style="font-size: 1.8em; margin-bottom: 10px;">
        ${icon} RISCO ${riskLevel.toUpperCase()}
      </div>
      <div style="font-size: 1.1em;">
        Probabilidade de Inadimplência: ${probability.toFixed(1)}%
      </div>
      <div style="font-size: 0.9em; margin-top: 10px; opacity: 0.9;">
        🤖 Predição feita com Rede Neural TensorFlow.js
      </div>
    </div>

    <div class="card" style="margin-top: 20px;">
      <h3>📊 Análise Detalhada</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 15px;">
        <div><strong>Idade:</strong> ${idade} anos</div>
        <div><strong>Sexo:</strong> ${
          sexo === "male" ? "Masculino" : "Feminino"
        }</div>
        <div><strong>Trabalho:</strong> Nível ${trabalho}</div>
        <div><strong>Moradia:</strong> ${moradia}</div>
        <div><strong>Valor Crédito:</strong> €${valor_credito.toLocaleString()}</div>
        <div><strong>Duração:</strong> ${duracao_meses} meses</div>
        <div><strong>Propósito:</strong> ${proposito}</div>
      </div>

      ${
        fatores.length > 0
          ? `
        <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
          <strong>⚠️ Fatores de Atenção:</strong>
          <ul style="margin-top: 10px; margin-bottom: 0;">
            ${fatores.map((f) => `<li>${f}</li>`).join("")}
          </ul>
        </div>
      `
          : ""
      }

      ${
        positivos.length > 0
          ? `
        <div style="margin-top: 15px; padding: 15px; background: #d4edda; border-radius: 8px;">
          <strong>✅ Pontos Positivos:</strong>
          <ul style="margin-top: 10px; margin-bottom: 0;">
            ${positivos.map((p) => `<li>${p}</li>`).join("")}
          </ul>
        </div>
      `
          : ""
      }

      <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <strong>💡 Recomendação:</strong>
        <p style="margin-top: 10px; margin-bottom: 0;">
          ${
            riskLevel === "Baixo"
              ? "Cliente apresenta perfil adequado para concessão de crédito. Recomenda-se aprovação com condições favoráveis."
              : riskLevel === "Médio"
              ? "Cliente apresenta risco moderado. Recomenda-se aprovação com garantias adicionais e acompanhamento mensal."
              : "Cliente apresenta alto risco de inadimplência. Recomenda-se recusa ou aprovação apenas com garantias robustas e limite reduzido."
          }
        </p>
      </div>
    </div>
  `;
}

// Sistema de regras (fallback)
function useFallbackPrediction(data) {
  const {
    idade,
    sexo,
    trabalho,
    moradia,
    poupanca,
    conta_corrente,
    valor_credito,
    duracao_meses,
    proposito,
  } = data;

  // Algoritmo baseado no German Credit Dataset
  let pontos = 0;

  // Idade (peso 15%)
  if (idade < 25 || idade > 60) {
    pontos += 3; // Maior risco
  } else {
    pontos += 15; // Menor risco
  }

  // Trabalho (peso 20%)
  if (trabalho === 0) {
    pontos += 2; // Desempregado = alto risco
  } else if (trabalho === 1) {
    pontos += 8; // Não qualificado
  } else if (trabalho === 2) {
    pontos += 15; // Qualificado
  } else {
    pontos += 20; // Altamente qualificado
  }

  // Moradia (peso 10%)
  if (moradia === "rent") {
    pontos += 3; // Alugada = maior risco
  } else if (moradia === "free") {
    pontos += 6; // Gratuita
  } else {
    pontos += 10; // Própria = menor risco
  }

  // Poupança (peso 15%)
  if (poupanca === "N/A" || poupanca === "little") {
    pontos += 3;
  } else if (poupanca === "moderate") {
    pontos += 8;
  } else if (poupanca === "quite rich") {
    pontos += 12;
  } else {
    pontos += 15; // rich
  }

  // Conta corrente (peso 15%)
  if (conta_corrente === "N/A" || conta_corrente === "little") {
    pontos += 3;
  } else if (conta_corrente === "moderate") {
    pontos += 10;
  } else {
    pontos += 15; // rich
  }

  // Valor do crédito (peso 15%)
  if (valor_credito > 7000) {
    pontos += 3; // Alto valor = maior risco
  } else if (valor_credito > 3000) {
    pontos += 8;
  } else {
    pontos += 15; // Baixo valor = menor risco
  }

  // Duração (peso 10%)
  if (duracao_meses > 36) {
    pontos += 2; // Longa duração = maior risco
  } else if (duracao_meses > 18) {
    pontos += 6;
  } else {
    pontos += 10; // Curta duração = menor risco
  }

  // Classificação final baseada no German Credit
  let risco, classe, probabilidade;
  const pontosPercentual = (pontos / 100) * 100;

  if (pontosPercentual >= 70) {
    risco = "Baixo";
    classe = "low-risk";
    probabilidade = Math.min(95, 70 + (pontosPercentual - 70) * 0.8);
  } else if (pontosPercentual >= 40) {
    risco = "Médio";
    classe = "medium-risk";
    probabilidade = 40 + (pontosPercentual - 40);
  } else {
    risco = "Alto";
    classe = "high-risk";
    probabilidade = Math.max(15, pontosPercentual * 1.5);
  }

  // Fatores de risco baseados no German Credit Dataset
  let fatores = [];
  if (idade < 25 || idade > 60) fatores.push("Idade fora da faixa ideal");
  if (trabalho === 0) fatores.push("Desempregado");
  if (moradia === "rent") fatores.push("Moradia alugada");
  if (poupanca === "N/A" || poupanca === "little")
    fatores.push("Poupança insuficiente");
  if (conta_corrente === "N/A" || conta_corrente === "little")
    fatores.push("Saldo conta corrente baixo");
  if (valor_credito > 7000) fatores.push("Valor do crédito alto");
  if (duracao_meses > 36) fatores.push("Prazo longo de pagamento");

  // Fatores positivos
  let positivos = [];
  if (idade >= 25 && idade <= 60) positivos.push("Idade na faixa ideal");
  if (trabalho === 3) positivos.push("Profissional altamente qualificado");
  if (moradia === "own") positivos.push("Moradia própria");
  if (poupanca === "rich" || poupanca === "quite rich")
    positivos.push("Boa reserva de poupança");
  if (conta_corrente === "rich" || conta_corrente === "moderate")
    positivos.push("Bom saldo em conta corrente");
  if (valor_credito < 3000) positivos.push("Valor de crédito moderado");
  if (duracao_meses <= 18) positivos.push("Prazo curto de pagamento");

  document.getElementById("predictionResult").innerHTML = `
            <div class="result-box ${classe}">
                <div style="font-size: 1.8em; margin-bottom: 10px;">
                    ${
                      risco === "Baixo" ? "✅" : risco === "Médio" ? "⚠️" : "❌"
                    } 
                    RISCO ${risco.toUpperCase()}
                </div>
                <div style="font-size: 1.1em;">
                    Confiança da Predição: ${probabilidade.toFixed(1)}%
                </div>
                <div style="font-size: 0.9em; margin-top: 10px; opacity: 0.9;">
                    Pontuação: ${pontos.toFixed(
                      1
                    )}/100 (${pontosPercentual.toFixed(1)}%)
                </div>
            </div>

            <div class="card" style="margin-top: 20px;">
                <h3>📊 Análise Detalhada</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 15px;">
                    <div>
                        <strong>Idade:</strong> ${idade} anos
                    </div>
                    <div>
                        <strong>Trabalho:</strong> Nível ${trabalho}
                    </div>
                    <div>
                        <strong>Moradia:</strong> ${moradia}
                    </div>
                    <div>
                        <strong>Valor Crédito:</strong> €${valor_credito.toLocaleString()}
                    </div>
                    <div>
                        <strong>Duração:</strong> ${duracao_meses} meses
                    </div>
                    <div>
                        <strong>Propósito:</strong> ${proposito}
                    </div>
                </div>

                ${
                  fatores.length > 0
                    ? `
                    <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
                        <strong>⚠️ Fatores de Atenção:</strong>
                        <ul style="margin-top: 10px; margin-bottom: 0;">
                            ${fatores.map((f) => `<li>${f}</li>`).join("")}
                        </ul>
                    </div>
                `
                    : ""
                }

                ${
                  positivos.length > 0
                    ? `
                    <div style="margin-top: 15px; padding: 15px; background: #d4edda; border-radius: 8px;">
                        <strong>✅ Pontos Positivos:</strong>
                        <ul style="margin-top: 10px; margin-bottom: 0;">
                            ${positivos.map((p) => `<li>${p}</li>`).join("")}
                        </ul>
                    </div>
                `
                    : ""
                }

                <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <strong>💡 Recomendação:</strong>
                    <p style="margin-top: 10px; margin-bottom: 0;">
                        ${
                          risco === "Baixo"
                            ? "Cliente apresenta perfil adequado para concessão de crédito. Recomenda-se aprovação com condições favoráveis."
                            : risco === "Médio"
                            ? "Cliente apresenta risco moderado. Recomenda-se aprovação com garantias adicionais e acompanhamento mensal."
                            : "Cliente apresenta alto risco de inadimplência. Recomenda-se recusa ou aprovação apenas com garantias robustas e limite reduzido."
                        }
                    </p>
                </div>
            </div>
        `;
}
