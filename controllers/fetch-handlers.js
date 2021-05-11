const db = require('../util/database');

const DateInfo = db.dateInfo;
const FlightsSchedule = db.flightsSchedule;
const TempSchedule = db.tempSchedule;
const VoteOrder = db.voteOrder;
const VotedUser = db.votedUser;

exports.findDateInfo = async (req, res, next) => {
  const date = req.body[0].date;
  const result = await DateInfo.findByPk(date);
  if(result !== null) {
    res.json({
      existed: true,
      message: "Данные на эту дату уже внесены"
    });
    return;
  } else {
    next();
  }
}

exports.addTempFlights = (req, res, next) => {
  DateInfo.create({
    date: req.body[0].date,
    isEntered: true,
    isAvailable: true
  })
  .catch((error) => {
    console.error('Error:', error);
    res.status(500).send(error.message);
  });
  for(let i = 0; i < req.body.length; i++) {
    const date = req.body[i].date;
    const from = req.body[i].from;
    const to = req.body[i].to;
    const iataCode = req.body[i].iataCode;
    const flightNumber = req.body[i].flightNumber;
    TempSchedule.create({
      from: from,
      to: to,
      airlineId: iataCode,
      flightNumber: flightNumber,
      date: date
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).send(error.message);
    });
  }
  res.json({
    existed: false,
    message: "Данные успешно добавлены"
  });
}

exports.getTempFlights = (req, res, next) => {
  
}