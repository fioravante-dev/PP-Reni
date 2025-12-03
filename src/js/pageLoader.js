// Carregador dinâmico de páginas
async function loadPage(pageName) {
  const container = document.getElementById("page-container");

  if (!container) {
    console.error("Container 'page-container' não encontrado");
    return;
  }

  try {
    const response = await fetch(`src/pages/${pageName}.html`);

    if (!response.ok) {
      throw new Error(`Erro ao carregar página: ${response.status}`);
    }

    const html = await response.text();
    container.innerHTML = html;

    // Re-aplicar event listeners após carregar novo conteúdo
    if (pageName === "predicao" && typeof setupPredictionForm === "function") {
      setTimeout(() => setupPredictionForm(), 100);
    }
  } catch (error) {
    console.error(`Erro ao carregar ${pageName}:`, error);
    container.innerHTML = `
      <div class="card" style="background: #f8d7da; border-left: 4px solid #dc3545;">
        <h3>❌ Erro ao Carregar Página</h3>
        <p>Não foi possível carregar a página "${pageName}". Verifique se o arquivo existe.</p>
      </div>
    `;
  }
}

// Carregar página inicial ao carregar o documento
document.addEventListener("DOMContentLoaded", async () => {
  await loadPage("descricao");

  // Tentar carregar modelo salvo
  if (typeof loadSavedModel === "function") {
    loadSavedModel();
  }
});
