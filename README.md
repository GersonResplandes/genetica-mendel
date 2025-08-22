# 🧬 Calculadora de Genética Mendeliana

<div align="center">

<img src="assets/logo.svg" alt="Logo da Calculadora de Genética Mendeliana" width="120" height="120" style="background: white; border-radius: 20px; padding: 15px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);" />

![Genetics](https://img.shields.io/badge/Genetics-Mendelian-blue?style=for-the-badge&logo=dna)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-Standard-orange?style=for-the-badge&logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-Tailwind-blue?style=for-the-badge&logo=css3)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Uma ferramenta educacional interativa para análise de cruzamentos genéticos baseada nas Leis de Mendel**

[![Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=chrome)](https://your-demo-link.com)
[![Issues](https://img.shields.io/badge/Issues-Welcome-red?style=for-the-badge&logo=github)](https://github.com/your-username/calculadora-genetica-mendel/issues)
[![Stars](https://img.shields.io/badge/Stars-Welcome-yellow?style=for-the-badge&logo=github)](https://github.com/your-username/calculadora-genetica-mendel/stargazers)

</div>

---

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [🧬 Funcionalidades Científicas](#-funcionalidades-científicas)
- [⚡ Características Técnicas](#-características-técnicas)
- [🚀 Instalação e Uso](#-instalação-e-uso)
- [📊 Exemplos de Aplicação](#-exemplos-de-aplicação)
- [🔬 Fundamentos Científicos](#-fundamentos-científicos)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🎨 Interface e Design](#-interface-e-design)
- [📈 Roadmap](#-roadmap)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

---

## 🎯 Visão Geral

A **Calculadora de Genética Mendeliana** é uma ferramenta web interativa desenvolvida para facilitar o aprendizado e a aplicação prática dos princípios fundamentais da genética clássica. Baseada nas descobertas de Gregor Mendel, esta aplicação permite aos usuários realizar análises genéticas complexas de forma intuitiva e visual.

### 🎓 Público-Alvo

- **Estudantes de Biologia** (Ensino Médio e Superior)
- **Professores e Educadores** em Ciências Biológicas
- **Pesquisadores** em Genética e Biologia Molecular
- **Entusiastas** da Genética e Evolução

---

## 🧬 Funcionalidades Científicas

### 🔬 Tipos de Cruzamento Suportados

| Tipo             | Descrição                           | Lei de Mendel | Exemplo         |
| ---------------- | ----------------------------------- | ------------- | --------------- |
| **Monohíbrido**  | Um gene, dois alelos                | Primeira Lei  | Aa × aa         |
| **Dihíbrido**    | Dois genes, segregação independente | Segunda Lei   | AaBb × AaBb     |
| **Poli-híbrido** | Múltiplos genes simultâneos         | Segunda Lei   | AaBbCc × AaBbCc |

### 🎨 Padrões de Herança

<div align="center">

| Padrão                    | Descrição                         | Fenótipo Heterozigoto | Exemplo                                  |
| ------------------------- | --------------------------------- | --------------------- | ---------------------------------------- |
| **Dominância Completa**   | Alelo dominante mascara recessivo | Igual ao dominante    | Cor da semente em ervilhas               |
| **Dominância Incompleta** | Fenótipo intermediário            | Intermediário         | Cor de flores (vermelha + branca = rosa) |
| **Codominância**          | Ambos os alelos se expressam      | Ambos visíveis        | Sistema ABO sanguíneo                    |

</div>

### 📊 Análises Disponíveis

- ✅ **Tabelas de Punnett** interativas
- ✅ **Cálculo de probabilidades** genotípicas e fenotípicas
- ✅ **Validação automática** de genótipos
- ✅ **Visualização gráfica** de distribuições
- ✅ **Análise poli-híbrida** com decomposição
- ✅ **Cálculos personalizados** de fenótipos específicos

---

## ⚡ Características Técnicas

### 🎯 Performance e Usabilidade

- **⚡ Tempo de Resposta**: < 100ms para cálculos
- **📱 Responsividade**: Otimizado para todos os dispositivos
- **♿ Acessibilidade**: Navegação por teclado e screen readers
- **🌐 Compatibilidade**: Todos os navegadores modernos

### 🔒 Validação e Segurança

- **✅ Validação em Tempo Real**: Feedback instantâneo
- **🛡️ Sanitização de Entrada**: Prevenção de XSS
- **📝 Normalização Automática**: Padronização de genótipos
- **⚠️ Tratamento de Erros**: Mensagens informativas

---

## 🚀 Instalação e Uso

### 📥 Instalação Local

```bash
# 1. Clone o repositório
git clone https://github.com/GersonResplandes/calculadora-genetica-mendel.git

# 2. Navegue para o diretório
cd calculadora-genetica-mendel

# 3. Abra no navegador
# Opção A: Duplo clique no index.html
# Opção B: Servidor local (recomendado)
python -m http.server 8000
# ou
npx serve .
```

### 🎮 Como Usar

1. **Selecione o Tipo de Cruzamento**

   - Monohíbrido: Para um gene
   - Dihíbrido: Para dois genes
   - Poli-híbrido: Para múltiplos genes

2. **Digite os Genótipos**

   - Formato: `AaBb` (maiúsculas = dominante)
   - Validação automática em tempo real

3. **Configure a Herança**

   - Escolha o tipo de dominância
   - Defina os fenótipos personalizados

4. **Analise os Resultados**
   - Visualize a tabela de Punnett
   - Consulte as probabilidades
   - Explore os gráficos de distribuição

---

## 📊 Exemplos de Aplicação

### 🌱 Exemplo Clássico de Mendel

**Cruzamento Dihíbrido**: Ervilhas com cor e textura da semente

```javascript
Progenitor 1: AaBb (Amarela Lisa)
Progenitor 2: AaBb (Amarela Lisa)

Resultado Esperado:
- 9/16: Amarela Lisa (A_B_)
- 3/16: Amarela Rugosa (A_bb)
- 3/16: Verde Lisa (aaB_)
- 1/16: Verde Rugosa (aabb)
```

### 🩸 Sistema ABO Sanguíneo

**Herança Codominante**: Múltiplos alelos

```javascript
Progenitor 1: IAi (Tipo A)
Progenitor 2: IBi (Tipo B)

Resultado:
- 25%: IAIB (Tipo AB)
- 25%: IAi (Tipo A)
- 25%: IBi (Tipo B)
- 25%: ii (Tipo O)
```

### 🌸 Dominância Incompleta

**Flores com Herança Intermediária**

```javascript
Progenitor 1: RR (Vermelha)
Progenitor 2: rr (Branca)

Resultado:
- 100%: Rr (Rosa - fenótipo intermediário)
```

---

## 🔬 Fundamentos Científicos

### 📚 Base Teórica

Esta calculadora implementa os princípios fundamentais estabelecidos por **Gregor Mendel** (1822-1884) através de seus experimentos com ervilhas-de-cheiro (_Pisum sativum_):

#### 🧬 Primeira Lei de Mendel (Segregação)

> _"Durante a formação dos gametas, os pares de fatores hereditários se separam, de modo que cada gameta recebe apenas um fator de cada par."_

**Aplicação**: Genes em pares de cromossomos homólogos segregam durante a meiose.

#### 🧬 Segunda Lei de Mendel (Assortimento Independente)

> _"Diferentes pares de fatores hereditários se distribuem independentemente durante a formação dos gametas."_

**Aplicação**: Genes em cromossomos diferentes segregam independentemente.

### 🔍 Limitações e Considerações

⚠️ **Importante**: Esta calculadora assume:

- Genes em cromossomos diferentes (sem ligação gênica)
- Ausência de epistasia ou interações gênicas complexas
- Populações infinitas (probabilidades teóricas)

**Exceções Reais**:

- **Ligação Gênica**: Genes próximos no mesmo cromossomo
- **Crossing-over**: Recombinação genética
- **Epistasia**: Interação entre genes
- **Pleiotropia**: Um gene, múltiplos efeitos

---

## 🛠️ Tecnologias Utilizadas

### 🎨 Frontend

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

### 📦 Dependências

```json
{
  "dependencies": {
    "tailwindcss": "^3.x",
    "inter-font": "^1.x"
  }
}
```

### 🏗️ Arquitetura

- **Modular**: Código organizado em módulos ES6
- **Responsivo**: Design adaptativo para todos os dispositivos
- **Acessível**: Conformidade com WCAG 2.1
- **Performance**: Otimizado para carregamento rápido
- **PWA**: Progressive Web App com funcionalidades offline

---

## 📁 Estrutura do Projeto

```
genetica/
├── 📄 index.html                 # Página principal
├── 📄 manifest.json             # Configuração PWA
├── 📄 sw.js                     # Service Worker
├── 📁 assets/
│   ├── 🎨 logo.svg              # Logo da aplicação
│   ├── 📁 js/
│   │   ├── 🧠 app.js            # Aplicação principal
│   │   ├── 🔍 validation.js     # Validação de dados
│   │   ├── 🧬 genetics.js       # Lógica genética
│   │   ├── 🎨 ui.js             # Interface do usuário
│   │   └── 📱 pwa.js            # Gerenciador PWA
│   └── 🎨 style.css             # Estilos customizados
├── 📖 README.md                 # Documentação
└── 📄 LICENSE                   # Licença MIT
```

### 🔧 Módulos JavaScript

| Módulo            | Responsabilidade   | Funções Principais                  |
| ----------------- | ------------------ | ----------------------------------- |
| **app.js**        | Orquestração geral | Event handlers, estado da aplicação |
| **genetics.js**   | Cálculos genéticos | Gametas, probabilidades, fenótipos  |
| **validation.js** | Validação de dados | Genótipos, normalização             |
| **ui.js**         | Interface          | Renderização, feedback visual       |
| **pwa.js**        | Funcionalidades PWA | Instalação, cache, notificações     |

---

## 📱 Progressive Web App (PWA)

### 🎯 Funcionalidades PWA

- ✅ **Instalação**: Pode ser instalada como app nativo
- ✅ **Offline**: Funciona sem conexão com internet
- ✅ **Cache Inteligente**: Armazena recursos essenciais
- ✅ **Notificações**: Sistema de notificações push
- ✅ **Atualizações**: Atualização automática em background
- ✅ **Responsivo**: Adaptação perfeita para mobile

### 📲 Como Instalar

1. **Chrome/Edge**: Clique no ícone de instalação na barra de endereços
2. **Safari**: Adicione à tela inicial através do menu compartilhar
3. **Firefox**: Clique no ícone de instalação na barra de endereços
4. **Mobile**: Use o menu do navegador para "Adicionar à tela inicial"

### 🔧 Configuração PWA

- **Manifest**: `manifest.json` com configurações do app
- **Service Worker**: `sw.js` para cache e funcionalidades offline
- **Meta Tags**: Configurações específicas para cada plataforma
- **Ícones**: Múltiplos tamanhos para diferentes dispositivos

---

## 🎨 Interface e Design

### 🎯 Princípios de Design

- **🧠 Cognitivo**: Interface intuitiva baseada em conhecimento científico
- **👁️ Visual**: Cores semânticas para diferentes tipos genéticos
- **📱 Responsivo**: Adaptação perfeita para todos os dispositivos
- **♿ Acessível**: Navegação por teclado e leitores de tela

### 🎨 Paleta de Cores

| Elemento         | Cor        | Significado                  |
| ---------------- | ---------- | ---------------------------- |
| **Dominante**    | 🟢 Verde   | Alelos dominantes            |
| **Recessivo**    | 🟡 Amarelo | Alelos recessivos            |
| **Heterozigoto** | 🟣 Roxo    | Genótipos mistos             |
| **Codominante**  | 🔵 Azul    | Expressão de ambos os alelos |
| **Incompleta**   | 🟠 Rosa    | Fenótipo intermediário       |

### 📊 Componentes Visuais

- **Tabelas de Punnett**: Interativas com hover effects
- **Gráficos de Barras**: Distribuição de probabilidades
- **Feedback Visual**: Validação em tempo real
- **Tooltips Informativos**: Explicações contextuais

---

## 📈 Roadmap

### 🚀 Versão 2.0 (Próximas Funcionalidades)

- [ ] **Ligação Gênica**: Análise de genes ligados
- [ ] **Epistasia**: Interações gênicas complexas
- [ ] **Herança Ligada ao Sexo**: Genes no cromossomo X
- [ ] **Alelos Múltiplos**: Genes com mais de dois alelos
- [ ] **Herança Poligênica**: Características quantitativas

### 🔬 Melhorias Científicas

- [ ] **Frequência de Recombinação**: Cálculo de linkage
- [ ] **Qui-quadrado**: Teste de significância estatística
- [ ] **Populações**: Análise de equilíbrio de Hardy-Weinberg
- [ ] **Mutação**: Simulação de mutações pontuais

### 🎨 Melhorias de Interface

- [ ] **Modo Escuro**: Tema dark para melhor experiência
- [ ] **Animações**: Transições suaves e interativas
- [ ] **Exportação**: PDF e imagens dos resultados
- [ ] **Histórico**: Salvamento de cruzamentos anteriores

---

## 🤝 Contribuição

Contribuições são bem-vindas! Este projeto é mantido pela comunidade científica e educacional.

### 🛠️ Como Contribuir

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 📋 Diretrizes de Contribuição

- **Código**: Siga os padrões ES6+ e comentários em português
- **Testes**: Adicione testes para novas funcionalidades
- **Documentação**: Atualize a documentação conforme necessário
- **Issues**: Use o template de issue para reportar bugs

### 🐛 Reportando Bugs

Use o [sistema de issues](https://github.com/GersonResplandes/calculadora-genetica-mendel/issues) para reportar bugs ou solicitar funcionalidades.

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2024 Calculadora de Genética Mendeliana

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Agradecimentos

- **Gregor Mendel**: Pai da genética moderna
- **Comunidade Científica**: Pesquisadores e educadores em genética
- **Contribuidores**: Todos que ajudaram a melhorar este projeto
- **Educadores**: Professores que utilizam esta ferramenta em sala de aula

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

[![GitHub stars](https://img.shields.io/github/stars/your-username/calculadora-genetica-mendel?style=social)](https://github.com/your-username/calculadora-genetica-mendel/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/calculadora-genetica-mendel?style=social)](https://github.com/your-username/calculadora-genetica-mendel/network)
[![GitHub issues](https://img.shields.io/github/issues/your-username/calculadora-genetica-mendel)](https://github.com/your-username/calculadora-genetica-mendel/issues)

**🧬 Desenvolvido por Gérson Resplandes de Sá Sousa para a comunidade científica**

</div>
