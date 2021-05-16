class Graph {
  #size;
  #matrix;
  #graph;

  constructor(graph) {
    this.#graph = graph;
    this.#matrix = [];
    this.#size = graph.length;
  }
    
  floydWarshall() {
    for(let i = 0; i < this.#size; i++) {
      this.#matrix[i] = [];
    }
    let i, j, k;

    for (i = 0; i < this.#size; i++) {
      for (j = 0; j < this.#size; j++) {
        this.#matrix[i][j] = this.#graph[i][j];
      }
    }
    
    for (k = 0; k < this.#size; k++) {
      for (i = 0; i < this.#size; i++) {
        for (j = 0; j < this.#size; j++) {
          if(i !== j) this.#matrix[i][j] = Math.max(this.#matrix[i][j], Math.min(this.#matrix[i][k], this.#matrix[k][j]));
        }
      }
    }
    return this.#matrix;
  }
}

module.exports = Graph;