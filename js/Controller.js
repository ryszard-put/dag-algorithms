class Controller {
  static RANDOM_DAG_BTN = '#random_dag_btn';
  constructor(graph) {
    this.graph = graph;
    this.graph.bindController(this);

    // get HTML elements
    this.randomDagBtn = document.querySelector(Controller.RANDOM_DAG_BTN);

    // Handle events
    this.randomDagBtn.addEventListener('click', (e) =>
      this.handleRandomDagCreation()
    );
  }
}

Controller.prototype.initGraph = function () {};

Controller.prototype.handleRandomDagCreation = function () {
  let n = parseInt(
    prompt('Podaj liczbe wierzchołków skierowanego grafu acyklicznego:')
  );
  if (n === 0) return alert('Proszę podać liczbę większą od zera!');
  if (n === isNaN) return alert('Nie podano liczby!');
  this.graph.generateRandomDAG(n);
  // TODO: nie tworzy sie graf pelny
};
