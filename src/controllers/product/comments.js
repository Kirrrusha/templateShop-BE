const Comments = require('../../models/comments');
const { errorHandler } = require('../../lib/util');
// const {isNull} =  require('lodash');

exports.getAll = (req, res, next) => {
  Comments.find({})
    .then(comments => res.json(comments.map(comment => transformComment(comment))))
    .catch(({ message }) => errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.getById = (req, res, next) => {
  const { id: _id } = req.params;
  Comments.findOne({ _id })
    .then(comment => res.json(transformComment(comment)))
    .catch(({ message }) => errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.create = (req, res, next) => {
  const { productId, authorId, text, rating, visible } = req.body;

  Comments.create({
    productId,
    authorId,
    text,
    rating,
    visible
  }, (err, comment) => {
    if (err) {
      return errorHandler({
        message: err
      }, next);
    }
    res.json(transformComment(comment));
  });
};

exports.update = (req, res, next) => {
  const { id: _id, authorId, productId, text, rating, visible } = req.body;
  Comments.findOne({ _id }, (err, comment) => {
    if (err) {
      return errorHandler({
        message: err
      }, next);
    }
    comment.authorId = authorId;
    comment.productId = productId;
    comment.text = text;
    comment.rating = rating;
    comment.visible = visible;
    comment
      .save()
      .then(cmt => res.json(transformComment(cmt)))
      .catch(({ message }) => errorHandler({
        message,
        statusCode: 404
      }, next));
  });
};

exports.delete = (req, res, next) => {
  const { id } = req.query;
  Comments.deleteMany({
      _id: {
        $in: id
      }
    },
    err => {
      if (err) {
        return errorHandler({
          message: err
        }, next);
      }
      res.json({ message: 'ok' });
    });
};

const transformComment = ({ _id: id, productId, authorId, text, rating, visible, updateAt: date }) =>
  ({
    id, productId, authorId, text,
    rating, visible, date
  });
