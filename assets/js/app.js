// --- Aplicação Principal da Calculadora de Genética Mendeliana ---

// Importações dos módulos
import {
  validateGenotype,
  validateBothParents,
  createParentData,
  normalizeGenotype,
} from "./validation.js";

import {
  getGametes,
  combineGametes,
  calculateProbabilities,
  calculateFinalGenotypeProbability,
  calculateFinalPhenotypeProbability,
} from "./genetics.js";

import {
  updateInputFeedback,
  renderPunnettSquare,
  renderProbabilities,
  renderInheritanceSelectors,
  renderPolyCrossList,
  renderPhenotypeSelectors,
  renderFinalProbabilityResult,
  renderCommonPhenotypeProbabilities,
} from "./ui.js";

// --- Elementos do DOM ---
const form = document.getElementById("genetics-form");
const calculateBtn = document.getElementById("calculate-btn");
const parent1Input = document.getElementById("parent1");
const parent2Input = document.getElementById("parent2");
const parent1Feedback = document.getElementById("parent1-feedback");
const parent2Feedback = document.getElementById("parent2-feedback");
const errorMessage = document.getElementById("error-message");
const resultsSection = document.getElementById("results-section");
const crossTypeRadios = document.querySelectorAll('input[name="cross-type"]');
const inheritanceSelectorsContainer = document.getElementById(
  "inheritance-selectors-container"
);
const exampleBtn = document.getElementById("example-btn");

const simpleCrossResults = document.getElementById("simple-cross-results");
const punnettSquareContainer = document.getElementById("punnett-square");
const probabilitiesContainer = document.getElementById("probabilities");
const lawText = document.getElementById("law-text");

const polyCrossResults = document.getElementById("poly-cross-results");
const crossListContainer = document.getElementById("cross-list");
const polyDetailsContainer = document.getElementById("poly-details");
const polyDetailsTitle = document.getElementById("poly-details-title");
const polyPunnettContainer = document.getElementById("poly-punnett-square");
const polyProbabilitiesContainer =
  document.getElementById("poly-probabilities");

const finalPhenotypeResult = document.getElementById("final-phenotype-result");

// --- Estado da Aplicação ---
let state = {
  crossType: "mono",
  parent1: createParentData("", true, []),
  parent2: createParentData("", true, []),
  inheritance: {},
};

let currentPolyCrossData = [];

// --- Manipuladores de Eventos ---

/**
 * Manipula mudanças nos campos de entrada
 */
function handleInputChange() {
  const p1Value = parent1Input.value;
  const p2Value = parent2Input.value;

  const p1Validation = validateGenotype(p1Value, state.crossType);
  const p2Validation = validateGenotype(p2Value, state.crossType);

  state.parent1 = createParentData(p1Value, p1Validation.isValid);
  state.parent2 = createParentData(p2Value, p2Validation.isValid);

  const bothParentsValidation = validateBothParents(
    state.parent1,
    state.parent2
  );

  updateInputFeedback(
    parent1Input,
    parent1Feedback,
    p1Validation.isValid,
    p1Validation.message
  );
  updateInputFeedback(
    parent2Input,
    parent2Feedback,
    p2Validation.isValid,
    p2Validation.message
  );

  let finalError = "";
  if (!p1Validation.isValid && p1Value)
    finalError = `Progenitor 1: ${p1Validation.message}`;
  else if (!p2Validation.isValid && p2Value)
    finalError = `Progenitor 2: ${p2Validation.message}`;
  else if (!bothParentsValidation.isValid)
    finalError = bothParentsValidation.message;

  errorMessage.textContent = finalError;

  calculateBtn.disabled = !(
    state.parent1.isValid &&
    state.parent2.isValid &&
    p1Value &&
    p2Value &&
    bothParentsValidation.isValid
  );

  renderInheritanceSelectors(
    [...new Set([...state.parent1.genes, ...state.parent2.genes])],
    state.inheritance,
    inheritanceSelectorsContainer,
    () => updateInheritanceState()
  );
}

/**
 * Atualiza o estado de herança baseado nos seletores
 */
function updateInheritanceState() {
  document
    .querySelectorAll("#inheritance-selectors-container .gene-settings")
    .forEach((container) => {
      const gene = container.dataset.gene;
      const typeSelector = container.querySelector("select");
      const phenotypeInputs = container.querySelectorAll("input");

      state.inheritance[gene] = {
        type: typeSelector.value,
        phenotypes: {
          dominant: phenotypeInputs[0].value,
          intermediate: phenotypeInputs[1].value,
          recessive: phenotypeInputs[2].value,
        },
      };
    });
}

/**
 * Manipula mudanças no tipo de cruzamento
 */
function handleCrossTypeChange(event) {
  state.crossType = event.target.value;
  const placeholders = {
    mono: "Ex: Aa",
    di: "Ex: AaBb ou AaBbCc",
  };

  parent1Input.placeholder = placeholders[state.crossType];
  parent2Input.placeholder = placeholders[state.crossType];
  parent1Input.value = "";
  parent2Input.value = "";

  handleInputChange();
  resultsSection.classList.add("hidden");
}

/**
 * Manipula o envio do formulário
 */
function handleFormSubmit(event) {
  event.preventDefault();
  if (calculateBtn.disabled) return;

  updateInheritanceState();

  resultsSection.classList.remove("hidden");
  polyCrossResults.classList.add("hidden");
  simpleCrossResults.classList.add("hidden");
  // Não limpar o resultado anterior para permitir comparações

  const p1 = normalizeGenotype(state.parent1.value);
  const p2 = normalizeGenotype(state.parent2.value);
  const p1Pairs = p1.match(/.{1,2}/g) || [];

  if (
    state.crossType === "mono" ||
    (state.crossType === "di" && p1Pairs.length === 2)
  ) {
    // Cruzamento simples (mono ou di)
    simpleCrossResults.classList.remove("hidden");
    lawText.textContent =
      p1Pairs.length === 1 ? "Primeira Lei de Mendel" : "Segunda Lei de Mendel";

    const gametes1 = getGametes(p1);
    const gametes2 = getGametes(p2);
    const offspring = gametes1.flatMap((g1) =>
      gametes2.map((g2) => combineGametes(g1, g2))
    );

    renderPunnettSquare(
      gametes1,
      gametes2,
      punnettSquareContainer,
      state.inheritance
    );
    renderProbabilities(offspring, probabilitiesContainer, state.inheritance);
  } else {
    // Cruzamento poli-híbrido
    polyCrossResults.classList.remove("hidden");
    polyDetailsContainer.classList.add("hidden");
    const p2Pairs = p2.match(/.{1,2}/g);

    currentPolyCrossData = p1Pairs.map((p1Pair, i) => {
      const p2Pair = p2Pairs[i];
      const gametes1 = getGametes(p1Pair);
      const gametes2 = getGametes(p2Pair);
      const offspring = gametes1.flatMap((g1) =>
        gametes2.map((g2) => combineGametes(g1, g2))
      );

      const { genotypeCounts } = calculateProbabilities(offspring);
      const probabilities = {};
      for (const genotype in genotypeCounts) {
        probabilities[genotype] = {
          count: genotypeCounts[genotype],
          total: offspring.length,
        };
      }

      return {
        p1: p1Pair,
        p2: p2Pair,
        gene: p1Pair[0].toLowerCase(),
        probabilities: probabilities,
      };
    });

    renderPolyCrossList(currentPolyCrossData, crossListContainer, (cross) => {
      renderPolyDetail(cross);
    });

    // Renderizar probabilidades automáticas
    renderCommonPhenotypeProbabilities(
      currentPolyCrossData,
      state.inheritance,
      document.getElementById("final-phenotype-result")
    );

    // Adicionar event listeners para cálculos personalizados
    addCustomCalculationListeners();
  }

  resultsSection.scrollIntoView({ behavior: "smooth" });
}

/**
 * Adiciona event listeners para cálculos personalizados
 */
function addCustomCalculationListeners() {
  // Event listener para cálculo de fenótipo específico
  const calculatePhenoBtn = document.getElementById("calculate-pheno-prob-btn");
  if (calculatePhenoBtn) {
    calculatePhenoBtn.addEventListener(
      "click",
      handleCustomPhenotypeCalculation
    );
  }
}

/**
 * Manipula o cálculo de fenótipo específico
 */
function handleCustomPhenotypeCalculation() {
  const resultContainer = document.getElementById("phenotype-result-area");
  if (!resultContainer) return;

  const phenotypeSelections = currentPolyCrossData.map((cross) => {
    const selector = document.getElementById(`pheno-${cross.gene}`);
    return selector ? selector.value : "dominant";
  });

  const result = calculateFinalPhenotypeProbability(
    phenotypeSelections,
    currentPolyCrossData,
    state.inheritance
  );

  // Apenas atualizar a área de resultado, mantendo os seletores visíveis
  renderFinalProbabilityResult(result, resultContainer);
}

/**
 * Renderiza os detalhes de um cruzamento poli-híbrido
 */
function renderPolyDetail(cross) {
  polyDetailsContainer.classList.remove("hidden");
  polyDetailsTitle.textContent = `Detalhes: ${cross.p1} × ${cross.p2}`;

  const gametes1 = getGametes(cross.p1);
  const gametes2 = getGametes(cross.p2);
  const offspring = gametes1.flatMap((g1) =>
    gametes2.map((g2) => combineGametes(g1, g2))
  );

  renderPunnettSquare(
    gametes1,
    gametes2,
    polyPunnettContainer,
    state.inheritance
  );
  renderProbabilities(offspring, polyProbabilitiesContainer, state.inheritance);
}

/**
 * Carrega o exemplo clássico de Mendel
 */
function loadClassicExample() {
  document.querySelector('input[name="cross-type"][value="di"]').checked = true;
  state.crossType = "di";
  parent1Input.value = "AaBb";
  parent2Input.value = "AaBb";

  handleInputChange();

  // Configurar fenótipos personalizados para o exemplo
  setTimeout(() => {
    const geneASelector = inheritanceSelectorsContainer.querySelector(
      '.gene-settings[data-gene="a"]'
    );
    if (geneASelector) {
      geneASelector.querySelector("select").value = "complete";
      const inputsA = geneASelector.querySelectorAll("input");
      inputsA[0].value = "Amarela";
      inputsA[2].value = "Verde";
    }

    const geneBSelector = inheritanceSelectorsContainer.querySelector(
      '.gene-settings[data-gene="b"]'
    );
    if (geneBSelector) {
      geneBSelector.querySelector("select").value = "complete";
      const inputsB = geneBSelector.querySelectorAll("input");
      inputsB[0].value = "Lisa";
      inputsB[2].value = "Rugosa";
    }

    calculateBtn.click();
  }, 100);
}

// --- Inicialização ---
function init() {
  // Verificar se os elementos essenciais existem
  if (!form || !parent1Input || !parent2Input || !calculateBtn) {
    console.error(
      "❌ Elementos essenciais não encontrados. Verifique se o HTML está correto."
    );
    return;
  }

  // Adicionar event listeners
  parent1Input.addEventListener("input", handleInputChange);
  parent2Input.addEventListener("input", handleInputChange);

  crossTypeRadios.forEach((radio) =>
    radio.addEventListener("change", handleCrossTypeChange)
  );

  form.addEventListener("submit", handleFormSubmit);

  if (exampleBtn) {
    exampleBtn.addEventListener("click", loadClassicExample);
  }

  // Inicializar
  handleInputChange();

  console.log(
    "✅ Calculadora de Genética Mendeliana inicializada com sucesso!"
  );
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
