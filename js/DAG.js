class DAG {
  constructor(adjacency_matrix = []) {
    this.adjacency_matrix = adjacency_matrix;
    this.successors_list = [];
    this.edges_list = [];

    this.SLrecursiveDFSResult = [];
    this.createSuccessorsList();
    this.createEdgesList();
  }

  bindController(controller) {
    this.controller = controller;
  }
}

DAG.prototype.createSuccessorsList = function () {
  let list = [];
  this.adjacency_matrix.forEach((vertex) => {
    let successors = [];
    vertex.forEach((successor, c_idx) => {
      if (successor) successors.push(c_idx);
    });
    list.push(successors.length ? successors : []);
  });
  this.successors_list = [...list];
};

DAG.prototype.createEdgesList = function () {
  let list = [];
  this.successors_list.forEach((successors, from /*out index*/) => {
    if (successors) {
      successors.forEach((to /*in index*/) => {
        if (to) {
          list.push({ out: from, in: to });
        }
      });
    }
  });
  this.edges_list = [...list];
};

DAG.prototype.createAdjacencyMatrix = function (n) {
  // n - amount of vertices
  const EDGE_FACTOR = 0.5;
  const EDGES = Math.floor((EDGE_FACTOR * (n * (n - 1))) / 2);
  let edgeCounter = n - 1;
  let matrix = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => 0)
  );

  for (let i = 0; i < n - 1; i++) {
    matrix[i][i + 1] = 1;
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 2; j < n; j++) {
      if ((i + j) % 2 && edgeCounter++ < EDGES) matrix[i][j] = 1;
    }
  }
  this.adjacency_matrix = matrix;
};

DAG.prototype.generateRandomDAG = function (n) {
  console.log('start adjacency matrix');
  let t0 = performance.now();
  this.createAdjacencyMatrix(n);
  let t1 = performance.now();
  console.log('end adjacency matrix', t1 - t0, '[ms]');
  console.log('start successors list');
  t0 = performance.now();
  this.createSuccessorsList();
  t1 = performance.now();
  console.log('end successors list', t1 - t0, '[ms]');
  console.log('start edges list');
  t0 = performance.now();
  this.createEdgesList();
  t1 = performance.now();
  console.log('end edges list ', t1 - t0, '[ms]');

  // console.log('start adjacency matrix');
  // this.createAdjacencyMatrix(n);
  // console.log('end adjacency matrix');
  // console.log('start successors list');
  // this.createSuccessorsList();
  // console.log('end successors list');
  // console.log('start edges list');
  // this.createEdgesList();
  // console.log('end edges list ');
  console.log(this);
};

DAG.prototype.adjacencyMatrixDFS = function () {
  let order = [];
  let stack = [];
  let vertices = Array.from(
    { length: this.adjacency_matrix.length },
    () => false
  );
  let currVertex = 0;
  while (vertices.includes(false)) {
    if (stack.length) {
      currVertex = stack.shift();
    } else {
      currVertex = vertices.indexOf(false);
    }
    if (vertices[currVertex]) continue;
    order.push(currVertex);
    vertices[currVertex] = true;
    let children = [];
    this.adjacency_matrix[currVertex].forEach((val, idx) => {
      if (val && !vertices[idx]) children.push(idx);
    });
    stack = [...children, ...stack];
  }
  console.log(order);
};

DAG.prototype.SLtestDFS = function () {
  this.SLrecursiveDFSResult = [];
  let t0 = performance.now();
  this.SLRecursiveDFS();
  let t1 = performance.now();
  console.log(this.SLrecursiveDFSResult);
  console.log('SL recursive DFS', t1 - t0, '[ms]');
  this.SLrecursiveDFSResult = [];
  t0 = performance.now();
  this.SLIterativeDFS();
  t1 = performance.now();
  console.log('SL iterative DFS', t1 - t0, '[ms]');
};

DAG.prototype.SLRecursiveDFS = function (
  vertex = 0,
  checkedVertices = Array.from(
    { length: this.successors_list.length },
    () => false
  )
) {
  checkedVertices[vertex] = true;
  this.SLrecursiveDFSResult.push(vertex);
  for (successor of this.successors_list[vertex])
    if (!checkedVertices[successor])
      this.SLRecursiveDFS(successor, checkedVertices);
  if (checkedVertices.indexOf(false) !== -1)
    this.SLRecursiveDFS(checkedVertices.indexOf(false), checkedVertices);
};

DAG.prototype.SLIterativeDFS = function () {
  let order = [];
  let stack = [];
  let vertices = Array.from(
    { length: this.successors_list.length },
    () => false
  );
  let currVertex = 0;
  while (vertices.includes(false)) {
    if (stack.length) {
      currVertex = stack.shift();
    } else {
      currVertex = vertices.indexOf(false);
    }
    if (vertices[currVertex]) continue;
    order.push(currVertex);
    vertices[currVertex] = true;
    let children = this.successors_list[currVertex].filter(
      (successor) => !vertices[successor]
    );
    stack = [...children, ...stack];
  }
  console.log(order);
};

DAG.prototype.edgesListDFS = function () {
  let order = [];
  let stack = [];
  let vertices = Array.from(
    { length: this.successors_list.length },
    () => false
  );

  let currVertex = 0;
  while (vertices.includes(false)) {
    if (stack.length) {
      currVertex = stack.shift();
    } else {
      currVertex = vertices.indexOf(false);
    }
    if (vertices[currVertex]) continue;
    order.push(currVertex);
    vertices[currVertex] = true;
    let children = this.edges_list
      .filter(
        (edge) =>
          edge.out === currVertex &&
          !vertices[edge.in] &&
          !stack.includes(edge.in)
      )
      .map((edge) => edge.in);
    stack = [...children, ...stack];
  }
  console.log(order);
};

DAG.prototype.adjacencyMatrixBFS = function () {};

DAG.prototype.successorsListBFS = function () {};

DAG.prototype.edgesListBFS = function () {};
