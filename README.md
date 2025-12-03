# 🏦 Sistema de Detecção de Risco de Crédito

Projeto Prático - Análise de Dados e Machine Learning utilizando o German Credit Dataset.

## 📁 Estrutura do Projeto

```
PP-Reni/
├── index.html                    # Página principal da aplicação
├── .gitignore                    # Arquivos ignorados pelo Git
│
├── docs/                         # 📚 Documentação
│   ├── README.md                 # Documentação detalhada
│   └── ARCHITECTURE.md           # Arquitetura técnica
│
├── src/                          # 💻 Código fonte
│   ├── css/
│   │   └── styles.css            # Estilos globais
│   │
│   ├── js/
│   │   ├── app.js                # Lógica principal
│   │   ├── charts.js             # Gráficos e visualizações
│   │   ├── prediction.js         # Algoritmo de predição
│   │   └── pages.js              # Conteúdo das páginas
│   │
│   ├── data/
│   │   ├── german_credit_data.csv         # Dataset original
│   │   └── german_credit_processed.json   # Dados processados
│   │
│   └── python/
│       └── process_german_data.py         # Script ETL
│
└── old_versions/                 # 📦 Versões anteriores
    ├── credit_risk_detector.html
    ├── credit_risk_detector_german.html
    └── german-credit.zip
```

## 🚀 Como Usar

### Rodar a Aplicação

A aplicação precisa ser servida por um servidor web devido ao carregamento de módulos JavaScript.

**Opção 1: Python**

```bash
python -m http.server 8000
```

**Opção 2: Node.js**

```bash
npx serve
```

**Opção 3: VS Code**

- Instale a extensão "Live Server"
- Clique com botão direito em `index.html`
- Selecione "Open with Live Server"

Acesse: `http://localhost:8000`

### Processar Dados

Para reprocessar o German Credit Dataset:

```bash
python src/python/process_german_data.py
```

📖 Para mais detalhes, consulte: [`docs/PROCESSING.md`](docs/PROCESSING.md)

## 📊 Fonte dos Dados

**German Credit Dataset**  
🔗 https://www.kaggle.com/datasets/uciml/german-credit

- 1.000 registros de clientes alemães
- 10 variáveis (9 features + 1 target)
- Dados reais de solicitações de crédito

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Visualização**: Chart.js 3.9.1
- **ETL**: Python, Pandas
- **Dados**: JSON, CSV

## 📖 Documentação

Para documentação completa, consulte:

- [`docs/README.md`](docs/README.md) - Guia completo do projeto
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) - Arquitetura técnica
- [`docs/PROCESSING.md`](docs/PROCESSING.md) - Como processar os dados

## ✨ Funcionalidades

### 1. ETL

- Carregamento automático do dataset
- Estatísticas descritivas
- Pipeline visual

### 2. Análise Exploratória

- Distribuição de risco
- Análise de variáveis
- Gráficos interativos

### 3. Modelagem

- Algoritmo de classificação
- Feature importance
- Métricas de treinamento

### 4. Avaliação

- Matriz de confusão
- Curva ROC
- Métricas de performance

### 5. Predição

- Formulário interativo
- Classificação em tempo real
- Recomendações personalizadas

## 📝 Licença

Projeto educacional - 2025

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas!
