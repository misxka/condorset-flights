const {Op} = require('sequelize');

const db = require('../util/database');

const DateInfo = db.dateInfo;
const FlightsSchedule = db.flightsSchedule;
const TempSchedule = db.tempSchedule;
const VoteOrder = db.voteOrder;
const VotedUser = db.votedUser;

const {Graph, CondorcetMethod} = require('../util/condorcet-method');

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

exports.checkStatus = async (req, res, next) => {
  const date = req.body.date;
  const result = await DateInfo.findByPk(date);
  if(result === null) {
    console.log("Ничего не найдено!");
  } else {
    if(!result.dataValues.isAvailable) {
      res.json({
        status: true
      });
    } else {
      res.json({
        status: false
      });
    }
  }
}

exports.getFinalSchedule = (req, res, next) => {
  FlightsSchedule.findAll({
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

exports.stopVoting = async (req, res, next) => {
  const date = req.body.date;
  const result = await DateInfo.findByPk(date);
  if(result === null) {
    console.log("Ничего не найдено!");
  } else {
    result.isAvailable = 0;
    result.save();
    next();
  }
}

exports.applyMethod = (req, res, next) => {
  const date = req.body.date;
  VoteOrder.findAll({
    where: {
      date: date
    }
  })
  .then(async results => {
    results = results.map(elem => elem.dataValues);
    results = results.map(elem => {
      delete elem.id;
      delete elem.date;
      delete elem.createdAt;
      delete elem.updatedAt;
      return elem;
    });
    req.body.orders = results;
    const method = new CondorcetMethod();
    const result = await method.createMatrix(req.body.orders, date);
    
    req.body.orders = method.getComputedOrder();
    next();
  });
}

exports.changeRecordsInDB = async (req, res, next) => {
  let flights = await TempSchedule.findAll({
    where: {
      [Op.and]: [
        {
          airlineId: {
            [Op.in]: req.body.orders.map(elem => elem.slice(0, 2))
          }
        },
        {
          flightNumber: {
            [Op.in]: req.body.orders.map(elem => elem.slice(2))
          }
        },
        {
          date: req.body.date
        }
      ]
    }
  });

  flights = flights.map(elem => elem.dataValues);
  flights = flights.map(elem => {
    delete elem.id;
    delete elem.date;
    delete elem.createdAt;
    delete elem.updatedAt;
    return elem;
  });

  const result = [];
  const length = req.body.orders.length;
  for(let i = 0; i < length; i++) {
    for(let j = 0; j < length; j++) {
      const flight = flights[j];
      if(req.body.orders[i] === `${flight.airlineId}${flight.flightNumber}`) result.push(flight);
    }
  }

  TempSchedule.destroy({
    where: {
      date: req.body.date
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    res.status(500).send(error.message);
  });

  for(let i = 0; i < length; i++) {
    const flight = result[i];
    TempSchedule.create({
      from: flight.from,
      to: flight.to,
      airlineId: flight.airlineId,
      flightNumber: flight.flightNumber,
      date: req.body.date
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).send(error.message);
    });
  }

  req.body.schedule = result;
  res.json({
    status: true
  });
}

exports.getClosedDates = (req, res, next) => {
  DateInfo.findAll({
    where: {
      isAvailable: false
    }
  })
  .then(dates => {
    dates = dates.map(elem => elem.dataValues.date);
    res.json(dates);
  })
}

exports.getPreFinalSchedule = (req, res, next) => {
  TempSchedule.findAll({
    where: {
      date: req.body.date
    }
  })
  .then(flights => {
    flights = flights.map(elem => elem.dataValues);
    flights = flights.map(elem => {
      delete elem.id;
      delete elem.date;
      delete elem.createdAt;
      delete elem.updatedAt;
      return elem;
    });
    res.json(flights);
  })
}