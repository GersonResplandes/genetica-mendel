// --- Validação de Genótipos ---

/**
 * Normaliza um genótipo para formato padrão
 * @param {string} genotype - Genótipo a ser normalizado
 * @returns {string} Genótipo normalizado
 */
export function normalizeGenotype(genotype) {
  const cleaned = genotype.trim().replace(/\s+/g, "");
  const pairs = cleaned.match(/.{1,2}/g) || [];
  const sortedPairs = pairs.map((pair) => {
    const alleles = pair.split("");
    alleles.sort(
      (a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase()) || a.localeCompare(b)
    );
    return alleles.join("");
  });
  sortedPairs.sort((a, b) =>
    a[0].toLowerCase().localeCompare(b[0].toLowerCase())
  );
  return sortedPairs.join("");
}

/**
 * Valida um genótipo baseado no tipo de cruzamento
 * @param {string} genotype - Genótipo a ser validado
 * @param {string} type - Tipo de cruzamento (mono, di, poly)
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
        message:
          "Genótipo monohíbrido inválido. Use um par de alelos (Ex: AA, Aa).",
      };
    }
  } else if (type === "di") {
    if (
      !/^[A-Za-z]{4}$/.test(cleaned) ||
      cleaned
        .match(/.{1,2}/g)
        .some((p) => p[0].toLowerCase() !== p[1].toLowerCase())
    ) {
      return {
        isValid: false,
        message:
          "Genótipo dihíbrido inválido. Use dois pares de alelos (Ex: AaBb).",
      };
    }
    const genes = new Set(
      canonical
        .toLowerCase()
        .split("")
        .filter((_, i) => i % 2 === 0)
    );
    if (genes.size !== 2)
      return {
        isValid: false,
        message: "Deve conter exatamente 2 genes diferentes.",
      };
  } else if (type === "poly") {
    if (cleaned.length % 2 !== 0) {
      return {
        isValid: false,
        message: "Genótipo deve ter um número par de alelos.",
      };
    }
    const pairs = canonical.match(/.{1,2}/g) || [];
    const genes = new Set();
    for (const pair of pairs) {
      if (pair[0].toLowerCase() !== pair[1].toLowerCase()) {
        return {
          isValid: false,
          message: `Alelos '${pair}' não formam um par para o mesmo gene.`,
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
 * @param {string} parent1 - Genótipo do progenitor 1
 * @param {string} parent2 - Genótipo do progenitor 2
 * @returns {object} Resultado da validação
 */
export function validateBothParents(parent1, parent2) {
  const p1Value = parent1.trim();
  const p2Value = parent2.trim();
  
  if (!p1Value || !p2Value) return { isValid: true };

  const p1Genes = new Set(
    (normalizeGenotype(p1Value).match(/.{1,2}/g) || []).map((p) =>
      p[0].toLowerCase()
    )
  );
  const p2Genes = new Set(
    (normalizeGenotype(p2Value).match(/.{1,2}/g) || []).map((p) =>
      p[0].toLowerCase()
    )
  );

  if (p1Genes.size !== p2Genes.size) {
    return {
      isValid: false,
      message: "Progenitores devem ter o mesmo número de genes.",
    };
  }
  for (const gene of p1Genes) {
    if (!p2Genes.has(gene)) {
      return {
        isValid: false,
        message: `Ambos progenitores devem ter o gene '${gene.toUpperCase()}'.`,
      };
    }
  }
  return { isValid: true };
}
