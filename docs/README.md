# 🏦 Sistema de Detecção de Risco de Crédito

Projeto Prático - Análise de Dados e Machine Learning utilizando o German Credit Dataset.

## 📁 Estrutura do Projeto

```
PP-Reni/
├── index.html                          # Página principal
├── credit_risk_detector.html           # Versão monolítica original
├── german_credit_data.csv              # Dataset original do Kaggle
├── process_german_data.py              # Script de processamento ETL
│
├── src/                                # Código fonte modular
│   ├── css/
│   │   └── styles.css                  # Estilos globais da aplicação
│   │
│   ├── js/
│   │   ├── app.js                      # Lógica principal e gerenciamento de dados
│   │   ├── charts.js                   # Criação e gerenciamento de gráficos
│   │   ├── prediction.js               # Algoritmo de predição de risco
│   │   └── pages.js                    # Conteúdo das páginas/seções
│   │
│   └── data/
│       └── german_credit_processed.json # Dados processados em JSON
│
└── README.md                           # Este arquivo
```

## 🎯 Arquitetura em Camadas

### **Camada de Apresentação (View)**
- **index.html**: Interface principal com estrutura de abas
- **styles.css**: Estilos visuais e responsivos
- **pages.js**: Conteúdo HTML de cada seção

### **Camada de Lógica (Controller)**
- **app.js**: 
  - Gerenciamento de estado global
  - Navegação entre seções
  - Carregamento de dados
  
- **charts.js**:
  - Criação de gráficos com Chart.js
  - Visualizações de análise exploratória
  - Gráficos de avaliação do modelo

- **prediction.js**:
  - Algoritmo de classificação de risco
  - Processamento de formulários
  - Cálculo de pontuações

### **Camada de Dados (Model)**
- **german_credit_processed.json**: Dados processados prontos para uso
- **german_credit_data.csv**: Dataset original do Kaggle
- **process_german_data.py**: Script ETL para processamento

## 🚀 Como Usar

### **Opção 1: Versão Modular (Recomendada)**
```bash
# Abra o arquivo index.html em um navegador
# Requer um servidor web local para carregar os módulos JavaScript
```

Para rodar localmente:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# VS Code
# Use a extensão Live Server
```

Acesse: `http://localhost:8000`

### **Opção 2: Versão Monolítica**
```bash
# Abra diretamente o arquivo credit_risk_detector.html
# Funciona sem servidor web
```

## 📊 Processamento de Dados

Para reprocessar os dados do German Credit Dataset:

```bash
python process_german_data.py
```

Este script irá:
1. Ler o arquivo `german_credit_data.csv`
2. Aplicar transformações e calcular o risco
3. Gerar `src/data/german_credit_processed.json`

## 🔗 Fonte dos Dados

**German Credit Dataset**  
Kaggle: https://www.kaggle.com/datasets/uciml/german-credit

- 1.000 registros de clientes alemães
- 10 variáveis (9 features + 1 target)
- Dados reais de solicitações de crédito

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos e animações
- **JavaScript (ES6+)**: Lógica e interatividade
- **Chart.js**: Visualizações de dados
- **Python**: Processamento ETL
- **JSON**: Armazenamento de dados

## 📈 Funcionalidades

### **1. ETL**
- Carregamento automático do dataset
- Estatísticas descritivas
- Pipeline visual do processo

### **2. Análise Exploratória**
- Distribuição de risco
- Valor médio de crédito por categoria
- Duração média de empréstimos
- Importância das variáveis

### **3. Modelagem**
- Algoritmo de classificação baseado em pontuação
- Feature importance
- Métricas de treinamento

### **4. Avaliação**
- Matriz de confusão
- Curva ROC
- Métricas de performance

### **5. Predição Interativa**
- Formulário para novos clientes
- Classificação em tempo real
- Análise detalhada com fatores de risco
- Recomendações personalizadas

## 👥 Equipe

Projeto desenvolvido como trabalho prático demonstrando competências em:
- Análise e manipulação de dados
- Visualização de informações
- Machine Learning
- Desenvolvimento web

## 📝 Licença

Este projeto é para fins educacionais.

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas!
