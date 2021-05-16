export default class FlightTemplate {
  #date;
  #from;
  #to;
  #iataCode;
  #flightNumber;

  constructor(date, from, to, iataCode, flightNumber) {
    this.#date = date;
    this.#from = from;
    this.#to = to;
    this.#iataCode = iataCode;
    this.#flightNumber = flightNumber;
  }

  toJSON() {
    return {
      date: this.#date,
      from: this.#from,
      to: this.#to,
      iataCode: this.#iataCode,
      flightNumber: this.#flightNumber
    }
  }
}