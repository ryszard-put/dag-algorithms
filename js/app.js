const test_matrix = [
  [0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0],
];

const graph = new DAG(test_matrix);
const appController = new Controller(graph);
