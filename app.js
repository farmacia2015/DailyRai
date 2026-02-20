let treinoAtual = "A";
let dadosTreinos = JSON.parse(localStorage.getItem("treinos")) || {};
let historico = JSON.parse(localStorage.getItem("historico")) || [];
let financeiro = JSON.parse(localStorage.getItem("financeiro")) || { ganhos: [], gastos: [], meta: 0 };

function mostrarTela(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function selecionarTreino(tipo) {
  treinoAtual = tipo;
  renderizarTreino();
}

function renderizarTreino() {
  let container = document.getElementById("tabelaTreino");
  let exercicios = dadosTreinos[treinoAtual] || [];

  container.innerHTML = exercicios.map((ex, i) => `
    <div>
      <strong>${ex.nome}</strong>
      <input type="text" placeholder="Séries" value="${ex.series}">
      <input type="text" placeholder="Reps/Tempo" value="${ex.reps}">
      <input type="number" placeholder="Peso" value="${ex.peso}">
      <input type="checkbox" ${ex.feito ? "checked" : ""}>
      <button onclick="removerExercicio(${i})">❌</button>
    </div>
  `).join("");
}

function adicionarExercicio() {
  let nome = prompt("Nome do exercício:");
  if (!dadosTreinos[treinoAtual]) dadosTreinos[treinoAtual] = [];
  dadosTreinos[treinoAtual].push({ nome, series: "", reps: "", peso: "", feito: false });
  salvar();
  renderizarTreino();
}

function removerExercicio(i) {
  dadosTreinos[treinoAtual].splice(i, 1);
  salvar();
  renderizarTreino();
}

function finalizarTreino() {
  let hoje = new Date().toLocaleDateString();
  historico.push({ data: hoje, treino: treinoAtual, exercicios: dadosTreinos[treinoAtual] });
  localStorage.setItem("historico", JSON.stringify(historico));
  alert("Treino salvo 💪");
  renderizarHistorico();
}

function renderizarHistorico() {
  let container = document.getElementById("listaHistorico");
  container.innerHTML = historico.map(h =>
    `<div><strong>${h.data}</strong> - Treino ${h.treino}</div>`
  ).join("");
}

function adicionarGanho() {
  let fonte = document.getElementById("fonte").value;
  let valor = parseFloat(document.getElementById("valorGanho").value);
  financeiro.ganhos.push({ fonte, valor });
  salvarFinanceiro();
}

function adicionarGasto() {
  let categoria = document.getElementById("categoria").value;
  let valor = parseFloat(document.getElementById("valorGasto").value);
  financeiro.gastos.push({ categoria, valor });
  salvarFinanceiro();
}

function salvarFinanceiro() {
  financeiro.meta = parseFloat(document.getElementById("meta").value) || 0;
  localStorage.setItem("financeiro", JSON.stringify(financeiro));
  atualizarResumo();
}

function atualizarResumo() {
  let totalGanhos = financeiro.ganhos.reduce((s, g) => s + g.valor, 0);
  let totalGastos = financeiro.gastos.reduce((s, g) => s + g.valor, 0);
  let saldo = totalGanhos - totalGastos;

  document.getElementById("resumoFinanceiro").innerHTML =
    `<p>Ganhos: R$ ${totalGanhos}</p>
     <p>Gastos: R$ ${totalGastos}</p>
     <p>Saldo: R$ ${saldo}</p>
     <p>Meta: R$ ${financeiro.meta}</p>`;
}

function salvar() {
  localStorage.setItem("treinos", JSON.stringify(dadosTreinos));
}

renderizarTreino();
renderizarHistorico();
atualizarResumo();