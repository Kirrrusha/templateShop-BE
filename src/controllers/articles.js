const Articles = require('../models/articles');
const {errorHandler} = require('../lib/util');

exports.getAll = (req, res, next) => {
  Articles.find({})
    .then(articles => res.json(articles))
    .catch(({ message }) =>  errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.getById = (req, res, next) => {
  const {id} = req.query;
  Articles.find({_id: id})
    .then(article => res.json(article))
    .catch(({ message }) => errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.create = (req, res, next) => {
  const {name, type, optionValues} = req.body;

  Articles.create({name, type, optionValues}, (err, articles) => {
    if (err) errorHandler({
      message: err
    }, next);
    res.json(articles);
  });
};

exports.update = (req, res, next) => {
  const {id, name, text, status} = req.body;
  Articles.findOne({ _id: id }, (err, articles) => {
    if (err) errorHandler({
      message: err
    }, next);
    if (!articles) errorHandler({
      message: 'Not found',
      statusCode: 404
    }, next);
    articles.name = name;
    articles.text = text;
    articles.status = status;
    articles
      .save()
      .then(article => res.json(article))
      .catch(({ message }) => errorHandler({
        message,
        statusCode: 404
      }, next));
  })
};

exports.delete = (req, res, next) => {
  const {id} = req.query;

  Articles.deleteOne({ _id: id }, err => {
    if (err) errorHandler({
      message: err
    }, next);
    res.json({message: 'ok'});
  });
};
