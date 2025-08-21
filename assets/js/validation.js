// --- Validação de Genótipos e Herança ---

/**
 * Normaliza um genótipo para formato padrão
 * @param {string} genotype - Genótipo a ser normalizado
 * @returns {string} Genótipo normalizado
 */
export function normalizeGenotype(genotype) {
  const cleaned = genotype.trim().replace(/\s+/g, "");
  const genes = {};
  
  for (let i = 0; i < cleaned.length; i++) {
    const allele = cleaned[i];
    const geneName = allele.toLowerCase();
    if (!genes[geneName]) genes[geneName] = [];
    genes[geneName].push(allele);
  }
  
  return Object.keys(genes)
    .sort()
    .map((geneName) => genes[geneName].sort().join(""))
    .join("");
}

/**
 * Extrai os genes de um genótipo
 * @param {string} genotype - Genótipo normalizado
 * @returns {Array} Array de genes (letras minúsculas)
 */
export function extractGenes(genotype) {
  const pairs = genotype.match(/.{1,2}/g) || [];
  return pairs.map(pair => pair[0].toLowerCase());
}

/**
 * Valida um genótipo baseado no tipo de cruzamento
 * @param {string} genotype - Genótipo a ser validado
 * @param {string} type - Tipo de cruzamento (mono, di)
 * @returns {object} Resultado da validação
 */
export function validateGenotype(genotype, type) {
  const cleaned = genotype.trim();
  if (cleaned.length === 0) return { isValid: true, message: "" };
  
  const canonical = normalizeGenotype(cleaned);

  if (type === "mono") {
    if (
      !/^[A-Za-z]{2}$/.test(cleaned) ||
      cleaned[0].toLowerCase() !== cleaned[1].toLowerCase()
    ) {
      return {
        isValid: false,
        message: "Use um par de alelos (Ex: AA, Aa).",
      };
    }
  } else if (type === "di") {
    if (cleaned.length % 2 !== 0) {
      return {
        isValid: false,
        message: "Deve ter um número par de alelos.",
      };
    }
    
    const pairs = canonical.match(/.{1,2}/g) || [];
    if (!pairs || pairs.length < 2) {
      return {
        isValid: false,
        message: "Requer pelo menos 2 genes (Ex: AaBb).",
      };
    }
    
    const genes = new Set();
    for (const pair of pairs) {
      if (pair[0].toLowerCase() !== pair[1].toLowerCase()) {
        return {
          isValid: false,
          message: `Alelos '${pair}' não formam um par.`,
        };
      }
      if (genes.has(pair[0].toLowerCase())) {
        return {
          isValid: false,
          message: `Gene '${pair[0].toUpperCase()}' duplicado.`,
        };
      }
      genes.add(pair[0].toLowerCase());
    }
  }
  
  return { isValid: true, message: "" };
}

/**
 * Valida se ambos os progenitores são compatíveis
 * @param {object} parent1 - Dados do progenitor 1
 * @param {object} parent2 - Dados do progenitor 2
 * @returns {object} Resultado da validação
 */
export function validateBothParents(parent1, parent2) {
  if (
    !parent1.isValid ||
    !parent2.isValid ||
    !parent1.value ||
    !parent2.value
  ) {
    return { isValid: true };
  }
  
  if (parent1.genes.length !== parent2.genes.length) {
    return {
      isValid: false,
      message: "Progenitores devem ter o mesmo número de genes.",
    };
  }
  
  for (const gene of parent1.genes) {
    if (!parent2.genes.includes(gene)) {
      return {
        isValid: false,
        message: `Ambos devem ter o gene '${gene.toUpperCase()}'.`,
      };
    }
  }
  
  return { isValid: true };
}

/**
 * Cria dados de validação para um progenitor
 * @param {string} value - Valor do genótipo
 * @param {boolean} isValid - Se é válido
 * @param {Array} genes - Genes extraídos
 * @returns {object} Dados do progenitor
 */
export function createParentData(value, isValid, genes = []) {
  return {
    value,
    isValid,
    genes: isValid && value ? extractGenes(normalizeGenotype(value)) : genes
  };
}
