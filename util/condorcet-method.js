const {Op} = require('sequelize');

const db = require('../util/database');

const DateInfo = db.dateInfo;
const FlightsSchedule = db.flightsSchedule;
const TempSchedule = db.tempSchedule;
const VoteOrder = db.voteOrder;

const Graph = require('../models/graph');

class CondorcetMethod {
  #preferenceMatrix;
  #names;
  #voteOrders;
  #strengths;

  constructor() {
    this.#preferenceMatrix = [];
    this.#names = [];
    this.#voteOrders = [];
    this.#strengths = [];
  }

  async createMatrix(orders, date) {
    const length = orders[0].order.split(', ').length;
    for(let i = 0; i < length; i++) {
      this.#preferenceMatrix[i] = [];
    }
    const result = await this.getVoteOrders(date);

    this.compareVotes();
    const graph = new Graph(this.#preferenceMatrix);
    this.#strengths.push(...graph.floydWarshall());
  }

  async getVoteOrders(date) {
    const reference = this;
    let voteOrders = await VoteOrder.findAll({
      where: {
        date: date
      }
    });
    
    voteOrders = voteOrders.map(elem => elem.dataValues);
    voteOrders = voteOrders.map(elem => {
      delete elem.id;
      delete elem.date;
      delete elem.createdAt;
      delete elem.updatedAt;
      return elem;
    });

    reference.#names = voteOrders[0].order.split(', ');
    reference.#voteOrders = voteOrders;
  }

  compareVotes() {
    const length = this.#names.length;
    for(let i = 0; i < length; i++) {
      for(let j = 0; j < length; j++) {
        if(i !== j) {
          let sum = 0;
          for(let k = 0; k < this.#voteOrders.length; k++) {
            const voteOrder = this.#voteOrders[k];
            const posI = voteOrder.order.indexOf(this.#names[i]);
            const posJ = voteOrder.order.indexOf(this.#names[j]);
            if(posI < posJ) sum += voteOrder.amount;
          }
          this.#preferenceMatrix[i][j] = sum;
        } else {
          this.#preferenceMatrix[i][j] = 0;
        }
      }
    }
  }

  findBetterCandidate() {
    const length = this.#strengths.length;
    for(let i = 0; i < length; i++) {
      for(let j = 0; j < length; j++) {
        if(i !== j) {
          if(this.#strengths[i][j] > this.#strengths[j][i]) this.#strengths[j][i] = 0;
          else this.#strengths[i][j] = 0;
        }
      }
    }

    const positionsOrder = [];
    for(let i = 0; i < length; i++) {
      let sum = 0;
      for(let j = 0; j < length; j++) {
        if(this.#strengths[i][j] > 0) sum++;
      }
      positionsOrder.push({
        name: i,
        value: sum
      });
    }

    positionsOrder.sort((a, b) => b.value - a.value);
    return positionsOrder.map(elem => elem.name);
  }

  getComputedOrder() {
    const indexOrder = this.findBetterCandidate();
    const result = [];
    for(let i = 0; i < indexOrder.length; i++) {
      result.push(this.#names[indexOrder[i]]);
    }
    return result;
  }
}

module.exports = {
  'CondorcetMethod': CondorcetMethod,
  'Graph': Graph
}