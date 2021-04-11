exports.userBoard = (req, res) => {
  res.status(200).send("Вы авторизовались в качестве обычного пользователя.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Вы авторизовались в качестве администратора.");
};