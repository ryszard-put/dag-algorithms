class Controller {
  static CLEAR_BTN = '#clear_dag_btn';
  static LOG_BTN = '#log_dag_btn';
  static RANDOM_DAG_BTN = '#random_dag_btn';
  static AM_INPUT_BTN = '#matrix_dag_btn';
  static AM_INPUT = '#adjacency_matrix_input';
  constructor(graph) {
    this.graph = graph;
    this.graph.bindController(this);

    // get HTML elements
    this.clearBtn = document.querySelector(Controller.CLEAR_BTN);
    this.logBtn = document.querySelector(Controller.LOG_BTN);
    this.randomDagBtn = document.querySelector(Controller.RANDOM_DAG_BTN);
    this.amInput = document.querySelector(Controller.AM_INPUT);
    this.amInputBtn = document.querySelector(Controller.AM_INPUT_BTN);

    // Handle events
    this.clearBtn.addEventListener('click', (e) => this.graph.clearGraph());
    this.logBtn.addEventListener('click', (e) => this.graph.logGraph());
    this.randomDagBtn.addEventListener('click', (e) =>
      this.handleRandomDagCreation()
    );
    this.amInputBtn.addEventListener('click', () => this.graphFromInput());
    document.querySelectorAll('.alg_container > .alg_btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        this.testAlgorithm(btn.dataset.struct, btn.dataset.alg);
      });
    });
  }
}

Controller.prototype.initGraph = function () {};

Controller.prototype.graphFromInput = function () {
  let matrix = this.amInput.innerText
    .split('\n')
    .filter((g) => g.length)
    .map((row) => row.trim().split(' ').map(Number));

  this.graph.createGraphFromUserInput(matrix);
};

Controller.prototype.handleRandomDagCreation = function () {
  let n = parseInt(
    prompt('Podaj liczbe wierzchołków skierowanego grafu acyklicznego:')
  );
  if (n === 0) return alert('Proszę podać liczbę większą od zera!');
  if (n === isNaN) return alert('Nie podano liczby!');
  this.graph.generateRandomDAG(n);
  // TODO: nie tworzy sie graf pelny
};

Controller.prototype.testAlgorithm = function (struct, alg) {
  if (this.graph.empty) return alert('Brak struktury');
  console.log(
    `Uruchomienie testu algorytmu: ${alg}, dla struktury: ${struct}:`
  );
  this.graph.resetResults(struct, alg);
  let t0 = performance.now();
  this.graph[`${struct}_${alg}`]();
  let t1 = performance.now();
  this.graph.results[struct][alg].time = t1 - t0;
  console.log(this.graph.results[struct][alg]);
};
