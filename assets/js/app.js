// --- Aplicação Principal ---

// Importações dos módulos
import { validateGenotype, validateBothParents } from './validation.js';
import { getGametes, combineGametes, calculateFinalProbability } from './genetics.js';
import { 
  updateInputFeedback, 
  renderPunnettSquare, 
  renderProbabilities, 
  renderPolyCrossList, 
  renderPolyDetail, 
  renderFinalProbabilityResult 
} from './ui.js';

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

const simpleCrossResults = document.getElementById("simple-cross-results");
const punnettSquareContainer = document.getElementById("punnett-square");
const probabilitiesContainer = document.getElementById("probabilities");
const lawText = document.getElementById("law-text");

const polyCrossResults = document.getElementById("poly-cross-results");
const crossListContainer = document.getElementById("cross-list");
const polyDetailsContainer = document.getElementById("poly-details");
const polyDetailsTitle = document.getElementById("poly-details-title");
const polyPunnettContainer = document.getElementById("poly-punnett-square");
const polyProbabilitiesContainer = document.getElementById("poly-probabilities");

const desiredGenotypeInput = document.getElementById("desired-genotype-input");
const calculateProbBtn = document.getElementById("calculate-prob-btn");
const finalProbabilityResult = document.getElementById("final-probability-result");

// --- Estado da Aplicação ---
let state = {
  crossType: "mono",
  parent1: { value: "", isValid: false },
  parent2: { value: "", isValid: false },
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
  const bothParentsValidation = validateBothParents(p1Value, p2Value);

  state.parent1 = { value: p1Value, isValid: p1Validation.isValid };
  state.parent2 = { value: p2Value, isValid: p2Validation.isValid };

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
}

/**
 * Manipula mudanças no tipo de cruzamento
 */
function handleCrossTypeChange(event) {
  state.crossType = event.target.value;
  const placeholders = { mono: "Ex: Aa", di: "Ex: AaBb", poly: "Ex: AaBbCc" };
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

  resultsSection.classList.remove("hidden");
  polyCrossResults.classList.add("hidden");
  simpleCrossResults.classList.add("hidden");
  finalProbabilityResult.innerHTML = "";
  desiredGenotypeInput.value = "";

  const p1 = normalizeGenotype(state.parent1.value);
  const p2 = normalizeGenotype(state.parent2.value);

  if (state.crossType === "mono" || state.crossType === "di") {
    simpleCrossResults.classList.remove("hidden");
    lawText.textContent =
      state.crossType === "mono"
        ? "Primeira Lei de Mendel (Segregação)"
        : "Segunda Lei de Mendel (Assortimento Independente)";
    const gametes1 = getGametes(p1);
    const gametes2 = getGametes(p2);
    const offspring = gametes1.flatMap((g1) =>
      gametes2.map((g2) => combineGametes(g1, g2))
    );
    renderPunnettSquare(gametes1, gametes2, punnettSquareContainer);
    renderProbabilities(offspring, probabilitiesContainer);
  } else if (state.crossType === "poly") {
    polyCrossResults.classList.remove("hidden");
    polyDetailsContainer.classList.add("hidden");
    const p1Pairs = p1.match(/.{1,2}/g);
    const p2Pairs = p2.match(/.{1,2}/g);

    currentPolyCrossData = p1Pairs.map((p1Pair, i) => {
      const p2Pair = p2Pairs[i];
      const gametes1 = getGametes(p1Pair);
      const gametes2 = getGametes(p2Pair);
      const offspring = gametes1.flatMap((g1) =>
        gametes2.map((g2) => combineGametes(g1, g2))
      );
      const total = offspring.length;
      const genotypeCounts = offspring.reduce((acc, g) => {
        acc[g] = (acc[g] || 0) + 1;
        return acc;
      }, {});
      const probabilities = {};
      for (const genotype in genotypeCounts) {
        probabilities[genotype] = {
          count: genotypeCounts[genotype],
          total: total,
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
      renderPolyDetail(cross, polyDetailsTitle, polyPunnettContainer, polyProbabilitiesContainer);
      polyDetailsContainer.classList.remove("hidden");
    });
  }
  resultsSection.scrollIntoView({ behavior: "smooth" });
}

/**
 * Manipula o cálculo da probabilidade final
 */
function handleFinalProbabilityCalculation() {
  const desiredRaw = desiredGenotypeInput.value;
  const validation = validateGenotype(desiredRaw, "poly");
  if (!validation.isValid) {
    finalProbabilityResult.innerHTML = `<p class="text-red-600">Erro: ${validation.message}</p>`;
    return;
  }

  const result = calculateFinalProbability(desiredRaw, currentPolyCrossData);
  renderFinalProbabilityResult(result, finalProbabilityResult);
}

// --- Inicialização ---
function init() {
  // Adicionar event listeners
  parent1Input.addEventListener("input", handleInputChange);
  parent2Input.addEventListener("input", handleInputChange);
  crossTypeRadios.forEach((radio) =>
    radio.addEventListener("change", handleCrossTypeChange)
  );
  form.addEventListener("submit", handleFormSubmit);
  calculateProbBtn.addEventListener("click", handleFinalProbabilityCalculation);
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Importação da função de normalização
import { normalizeGenotype } from './validation.js';
