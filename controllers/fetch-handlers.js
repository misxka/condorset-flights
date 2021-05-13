const {Op} = require('sequelize');

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

exports.getEnteredDates = (req, res, next) => {
  DateInfo.findAll({
    where: {
      isAvailable: true
    }
  })
  .then(dates => {
    dates = dates.map(elem => elem.dataValues.date);
    res.json(dates);
  })
}

exports.getTempFlights = (req, res, next) => {
  TempSchedule.findAll({
    where: {
      date: req.body.date
    }
  })
  .then(flights => {
    flights = flights.map(elem => elem.dataValues);
    flights = flights.map(elem => {
      delete elem.date;
      delete elem.createdAt;
      delete elem.updatedAt;
      return elem;
    });
    res.json(flights);
  })
}

exports.addVotes = (req, res, next) => {
  let order = '';
  req.body.sort((a, b) => a.rate - b.rate);

  for(let i = 0; i < req.body.length; i++) {
    if(i !== 0) order += ', ';
    order += req.body[i].flightName;
  }

  VoteOrder.findOrCreate({
    where: {
      order: order
    },
    defaults: {
      date: req.body[0].date,
      order: order,
      amount: 1
    }
  })
  .then(results => {
    if(!results[1]) {
      results[0].increment('amount');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    res.status(500).send(error.message);
  });
}

exports.checkVotedUsers = (req, res, next) => {
  VotedUser.findOrCreate({
    where: {
      [Op.and]: [
        {userId: req.userId},
        {date: req.body.date}
      ]
    },
    defaults: {
      userId: req.userId,
      date: req.body.date
    }
  })
  .then(results => {
    if(results[1]) {
      res.json({
        hasVoted: false
      });
    } else {
      res.json({
        hasVoted: true
      });
    }
  })
  .catch(err => {
    console.error('Error:', err);
  });
}

exports.getVotesStats = (req, res, next) => {
  VoteOrder.findAll({
    where: {
      date: req.body.date
    }
  })
  .then(results => {
    results = results.map(elem => elem.dataValues);
    results = results.map(elem => {
      delete elem.id;
      delete elem.date;
      delete elem.createdAt;
      delete elem.updatedAt;
      return elem;
    });
    res.json(results);
  });
}