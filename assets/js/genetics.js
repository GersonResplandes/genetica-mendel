// --- Lógica Genética e Herança ---

/**
 * Gera os gametas possíveis de um genótipo
 * @param {string} genotype - Genótipo do progenitor
 * @returns {Array} Array de gametas possíveis
 */
export function getGametes(genotype) {
  const pairs = genotype.match(/.{1,2}/g) || [];
  if (pairs.length === 0) return [];
  if (pairs.length === 1) return [...new Set(pairs[0].split(""))];

  let result = [""];
  for (const pair of pairs) {
    const newResult = [];
    const alleles = [...new Set(pair.split(""))];
    for (const existing of result) {
      for (const allele of alleles) {
        newResult.push(existing + allele);
      }
    }
    result = newResult;
  }
  return result;
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
 * Determina o fenótipo de um genótipo baseado na herança
 * @param {string} genotype - Genótipo
 * @param {object} inheritance - Configuração de herança
 * @returns {string} Fenótipo
 */
export function getPhenotype(genotype, inheritance = {}) {
  const pairs = genotype.match(/.{1,2}/g) || [];
  return pairs
    .map((pair) => {
      const gene = pair[0].toLowerCase();
      const inh = inheritance[gene] || {};
      const type = inh.type || "complete";
      const isHeterozygous = pair[0] !== pair[1];
      const isHomozygousDominant =
        pair[0] === pair[1] && pair[0] === pair[0].toUpperCase();

      if (isHeterozygous) {
        if (type === "incomplete")
          return inh.phenotypes?.intermediate || "Intermediário";
        if (type === "codominance")
          return inh.phenotypes?.intermediate || "Codominante";
      }
      if (
        isHomozygousDominant ||
        (isHeterozygous && type === "complete")
      ) {
        return inh.phenotypes?.dominant || "Dominante";
      }
      return inh.phenotypes?.recessive || "Recessivo";
    })
    .join(" / ");
}

/**
 * Calcula a probabilidade final para um genótipo específico
 * @param {string} desiredGenotype - Genótipo desejado
 * @param {Array} polyCrossData - Dados dos cruzamentos poli-híbridos
 * @returns {object} Resultado do cálculo de probabilidade
 */
export function calculateFinalGenotypeProbability(desiredGenotype, polyCrossData) {
  const desiredNormalized = normalizeGenotype(desiredGenotype);
  const desiredPairs = desiredNormalized.match(/.{1,2}/g) || [];

  if (desiredPairs.length !== polyCrossData.length) {
    return {
      isValid: false,
      error: `Erro: Genótipo deve ter ${polyCrossData.length} genes.`
    };
  }

  let finalProbDecimal = 1;
  let fractionSteps = [];
  let finalFraction = [1, 1];

  for (const pair of desiredPairs) {
    const gene = pair[0].toLowerCase();
    const crossData = polyCrossData.find((c) => c.gene === gene);
    const prob =
      crossData && crossData.probabilities[pair]
        ? crossData.probabilities[pair]
        : { count: 0, total: 1 };

    finalProbDecimal *= prob.count / prob.total;
    finalFraction[0] *= prob.count;
    finalFraction[1] *= prob.total;
    fractionSteps.push(`${prob.count}/${prob.total}`);
  }

  const simplifiedFraction = simplifyFraction(finalFraction[0], finalFraction[1]);
  
  return {
    isValid: true,
    desiredGenotype: desiredNormalized,
    fractionSteps,
    simplifiedFraction,
    percentage: (finalProbDecimal * 100).toFixed(2)
  };
}

/**
 * Calcula a probabilidade final para um fenótipo específico
 * @param {Array} phenotypeSelections - Seleções de fenótipos
 * @param {Array} polyCrossData - Dados dos cruzamentos
 * @param {object} inheritance - Configuração de herança
 * @returns {object} Resultado do cálculo
 */
export function calculateFinalPhenotypeProbability(phenotypeSelections, polyCrossData, inheritance) {
  let finalProbDecimal = 1;
  let fractionSteps = [];
  let finalFraction = [1, 1];

  polyCrossData.forEach((cross, index) => {
    const desiredPheno = phenotypeSelections[index];
    const type = inheritance[cross.gene]?.type || "complete";

    let phenoCount = 0;
    const total = Object.values(cross.probabilities)[0].total;

    for (const genotype in cross.probabilities) {
      const isHeterozygous = genotype[0] !== genotype[1];
      const isHomozygousDominant =
        genotype[0] === genotype[1] &&
        genotype[0].toUpperCase() === genotype[0];

      let matches = false;
      if (
        desiredPheno === "dominant" &&
        (isHomozygousDominant || (type === "complete" && isHeterozygous))
      )
        matches = true;
      if (
        desiredPheno === "recessive" &&
        !isHomozygousDominant &&
        !isHeterozygous
      )
        matches = true;
      if (desiredPheno === "intermediate" && isHeterozygous)
        matches = true;

      if (matches) phenoCount += cross.probabilities[genotype].count;
    }

    finalProbDecimal *= phenoCount / total;
    finalFraction[0] *= phenoCount;
    finalFraction[1] *= total;
    fractionSteps.push(`${phenoCount}/${total}`);
  });

  const simplifiedFraction = simplifyFraction(finalFraction[0], finalFraction[1]);
  
  return {
    isValid: true,
    fractionSteps,
    simplifiedFraction,
    percentage: (finalProbDecimal * 100).toFixed(2)
  };
}

/**
 * Simplifica uma fração
 * @param {number} numerator - Numerador
 * @param {number} denominator - Denominador
 * @returns {string} Fração simplificada
 */
export function simplifyFraction(numerator, denominator) {
  if (denominator === 0) return "Indefinido";
  
  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }
  
  const commonDivisor = gcd(numerator, denominator);
  return `${numerator / commonDivisor}/${denominator / commonDivisor}`;
}

// Importação da função de normalização
import { normalizeGenotype } from './validation.js';
