import pandas as pd
import json
import os

# Definir caminhos relativos
script_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(os.path.dirname(script_dir), 'data')
input_file = os.path.join(data_dir, 'german_credit_data.csv')
output_file = os.path.join(data_dir, 'german_credit_processed.json')

# Carregar dados
df = pd.read_csv(input_file)

# Adicionar coluna de risco (simulada baseada em padrões)
def calculate_risk(row):
    score = 0
    
    # Idade (jovens e muito idosos = mais risco)
    if row['Age'] < 25 or row['Age'] > 60:
        score += 1
    
    # Trabalho (0 = desempregado, maior risco)
    if row['Job'] == 0:
        score += 2
    elif row['Job'] == 1:
        score += 1
    
    # Moradia (rent = maior risco)
    if row['Housing'] == 'rent':
        score += 1
    
    # Conta poupança (NA ou little = maior risco)
    if pd.isna(row['Saving accounts']) or row['Saving accounts'] == 'little':
        score += 1
    
    # Conta corrente (NA ou little = maior risco)  
    if pd.isna(row['Checking account']) or row['Checking account'] == 'little':
        score += 1
    
    # Valor alto do crédito
    if row['Credit amount'] > 7000:
        score += 1
    
    # Duração longa
    if row['Duration'] > 36:
        score += 1
    
    # Classificar risco
    if score >= 5:
        return 'Alto'
    elif score >= 3:
        return 'Médio'
    else:
        return 'Baixo'

df['Risk'] = df.apply(calculate_risk, axis=1)

# Renomear colunas para português
df_pt = df.rename(columns={
    'Age': 'idade',
    'Sex': 'sexo',
    'Job': 'trabalho', 
    'Housing': 'moradia',
    'Saving accounts': 'poupanca',
    'Checking account': 'conta_corrente',
    'Credit amount': 'valor_credito',
    'Duration': 'duracao_meses',
    'Purpose': 'proposito',
    'Risk': 'risco'
})

# Tratar valores NaN
df_pt = df_pt.fillna('N/A')

# Converter para JSON
data_json = df_pt.to_json(orient='records', force_ascii=False)

# Salvar
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(data_json)

print(f"Arquivo salvo em: {output_file}")

print(f"Dados processados: {len(df_pt)} registros")
print(f"Distribuição de risco:")
print(df_pt['risco'].value_counts())
print(f"Colunas: {list(df_pt.columns)}")