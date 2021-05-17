import FlightTemplate from './flight-template.js';

export default class Flight extends FlightTemplate {
  #departureTime;
  #arrivalTime;

  constructor(date, from, to, iataCode, flightNumber, departureTime, arrivalTime) {
    super(date, from, to, iataCode, flightNumber);
    this.#departureTime = departureTime;
    this.#arrivalTime = arrivalTime;
  }

  toJSON() {
    const json = super.toJSON();
    json.departureTime = this.#departureTime;
    json.arrivalTime = this.#arrivalTime;
    return json;
  }
};