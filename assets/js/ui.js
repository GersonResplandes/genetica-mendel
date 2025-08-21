// --- Interface do Usuário e Renderização ---

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
 * @param {object} inheritance - Configuração de herança
 */
export function renderPunnettSquare(gametes1, gametes2, container, inheritance = {}) {
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
      const { bgClass, borderClass } = getStyleClasses(offspring, inheritance);
      tableHTML += `<td class="border-2 p-1 md:p-2 font-mono hover:bg-gray-200 transition-colors ${borderClass}"><div class="${bgClass} rounded-md py-1">${offspring}</div></td>`;
    });
    tableHTML += "</tr>";
  });
  tableHTML += "</tbody></table>";
  container.innerHTML = tableHTML;
}

/**
 * Renderiza as probabilidades dos genótipos e fenótipos
 * @param {Array} offspring - Array de genótipos filhotes
 * @param {HTMLElement} container - Container onde renderizar
 * @param {object} inheritance - Configuração de herança
 */
export function renderProbabilities(offspring, container, inheritance = {}) {
  const { genotypeCounts, total } = calculateProbabilities(offspring);
  const phenotypeCounts = offspring.reduce((acc, g) => {
    const phenotype = getPhenotype(g, inheritance);
    acc[phenotype] = (acc[phenotype] || 0) + 1;
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
  
  html += renderChart(genotypeCounts, total, "Distribuição de Genótipos");

  if (Object.keys(phenotypeCounts).length > 1) {
    html +=
      '<div class="mt-4"><h4 class="font-semibold text-gray-700">Fenótipos:</h4><ul class="list-disc list-inside text-sm">';
    Object.entries(phenotypeCounts)
      .sort()
      .forEach(([phenotype, count]) => {
        const percentage = ((count / total) * 100)
          .toFixed(2)
          .replace(/\.00$/, "");
        html += `<li><strong>${phenotype}:</strong> ${percentage}% (${count}/${total})</li>`;
      });
    html += "</ul></div>";
    html += renderChart(phenotypeCounts, total, "Distribuição de Fenótipos");
  }
  
  container.innerHTML = html;
}

/**
 * Renderiza um gráfico de barras para as probabilidades
 * @param {object} counts - Contagens
 * @param {number} total - Total
 * @param {string} title - Título do gráfico
 * @returns {string} HTML do gráfico
 */
export function renderChart(counts, total, title) {
  let chartHTML = `<div class="mt-4"><h4 class="font-semibold text-gray-700">${title}</h4><div class="space-y-2 mt-2">`;
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  let colorIndex = 0;
  
  for (const [label, count] of Object.entries(counts).sort()) {
    const percentage = (count / total) * 100;
    const color = colors[colorIndex % colors.length];
    chartHTML += `
      <div class="flex items-center">
        <div class="w-1/3 text-xs truncate pr-2" title="${label}">${label}</div>
        <div class="w-2/3 bg-gray-200 rounded-full h-5">
          <div class="${color} h-5 rounded-full text-white text-xs text-center leading-5" style="width: ${percentage}%;">${percentage.toFixed(0)}%</div>
        </div>
      </div>
    `;
    colorIndex++;
  }
  chartHTML += "</div></div>";
  return chartHTML;
}

/**
 * Retorna as classes CSS baseadas no tipo de genótipo e herança
 * @param {string} genotype - Genótipo para determinar o estilo
 * @param {object} inheritance - Configuração de herança
 * @returns {object} Classes CSS para background e borda
 */
export function getStyleClasses(genotype, inheritance = {}) {
  if (genotype.length === 2) {
    const gene = genotype[0].toLowerCase();
    const type = inheritance[gene]?.type || "complete";
    const isHeterozygous = genotype[0] !== genotype[1];
    const isHomozygousDominant =
      genotype[0] === genotype[1] &&
      genotype[0] === genotype[0].toUpperCase();

    if (isHeterozygous) {
      if (type === "incomplete")
        return {
          bgClass: "bg-incomplete",
          borderClass: "border-incomplete",
        };
      if (type === "codominance")
        return {
          bgClass: "bg-codominant",
          borderClass: "border-codominant",
        };
      return {
        bgClass: "bg-heterozygous",
        borderClass: "border-heterozygous",
      };
    }
    return isHomozygousDominant
      ? { bgClass: "bg-dominant", borderClass: "border-dominant" }
      : { bgClass: "bg-recessive", borderClass: "border-recessive" };
  }
  return { bgClass: "", borderClass: "border-gray-300" };
}

/**
 * Renderiza os seletores de herança para os genes
 * @param {Array} genes - Array de genes
 * @param {object} inheritance - Configuração atual de herança
 * @param {HTMLElement} container - Container onde renderizar
 * @param {Function} onChange - Callback para mudanças
 */
export function renderInheritanceSelectors(genes, inheritance, container, onChange) {
  container.innerHTML = "";
  if (genes.length === 0) return;

  genes.forEach((gene) => {
    const geneLetter = gene.toUpperCase();
    if (!inheritance[gene]) {
      inheritance[gene] = {
        type: "complete",
        phenotypes: {
          dominant: "Dominante",
          intermediate: "Intermediário",
          recessive: "Recessivo",
        },
      };
    }
    
    const currentInh = inheritance[gene];
    const div = document.createElement("div");
    div.className = "gene-settings p-2 border rounded-md";
    div.dataset.gene = gene;
    div.innerHTML = `
      <div class="flex items-center justify-between text-sm">
        <label class="font-semibold mr-2">Gene ${geneLetter}:</label>
        <select data-gene="${gene}" class="p-1 border rounded-md w-full">
          <option value="complete" ${currentInh.type === "complete" ? "selected" : ""}>Completa</option>
          <option value="incomplete" ${currentInh.type === "incomplete" ? "selected" : ""}>Incompleta</option>
          <option value="codominance" ${currentInh.type === "codominance" ? "selected" : ""}>Codominância</option>
        </select>
      </div>
      <div class="phenotype-inputs mt-2 space-y-1 text-xs">
        <input type="text" value="${currentInh.phenotypes.dominant}" placeholder="Fenótipo Dominante (Ex: Amarela)" class="w-full p-1 border rounded">
        <input type="text" value="${currentInh.phenotypes.intermediate}" placeholder="Fenótipo Intermediário (Ex: Rosa)" class="w-full p-1 border rounded ${currentInh.type === "complete" ? "hidden" : ""}">
        <input type="text" value="${currentInh.phenotypes.recessive}" placeholder="Fenótipo Recessivo (Ex: Verde)" class="w-full p-1 border rounded">
      </div>
    `;
    container.appendChild(div);
  });

  // Adicionar event listeners
  container.querySelectorAll("select").forEach((sel) => {
    sel.addEventListener("change", (e) => {
      const gene = e.target.dataset.gene;
      const intermediateInput = container.querySelector(
        `.gene-settings[data-gene="${gene}"] input[placeholder*="Intermediário"]`
      );
      if (e.target.value === "complete") {
        intermediateInput.classList.add("hidden");
      } else {
        intermediateInput.classList.remove("hidden");
      }
      if (onChange) onChange();
    });
  });
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
 * Renderiza os seletores de fenótipo para cruzamentos poli-híbridos
 * @param {Array} polyCrossData - Dados dos cruzamentos
 * @param {object} inheritance - Configuração de herança
 * @param {HTMLElement} container - Container onde renderizar
 */
export function renderPhenotypeSelectors(polyCrossData, inheritance, container) {
  container.innerHTML = "";
  polyCrossData.forEach((cross) => {
    const geneLetter = cross.gene.toUpperCase();
    const inh = inheritance[cross.gene] || {};
    let options;
    
    switch (inh.type) {
      case "incomplete":
      case "codominance":
        options = `
          <option value="dominant">${inh.phenotypes?.dominant || "Dominante"}</option>
          <option value="intermediate">${inh.phenotypes?.intermediate || "Intermediário"}</option>
          <option value="recessive">${inh.phenotypes?.recessive || "Recessivo"}</option>
        `;
        break;
      default:
        options = `
          <option value="dominant">${inh.phenotypes?.dominant || "Dominante"}</option>
          <option value="recessive">${inh.phenotypes?.recessive || "Recessivo"}</option>
        `;
        break;
    }
    
    const div = document.createElement("div");
    div.className = "flex items-center justify-between text-sm";
    div.innerHTML = `
      <label for="pheno-${cross.gene}" class="font-semibold">Gene ${geneLetter}:</label>
      <select id="pheno-${cross.gene}" class="p-1 border rounded-md">${options}</select>
    `;
    container.appendChild(div);
  });
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

  let resultHTML = `<p>P(${result.desiredGenotype || 'fenótipo desejado'}) = ${result.fractionSteps.join(" × ")}</p>`;
  resultHTML += `<p class="font-bold">Resultado: ${result.simplifiedFraction} ≈ ${result.percentage}%</p>`;

  container.innerHTML = resultHTML;
}

// Importações necessárias
import { combineGametes, calculateProbabilities, getPhenotype } from './genetics.js';
