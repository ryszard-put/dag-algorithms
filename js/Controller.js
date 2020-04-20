class Controller {
  constructor(graph) {
    this.graph = graph;
    this.graph.bindController(this);
  }
}
