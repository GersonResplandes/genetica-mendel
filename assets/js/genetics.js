// --- Lógica Genética ---

/**
 * Gera os gametas possíveis de um genótipo
 * @param {string} genotype - Genótipo do progenitor
 * @returns {Array} Array de gametas possíveis
 */
export function getGametes(genotype) {
  if (genotype.length === 2) return [genotype[0], genotype[1]];
  if (genotype.length === 4) {
    const g = genotype;
    return [g[0] + g[2], g[0] + g[3], g[1] + g[2], g[1] + g[3]];
  }
  return [];
}

/**
 * Combina dois gametas para formar um genótipo filho
 * @param {string} gamete1 - Primeiro gameta
 * @param {string} gamete2 - Segundo gameta
 * @returns {string} Genótipo filho normalizado
 */
export function combineGametes(gamete1, gamete2) {
  return normalizeGenotype(gamete1 + gamete2);
}

/**
 * Calcula as probabilidades dos genótipos resultantes
 * @param {Array} offspring - Array de genótipos filhotes
 * @returns {object} Objeto com contagens e probabilidades
 */
export function calculateProbabilities(offspring) {
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
      percentage: ((genotypeCounts[genotype] / total) * 100).toFixed(2).replace(/\.00$/, "")
    };
  }

  return {
    genotypeCounts,
    probabilities,
    total
  };
}

/**
 * Calcula a probabilidade final para um genótipo específico em cruzamento poli-híbrido
 * @param {string} desiredGenotype - Genótipo desejado
 * @param {Array} polyCrossData - Dados dos cruzamentos poli-híbridos
 * @returns {object} Resultado do cálculo de probabilidade
 */
export function calculateFinalProbability(desiredGenotype, polyCrossData) {
  const desiredNormalized = normalizeGenotype(desiredGenotype);
  const desiredPairs = desiredNormalized.match(/.{1,2}/g) || [];

  if (desiredPairs.length !== polyCrossData.length) {
    return {
      isValid: false,
      error: "O genótipo desejado deve ter o mesmo número de genes dos progenitores."
    };
  }

  let finalProbDecimal = 1;
  let calculationSteps = [];
  let fractionSteps = [];
  let finalFraction = [1, 1]; // [numerador, denominador]

  for (const pair of desiredPairs) {
    const gene = pair[0].toLowerCase();
    const crossData = polyCrossData.find((c) => c.gene === gene);

    if (!crossData || !crossData.probabilities[pair]) {
      return {
        isValid: false,
        error: `Genótipo '${pair}' não é possível neste cruzamento.`
      };
    }

    const prob = crossData.probabilities[pair];
    const decimalValue = prob.count / prob.total;
    finalProbDecimal *= decimalValue;

    finalFraction[0] *= prob.count;
    finalFraction[1] *= prob.total;

    calculationSteps.push(`P(${pair})`);
    fractionSteps.push(`${prob.count}/${prob.total}`);
  }

  // Simplificar a fração final
  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }
  const commonDivisor = gcd(finalFraction[0], finalFraction[1]);
  const simplifiedFraction = `${finalFraction[0] / commonDivisor}/${finalFraction[1] / commonDivisor}`;

  return {
    isValid: true,
    desiredGenotype: desiredNormalized,
    calculationSteps,
    fractionSteps,
    simplifiedFraction,
    percentage: (finalProbDecimal * 100).toFixed(4)
  };
}

// Importação da função de normalização
import { normalizeGenotype } from './validation.js';
