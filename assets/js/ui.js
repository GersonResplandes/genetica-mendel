// --- Interface do Usuário ---

/**
 * Atualiza o feedback visual dos campos de entrada
 * @param {HTMLElement} inputEl - Elemento de entrada
 * @param {HTMLElement} feedbackEl - Elemento de feedback
 * @param {boolean} isValid - Se a entrada é válida
 * @param {string} message - Mensagem de erro (se houver)
 */
export function updateInputFeedback(inputEl, feedbackEl, isValid, message) {
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

/**
 * Renderiza a tabela de Punnett
 * @param {Array} gametes1 - Gametas do progenitor 1
 * @param {Array} gametes2 - Gametas do progenitor 2
 * @param {HTMLElement} container - Container onde renderizar
 */
export function renderPunnettSquare(gametes1, gametes2, container) {
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

/**
 * Renderiza as probabilidades dos genótipos
 * @param {Array} offspring - Array de genótipos filhotes
 * @param {HTMLElement} container - Container onde renderizar
 */
export function renderProbabilities(offspring, container) {
  const { genotypeCounts, total } = calculateProbabilities(offspring);

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

/**
 * Retorna as classes CSS baseadas no tipo de genótipo
 * @param {string} genotype - Genótipo para determinar o estilo
 * @returns {object} Classes CSS para background e borda
 */
export function getStyleClasses(genotype) {
  if (genotype[0] === genotype[1]) {
    return genotype[0] === genotype[0].toUpperCase()
      ? { bgClass: "bg-dominant", borderClass: "border-dominant" }
      : { bgClass: "bg-recessive", borderClass: "border-recessive" };
  }
  return { bgClass: "bg-heterozygous", borderClass: "border-heterozygous" };
}

/**
 * Renderiza a lista de cruzamentos poli-híbridos
 * @param {Array} polyCrossData - Dados dos cruzamentos
 * @param {HTMLElement} container - Container onde renderizar
 * @param {Function} onCrossClick - Callback para clique em cruzamento
 */
export function renderPolyCrossList(polyCrossData, container, onCrossClick) {
  container.innerHTML = "";
  polyCrossData.forEach((cross, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${cross.p1} × ${cross.p2}`;
    li.className = "cross-list-item p-2 rounded-md border";
    li.dataset.index = index;
    li.addEventListener("click", () => {
      document
        .querySelectorAll(".cross-list-item")
        .forEach((el) => el.classList.remove("active"));
      li.classList.add("active");
      onCrossClick(cross);
    });
    container.appendChild(li);
  });
}

/**
 * Renderiza os detalhes de um cruzamento poli-híbrido específico
 * @param {object} cross - Dados do cruzamento
 * @param {HTMLElement} titleEl - Elemento do título
 * @param {HTMLElement} punnettContainer - Container da tabela de Punnett
 * @param {HTMLElement} probContainer - Container das probabilidades
 */
export function renderPolyDetail(cross, titleEl, punnettContainer, probContainer) {
  titleEl.textContent = `Detalhes do Cruzamento: ${cross.p1} × ${cross.p2}`;
  const gametes1 = getGametes(cross.p1);
  const gametes2 = getGametes(cross.p2);
  const offspring = gametes1.flatMap((g1) =>
    gametes2.map((g2) => combineGametes(g1, g2))
  );
  renderPunnettSquare(gametes1, gametes2, punnettContainer);
  renderProbabilities(offspring, probContainer);
}

/**
 * Renderiza o resultado da probabilidade final
 * @param {object} result - Resultado do cálculo
 * @param {HTMLElement} container - Container onde renderizar
 */
export function renderFinalProbabilityResult(result, container) {
  if (!result.isValid) {
    container.innerHTML = `<p class="text-red-600">Erro: ${result.error}</p>`;
    return;
  }

  let resultHTML = `<p class="font-semibold">Cálculo da Probabilidade para <strong class="font-mono">${result.desiredGenotype}</strong>:</p>`;
  resultHTML += `<p class="text-sm my-2">P(${result.desiredGenotype}) = ${result.calculationSteps.join(" × ")}</p>`;
  resultHTML += `<p class="text-sm my-2">= ${result.fractionSteps.join(" × ")}</p>`;
  resultHTML += `<p class="font-bold text-lg mt-3">Resultado: ${result.simplifiedFraction} ≈ ${result.percentage}%</p>`;

  container.innerHTML = resultHTML;
}

// Importações necessárias
import { combineGametes, getGametes, calculateProbabilities } from './genetics.js';
