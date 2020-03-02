const Articles = require('../models/articles');
const {errorHandler} = require('../lib/util');

exports.getAll = (req, res, next) => {
  Articles.find({})
    .then(articles => res.json(articles.map(article => transformArticle(article))))
    .catch(({ message }) =>  errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.getById = (req, res, next) => {
  const {id} = req.params;
  Articles.findOne({_id: id})
    .then(article => res.json(transformArticle(article)))
    .catch(({ message }) => errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.create = (req, res, next) => {
  const {name, type, optionValues} = req.body;

  Articles.create({name, type, optionValues}, (err, article) => {
    if (err) return errorHandler({
      message: err
    }, next);
    res.json(transformArticle(article));
  });
};

exports.update = (req, res, next) => {
  const {id, name, text, status} = req.body;
  Articles.findOne({ _id: id }, (err, article) => {
    if (err) return errorHandler({
      message: err
    }, next);
    article.name = name;
    article.text = text;
    article.status = status;
    article
      .save()
      .then(article => res.json(transformArticle(article)))
      .catch(({ message }) => errorHandler({
        message,
        statusCode: 404
      }, next));
  })
};

exports.delete = (req, res, next) => {
  const {id} = req.params;

  Articles.deleteOne({ _id: id }, err => {
    if (err) return errorHandler({
      message: err
    }, next);
    res.json({message: 'ok'});
  });
};

const transformArticle = ({ _id: id, name, text, status }) => ({ id, name, text, status });
