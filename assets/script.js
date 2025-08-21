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
const polyProbabilitiesContainer =
  document.getElementById("poly-probabilities");

const desiredGenotypeInput = document.getElementById("desired-genotype-input");
const calculateProbBtn = document.getElementById("calculate-prob-btn");
const finalProbabilityResult = document.getElementById(
  "final-probability-result"
);

// --- Estado da Aplicação ---
let state = {
  crossType: "mono",
  parent1: { value: "", isValid: false },
  parent2: { value: "", isValid: false },
};
let currentPolyCrossData = [];

// --- Funções de Normalização e Validação ---

function normalizeGenotype(genotype) {
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

function validateGenotype(genotype, type) {
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

function validateBothParents() {
  const p1Value = parent1Input.value.trim();
  const p2Value = parent2Input.value.trim();
  if (state.crossType !== "poly" || !p1Value || !p2Value)
    return { isValid: true };

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

// --- Funções de Lógica Genética ---

function getGametes(genotype) {
  if (genotype.length === 2) return [genotype[0], genotype[1]];
  if (genotype.length === 4) {
    const g = genotype;
    return [g[0] + g[2], g[0] + g[3], g[1] + g[2], g[1] + g[3]];
  }
  return [];
}

function combineGametes(gamete1, gamete2) {
  return normalizeGenotype(gamete1 + gamete2);
}

// --- Funções de Renderização e Cálculo ---

function updateInputFeedback(inputEl, feedbackEl, isValid, message) {
  inputEl.classList.remove("input-valid", "input-invalid");
  if (inputEl.value === "") {
    feedbackEl.innerHTML = "";
    return;
  }
  if (isValid) {
    inputEl.classList.add("input-valid");
    feedbackEl.innerHTML = '<span class="text-green-600 text-xl">✓</span>';
    inputEl.removeAttribute("data-tooltip");
  } else {
    inputEl.classList.add("input-invalid");
    feedbackEl.innerHTML = `<span class="text-red-600 text-xl cursor-pointer" data-tooltip="${message}">✗</span>`;
  }
}

function renderPunnettSquare(gametes1, gametes2, container) {
  let tableHTML =
    '<table class="w-full border-collapse text-center text-sm md:text-base">';
  tableHTML +=
    '<thead><tr><th class="border-2 border-gray-400 p-1 md:p-2"></th>';
  gametes2.forEach((gamete) => {
    tableHTML += `<th class="border-2 border-gray-400 p-1 md:p-2 font-bold bg-gray-100">${gamete}</th>`;
  });
  tableHTML += "</tr></thead><tbody>";

  gametes1.forEach((g1) => {
    tableHTML += `<tr><th class="border-2 border-gray-400 p-1 md:p-2 font-bold bg-gray-100">${g1}</th>`;
    gametes2.forEach((g2) => {
      const offspring = combineGametes(g1, g2);
      const { bgClass, borderClass } = getStyleClasses(offspring);
      tableHTML += `<td class="border-2 p-1 md:p-2 font-mono hover:bg-gray-200 transition-colors ${borderClass}"><div class="${bgClass} rounded-md py-1">${offspring}</div></td>`;
    });
    tableHTML += "</tr>";
  });
  tableHTML += "</tbody></table>";
  container.innerHTML = tableHTML;
}

function renderProbabilities(offspring, container) {
  const total = offspring.length;
  const genotypeCounts = offspring.reduce((acc, g) => {
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  let html =
    '<div><h4 class="font-semibold text-gray-700">Genótipos:</h4><ul class="list-disc list-inside text-sm">';
  Object.entries(genotypeCounts)
    .sort()
    .forEach(([genotype, count]) => {
      const percentage = ((count / total) * 100)
        .toFixed(2)
        .replace(/\.00$/, "");
      html += `<li><strong>${genotype}:</strong> ${percentage}% (${count}/${total})</li>`;
    });
  html += "</ul></div>";
  container.innerHTML = html;
}

function getStyleClasses(genotype) {
  if (genotype[0] === genotype[1]) {
    return genotype[0] === genotype[0].toUpperCase()
      ? { bgClass: "bg-dominant", borderClass: "border-dominant" }
      : { bgClass: "bg-recessive", borderClass: "border-recessive" };
  }
  return { bgClass: "bg-heterozygous", borderClass: "border-heterozygous" };
}

// --- Manipuladores de Eventos ---

function handleInputChange() {
  const p1Value = parent1Input.value;
  const p2Value = parent2Input.value;

  const p1Validation = validateGenotype(p1Value, state.crossType);
  const p2Validation = validateGenotype(p2Value, state.crossType);
  const bothParentsValidation = validateBothParents();

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

    crossListContainer.innerHTML = "";
    currentPolyCrossData.forEach((cross, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${cross.p1} × ${cross.p2}`;
      li.className = "cross-list-item p-2 rounded-md border";
      li.dataset.index = index;
      li.addEventListener("click", () => {
        document
          .querySelectorAll(".cross-list-item")
          .forEach((el) => el.classList.remove("active"));
        li.classList.add("active");
        renderPolyDetail({ p1: cross.p1, p2: cross.p2 });
      });
      crossListContainer.appendChild(li);
    });
  }
  resultsSection.scrollIntoView({ behavior: "smooth" });
}

function renderPolyDetail(cross) {
  polyDetailsContainer.classList.remove("hidden");
  polyDetailsTitle.textContent = `Detalhes do Cruzamento: ${cross.p1} × ${cross.p2}`;
  const gametes1 = getGametes(cross.p1);
  const gametes2 = getGametes(cross.p2);
  const offspring = gametes1.flatMap((g1) =>
    gametes2.map((g2) => combineGametes(g1, g2))
  );
  renderPunnettSquare(gametes1, gametes2, polyPunnettContainer);
  renderProbabilities(offspring, polyProbabilitiesContainer);
}

function handleFinalProbabilityCalculation() {
  const desiredRaw = desiredGenotypeInput.value;
  const validation = validateGenotype(desiredRaw, "poly");
  if (!validation.isValid) {
    finalProbabilityResult.innerHTML = `<p class="text-red-600">Erro: ${validation.message}</p>`;
    return;
  }

  const desiredNormalized = normalizeGenotype(desiredRaw);
  const desiredPairs = desiredNormalized.match(/.{1,2}/g) || [];

  if (desiredPairs.length !== currentPolyCrossData.length) {
    finalProbabilityResult.innerHTML = `<p class="text-red-600">Erro: O genótipo desejado deve ter o mesmo número de genes dos progenitores.</p>`;
    return;
  }

  let finalProbDecimal = 1;
  let calculationSteps = [];
  let fractionSteps = [];
  let finalFraction = [1, 1]; // [numerador, denominador]

  for (const pair of desiredPairs) {
    const gene = pair[0].toLowerCase();
    const crossData = currentPolyCrossData.find((c) => c.gene === gene);

    if (!crossData || !crossData.probabilities[pair]) {
      finalProbDecimal = 0;
      finalFraction = [0, 1];
      break;
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
  const simplifiedFraction = `${finalFraction[0] / commonDivisor}/${
    finalFraction[1] / commonDivisor
  }`;

  let resultHTML = `<p class="font-semibold">Cálculo da Probabilidade para <strong class="font-mono">${desiredNormalized}</strong>:</p>`;
  resultHTML += `<p class="text-sm my-2">P(${desiredNormalized}) = ${calculationSteps.join(
    " × "
  )}</p>`;
  resultHTML += `<p class="text-sm my-2">= ${fractionSteps.join(" × ")}</p>`;
  resultHTML += `<p class="font-bold text-lg mt-3">Resultado: ${simplifiedFraction} ≈ ${(
    finalProbDecimal * 100
  ).toFixed(4)}%</p>`;

  finalProbabilityResult.innerHTML = resultHTML;
}

// --- Inicialização ---
parent1Input.addEventListener("input", handleInputChange);
parent2Input.addEventListener("input", handleInputChange);
crossTypeRadios.forEach((radio) =>
  radio.addEventListener("change", handleCrossTypeChange)
);
form.addEventListener("submit", handleFormSubmit);
calculateProbBtn.addEventListener("click", handleFinalProbabilityCalculation);
