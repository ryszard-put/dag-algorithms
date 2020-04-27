class DAG {
  constructor() {
    this.empty = true;
    this.adjacency_matrix = [];
    this.successors_list = [];
    this.edges_list = [];
    this.results = {
      AM: {
        DFS: { result: [], time: 0 },
        BFS: { result: [], time: 0 },
        sort1: { result: [], time: 0 },
        sort2: { result: [], time: 0 },
      },
      SL: {
        DFS: { result: [], time: 0 },
        BFS: { result: [], time: 0 },
        sort1: { result: [], time: 0 },
        sort2: { result: [], time: 0 },
      },
      EL: {
        DFS: { result: [], time: 0 },
        BFS: { result: [], time: 0 },
        sort1: { result: [], time: 0 },
        sort2: { result: [], time: 0 },
      },
    };
  }

  bindController(controller) {
    this.controller = controller;
  }

  clearGraph() {
    this.empty = true;
    this.adjacency_matrix = [];
    this.successors_list = [];
    this.edges_list = [];
    this.results = {
      AM: {
        DFS: { result: [], time: 0 },
        BFS: { result: [], time: 0 },
        sort1: { result: [], time: 0 },
        sort2: { result: [], time: 0 },
      },
      SL: {
        DFS: { result: [], time: 0 },
        BFS: { result: [], time: 0 },
        sort1: { result: [], time: 0 },
        sort2: { result: [], time: 0 },
      },
      EL: {
        DFS: { result: [], time: 0 },
        BFS: { result: [], time: 0 },
        sort1: { result: [], time: 0 },
        sort2: { result: [], time: 0 },
      },
    };
  }

  logGraph() {
    console.log(this);
  }

  resetResults(repr, alg) {
    this.results[repr][alg] = {
      result: [],
      time: 0,
    };
  }
}

DAG.prototype.createGraphFromUserInput = function (matrix) {
  this.adjacency_matrix = [...matrix];
  this.createSuccessorsList();
  this.createEdgesList();
  this.empty = false;
  this.logGraph();
};

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
        list.push({ out: from, in: to });
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

  this.empty = false;
  this.logGraph();
};

// -------------------- DFS -------------------

DAG.prototype.AM_DFS = function (
  vertex = 0,
  visited = Array.from({ length: this.adjacency_matrix.length }, () => false)
) {
  visited[vertex] = true;
  this.results.AM.DFS.result.push(vertex);
  let successors = [];
  this.adjacency_matrix[vertex].forEach((value, v) => {
    if (value === 1) successors.push(v);
  });
  for (const successor of successors)
    if (!visited[successor]) this.AM_DFS(successor, visited);
  if (visited.includes(false)) this.AM_DFS(visited.indexOf(false), visited);
};

DAG.prototype.SL_DFS = function (
  vertex = 0,
  visited = Array.from({ length: this.successors_list.length }, () => false)
) {
  visited[vertex] = true;
  this.results.SL.DFS.result.push(vertex);
  for (const successor of this.successors_list[vertex])
    if (!visited[successor]) this.SL_DFS(successor, visited);
  if (visited.includes(false)) this.SL_DFS(visited.indexOf(false), visited);
};

DAG.prototype.EL_DFS = function (vertex = 0, visited = []) {
  // tworzenie tablicy visited w pierwszym wywołaniu
  if (!visited.length) {
    this.edges_list.forEach((edge) => {
      visited[edge.out] = false;
      visited[edge.in] = false;
    });
  }

  visited[vertex] = true;
  this.results.EL.DFS.result.push(vertex);

  let successors = [];
  this.edges_list.forEach((edge) => {
    if (edge.out === vertex && !visited[edge.in]) successors.push(edge.in);
  });

  for (const successor of successors)
    if (!visited[successor]) this.EL_DFS(successor, visited);
  if (visited.includes(false)) this.EL_DFS(visited.indexOf(false), visited);
};

// -------------------- BFS ---------------------

DAG.prototype.AM_BFS = function (current = 0) {
  let order = [];
  let stack = [];
  let visited = Array.from(
    { length: this.adjacency_matrix.length },
    () => false
  );

  visited[current] = true;
  order.push(current);
  stack.push(current);
  while (stack.length /*&& visited.includes(false)*/) {
    current = stack.pop();
    let successors = this.adjacency_matrix[current];
    successors.forEach((value, v_idx) => {
      if (value === 1) {
        if (!visited[v_idx]) {
          visited[v_idx] = true;
          order.push(v_idx);
          stack.push(v_idx);
        }
      }
    });
    if (!stack.length && visited.includes(false)) {
      let x = visited.indexOf(false);
      visited[x] = true;
      order.push(x);
      stack.push(x);
    }
  }
  this.results.AM.BFS.result = order;
};

DAG.prototype.SL_BFS = function (current = 0) {
  let order = [];
  let stack = [];
  let visited = Array.from(
    { length: this.successors_list.length },
    () => false
  );

  visited[current] = true;
  order.push(current);
  stack.push(current);
  while (stack.length) {
    current = stack.pop();
    let successors = this.successors_list[current];
    successors.forEach((vertex) => {
      if (!visited[vertex]) {
        visited[vertex] = true;
        order.push(vertex);
        stack.push(vertex);
      }
    });
    if (!stack.length && visited.includes(false)) {
      let x = visited.indexOf(false);
      visited[x] = true;
      order.push(x);
      stack.push(x);
    }
  }
  this.results.SL.BFS.result = order;
};

DAG.prototype.EL_BFS = function (current = 0) {
  let order = [];
  let stack = [];
  let visited = [];
  this.edges_list.forEach((edge) => {
    visited[edge.out] = false;
    visited[edge.in] = false;
  });

  visited[current] = true;
  order.push(current);
  stack.push(current);

  while (stack.length) {
    current = stack.pop();
    let successors = [];
    this.edges_list.forEach((edge) => {
      if (edge.out === current && !visited[edge.in]) successors.push(edge.in);
    });
    successors.forEach((vertex) => {
      visited[vertex] = true;
      order.push(vertex);
      stack.push(vertex);
    });
    if (!stack.length && visited.includes(false)) {
      let x = visited.indexOf(false);
      visited[x] = true;
      order.push(x);
      stack.push(x);
    }
  }
  this.results.EL.BFS.result = order;
};

// -------------------- sort1 ---------------------

DAG.prototype.AM_sort1 = function () {
  let visited = Array.from({ length: this.adjacency_matrix.length }, () => 0);
  for (let i = 0; i < visited.length; i++) {
    if (!visited[i]) this.AM_sort1_top(i, visited);
  }
};

DAG.prototype.AM_sort1_top = function (v, visited) {
  visited[v] = 1;
  let successors = [];
  this.adjacency_matrix[v].forEach((value, _v) => {
    if (value === 1) successors.push(_v);
  });
  for (const successor of successors) {
    if (
      visited[successor] === 1 &&
      !this.results.AM.sort1.result.includes(successor)
    )
      return console.log('Pętla');
    if (visited[successor] === 0) this.AM_sort1_top(successor, visited);
  }
  visited[v] = 2;
  this.results.AM.sort1.result = [v, ...this.results.AM.sort1.result];
};

DAG.prototype.SL_sort1 = function () {
  let visited = Array.from({ length: this.successors_list.length }, () => 0);
  for (let i = 0; i < visited.length; i++) {
    if (!visited[i]) this.SL_sort1_top(i, visited);
  }
};

DAG.prototype.SL_sort1_top = function (v, visited) {
  visited[v] = 1;
  let successors = this.successors_list[v];
  for (const successor of successors) {
    if (
      visited[successor] === 1 &&
      !this.results.SL.sort1.result.includes(successor)
    )
      return console.log('Pętla');
    if (visited[successor] === 0) this.SL_sort1_top(successor, visited);
  }
  visited[v] = 2;
  this.results.SL.sort1.result = [v, ...this.results.SL.sort1.result];
};

DAG.prototype.EL_sort1 = function () {
  let visited = [];
  this.edges_list.forEach((edge) => {
    visited[edge.out] = 0;
    visited[edge.in] = 0;
  });
  for (let i = 0; i < visited.length; i++) {
    if (!visited[i]) this.EL_sort1_top(i, visited);
  }
};

DAG.prototype.EL_sort1_top = function (v, visited) {
  visited[v] = 1;
  let successors = [];
  this.edges_list.forEach((edge) => {
    if (edge.out === v && !visited[edge.in]) successors.push(edge.in);
  });
  for (const successor of successors) {
    if (
      visited[successor] === 1 &&
      !this.results.EL.sort1.result.includes(successor)
    )
      return console.log('Pętla');
    if (visited[successor] === 0) this.EL_sort1_top(successor, visited);
  }
  visited[v] = 2;
  this.results.EL.sort1.result = [v, ...this.results.EL.sort1.result];
};

// -------------------- sort2 ---------------------

DAG.prototype.AM_sort2 = function () {
  let inDegree = Array.from({ length: this.adjacency_matrix.length }, () => 0);
  let solution = [];

  this.adjacency_matrix.forEach((row, r_idx) => {
    row.forEach((col, c_idx) => {
      if (col === 1) inDegree[c_idx]++;
    });
  });

  while (inDegree.includes(0)) {
    let vertex = inDegree.indexOf(0);
    inDegree[vertex]--;
    solution.push(vertex);
    let successors = this.adjacency_matrix[vertex];
    successors.forEach((value, v) => {
      if (value === 1) inDegree[v]--;
    });
    if (solution.length === inDegree.length) {
      break;
    } else if (!inDegree.includes(0)) {
      break;
    }
  }
  if (solution.length === inDegree.length) {
    this.results.AM.sort2.result = solution;
  } else if (!inDegree.includes(0)) {
    this.results.AM.sort2.result = 'Cykl!!!';
  }
};

DAG.prototype.SL_sort2 = function () {
  let inDegree = Array.from({ length: this.successors_list.length }, () => 0);
  let solution = [];

  this.successors_list.forEach((v_out) => {
    v_out.forEach((v_in) => {
      inDegree[v_in]++;
    });
  });

  while (inDegree.includes(0)) {
    let vertex = inDegree.indexOf(0);
    inDegree[vertex]--;
    solution.push(vertex);
    let successors = this.successors_list[vertex];
    successors.forEach((v) => inDegree[v]--);
    if (solution.length === inDegree.length) {
      break;
    } else if (!inDegree.includes(0)) {
      break;
    }
  }
  if (solution.length === inDegree.length) {
    this.results.SL.sort2.result = solution;
  } else if (!inDegree.includes(0)) {
    this.results.SL.sort2.result = 'Cykl!!!';
  }
};

DAG.prototype.EL_sort2 = function () {
  let inDegree = [],
    solution = [];
  this.edges_list.forEach((edge) => {
    inDegree[edge.out] = 0;
    inDegree[edge.in] = 0;
  });

  this.edges_list.forEach((edge) => {
    inDegree[edge.in]++;
  });

  while (inDegree.includes(0)) {
    let vertex = inDegree.indexOf(0);
    inDegree[vertex]--;
    solution.push(vertex);

    this.edges_list.forEach((edge) => {
      if (edge.out === vertex) inDegree[edge.in]--;
    });

    if (solution.length === inDegree.length) {
      break;
    } else if (!inDegree.includes(0)) {
      break;
    }
  }
  if (solution.length === inDegree.length) {
    this.results.EL.sort2.result = solution;
  } else if (!inDegree.includes(0)) {
    this.results.EL.sort2.result = 'Cykl!!!';
  }
};
