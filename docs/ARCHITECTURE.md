# 📐 Arquitetura do Projeto - Sistema de Detecção de Risco de Crédito

## 🏗️ Visão Geral da Arquitetura

Este projeto segue uma arquitetura em camadas (Layered Architecture) com separação clara de responsabilidades, facilitando manutenção, escalabilidade e testes.

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  (Interface do Usuário - HTML/CSS)                          │
│                                                              │
│  • index.html - Estrutura principal                         │
│  • styles.css - Estilos visuais                             │
│  • pages.js - Conteúdo das seções                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  (Lógica de Negócio - JavaScript)                           │
│                                                              │
│  • app.js - Gerenciamento de estado e navegação            │
│  • charts.js - Visualizações e gráficos                     │
│  • prediction.js - Algoritmo de classificação               │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                      DATA LAYER                              │
│  (Armazenamento e Acesso a Dados)                           │
│                                                              │
│  • german_credit_processed.json - Dados processados         │
│  • german_credit_data.csv - Dataset original                │
│  • process_german_data.py - Pipeline ETL                    │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Fluxo de Dados

```
[CSV Original] 
    ↓
[Python ETL Script]
    ↓
[JSON Processado] 
    ↓
[JavaScript Fetch API]
    ↓
[Dataset Global em Memória]
    ↓
┌───────────────────┬───────────────────┬────────────────┐
│  Análise          │  Visualização     │   Predição     │
│  Exploratória     │  (Charts.js)      │   (Algoritmo)  │
└───────────────────┴───────────────────┴────────────────┘
```

## 🔧 Componentes Detalhados

### **1. Camada de Apresentação (View Layer)**

#### **index.html**
- **Responsabilidade**: Estrutura HTML principal
- **Componentes**:
  - Header com título e subtítulo
  - Sistema de tabs/abas para navegação
  - Container para conteúdo dinâmico
  - Imports de CSS e JavaScript

#### **styles.css**
- **Responsabilidade**: Estilização visual
- **Características**:
  - Design responsivo (mobile-first)
  - Temas de cores consistentes
  - Animações e transições
  - Componentes reutilizáveis (cards, botões, tabelas)

#### **pages.js**
- **Responsabilidade**: Conteúdo HTML das seções
- **Estrutura**:
  ```javascript
  const pages = {
    descricao: "HTML...",
    etl: "HTML...",
    analise: "HTML...",
    // ...
  }
  ```

### **2. Camada de Aplicação (Business Logic Layer)**

#### **app.js** - Controlador Principal
```javascript
// Variáveis Globais
let dataset = [];      // Dados carregados
let model = null;      // Modelo treinado
let charts = {};       // Instâncias de gráficos

// Funções Principais
- showSection(index)      // Navegação entre seções
- generateData()          // Carregamento de dados
- generateFallbackData()  // Dados de backup
- trainModel()            // Treinamento simulado
```

**Responsabilidades**:
- ✅ Gerenciamento de estado global
- ✅ Carregamento assíncrono de dados
- ✅ Navegação entre seções
- ✅ Inicialização da aplicação
- ✅ Tratamento de erros

#### **charts.js** - Módulo de Visualização
```javascript
// Funções de Gráficos
- createCharts()                    // Análise Exploratória
- createFeatureImportanceChart()    // Importância de Features
- createEvaluationCharts()          // Métricas de Avaliação
```

**Responsabilidades**:
- 📊 Criação de gráficos com Chart.js
- 📊 Destruição e recriação para evitar memory leaks
- 📊 Configuração de opções visuais
- 📊 Formatação de dados para visualização

#### **prediction.js** - Módulo de Predição
```javascript
// Event Listener do Formulário
document.getElementById("predictionForm")
  .addEventListener("submit", function(e) {
    // 1. Captura de dados do formulário
    // 2. Cálculo de pontuação baseado em regras
    // 3. Classificação de risco
    // 4. Geração de fatores e recomendações
    // 5. Renderização do resultado
  });
```

**Responsabilidades**:
- 🎯 Validação de entradas
- 🎯 Algoritmo de scoring
- 🎯 Classificação de risco (Baixo/Médio/Alto)
- 🎯 Geração de insights e recomendações

### **3. Camada de Dados (Data Layer)**

#### **german_credit_processed.json**
```json
[
  {
    "idade": 35,
    "sexo": "male",
    "trabalho": 2,
    "moradia": "own",
    "poupanca": "moderate",
    "conta_corrente": "little",
    "valor_credito": 3000,
    "duracao_meses": 24,
    "proposito": "car",
    "risco": "Baixo"
  },
  // ... 999 registros
]
```

#### **process_german_data.py** - Pipeline ETL
```python
# 1. Extract
df = pd.read_csv('german_credit_data.csv')

# 2. Transform
- calculate_risk(row)      # Cálculo de risco
- Renomear colunas         # EN -> PT
- Tratar valores NaN       # Preenchimento

# 3. Load
- to_json()                # Conversão para JSON
- save to file             # Persistência
```

## 🔄 Padrões de Design Utilizados

### **1. Module Pattern**
Cada arquivo JavaScript é um módulo independente com responsabilidade única.

### **2. Observer Pattern**
Event listeners para interação do usuário (formulários, cliques).

### **3. Singleton Pattern**
Variáveis globais (`dataset`, `model`, `charts`) mantêm estado único.

### **4. Factory Pattern**
Funções de criação de gráficos seguem padrão similar.

## 🚀 Fluxo de Execução

### **Inicialização da Aplicação**
```
1. Browser carrega index.html
   ↓
2. CSS é aplicado (styles.css)
   ↓
3. Scripts JavaScript são carregados em ordem:
   - app.js (primeiro)
   - charts.js
   - prediction.js
   - pages.js (último)
   ↓
4. window.addEventListener("load") é disparado
   ↓
5. generateData() carrega o JSON
   ↓
6. Conteúdo inicial é renderizado
```

### **Navegação Entre Seções**
```
Usuário clica em tab
   ↓
showSection(index) é chamado
   ↓
Remove classe "active" de todas as seções
   ↓
Adiciona classe "active" à seção selecionada
   ↓
Se necessário, carrega dados ou cria gráficos
```

### **Predição de Risco**
```
Usuário preenche formulário
   ↓
Submit do formulário
   ↓
preventDefault() para evitar reload
   ↓
Captura valores dos campos
   ↓
Executa algoritmo de scoring
   ↓
Classifica risco (Baixo/Médio/Alto)
   ↓
Gera fatores e recomendações
   ↓
Renderiza resultado na tela
```

## 📈 Escalabilidade e Manutenção

### **Vantagens da Arquitetura Atual**

✅ **Separação de Responsabilidades**: Cada arquivo tem função clara  
✅ **Fácil Manutenção**: Mudanças isoladas não afetam outros módulos  
✅ **Reutilização**: Componentes CSS e funções JS são reutilizáveis  
✅ **Testabilidade**: Funções independentes facilitam testes  
✅ **Performance**: Carregamento assíncrono de dados  

### **Possíveis Melhorias Futuras**

🔮 **Backend API**: Substituir JSON estático por API REST  
🔮 **Framework Frontend**: Migrar para React/Vue/Angular  
🔮 **State Management**: Implementar Redux/Vuex  
🔮 **TypeScript**: Adicionar tipagem estática  
🔮 **Build System**: Webpack/Vite para bundling  
🔮 **Testing**: Jest/Mocha para testes unitários  
🔮 **CI/CD**: Pipeline automatizado de deploy  

## 🔐 Segurança

### **Considerações Atuais**

⚠️ **Frontend Only**: Dados e lógica expostos no cliente  
⚠️ **Sem Autenticação**: Acesso público irrestrito  
⚠️ **Validação Client-Side**: Pode ser burlada  

### **Recomendações para Produção**

🔒 Implementar backend com autenticação  
🔒 Validação server-side de dados  
🔒 HTTPS obrigatório  
🔒 Rate limiting para APIs  
🔒 Sanitização de inputs  
🔒 CSP (Content Security Policy)  

## 📚 Tecnologias e Bibliotecas

| Camada | Tecnologia | Versão | Propósito |
|--------|-----------|--------|-----------|
| **Presentation** | HTML5 | - | Estrutura |
| | CSS3 | - | Estilos |
| **Application** | JavaScript | ES6+ | Lógica |
| | Chart.js | 3.9.1 | Gráficos |
| **Data** | JSON | - | Armazenamento |
| | Python | 3.x | ETL |
| | Pandas | - | Manipulação de dados |

## 🎓 Conclusão

Esta arquitetura fornece uma base sólida para um projeto educacional, demonstrando boas práticas de desenvolvimento web moderno com separação clara de responsabilidades e código modular e manutenível.
