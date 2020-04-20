class DAG {
  constructor(adjacency_matrix) {
    this.adjacency_matrix = adjacency_matrix;
    this.createAdjacencyList();
    this.createEdgeList();
  }

  bindController(controller) {
    this.controller = controller;
  }
}

DAG.prototype.createAdjacencyList = function () {
  let list = [];
  this.adjacency_matrix.forEach((vertex) => {
    let successors = [];
    vertex.forEach((successor, c_idx) => {
      if (successor) successors.push(c_idx);
    });
    list.push(successors.length ? successors : null);
  });
  this.adjacency_list = [...list];
};

DAG.prototype.createEdgeList = function () {
  let list = [];
  this.adjacency_list.forEach((successors, from /*out index*/) => {
    if (successors) {
      successors.forEach((to /*in index*/) => {
        if (to) {
          list.push({ out: from, in: to });
        }
      });
    }
  });
  this.edge_list = [...list];
};
