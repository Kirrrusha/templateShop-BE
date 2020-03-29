const Comment = require('../models/comment');
const { errorHandler } = require('../lib/util');

exports.getAll = async (req, res, next) => {
  try {
    const comments = await Comment.find({});
    await res.json(comments.map(comment => comment.toJSON()));
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 404
    }, next);
  }
};

exports.getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    await res.json(comment.toJSON());
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 404
    }, next);
  }
};

exports.getCommentsByProductId = async (req, res, next) => {
  const { id: author } = req.params;
  try {
    const comments = await Comment.find({author}).exec();
    await res.json(comments.map(comment => comment.toJSON()));
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 404
    }, next);
  }
};

exports.create = async (req, res, next) => {
  const { product, author, text, rating, visible } = req.body;
  try {
    const comment = await Comment.create({
      product,
      author,
      text,
      rating,
      visible
    });
    await res.json(comment.toJSON());
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 404
    }, next);
  }
};

exports.update = async (req, res, next) => {
  const { id, ...body } = req.body;
  try {
    const comment = await Comment.findById(id)
      .exec();
    comment.author = body.author || comment.author;
    comment.product = body.product || comment.product;
    comment.text = body.text || comment.text;
    comment.rating = body.rating || comment.rating;
    comment.visible = body.visible || comment.visible;
    await comment.save();
    await res.json(comment.toJSON());
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 404
    }, next);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.query;
  try {
    await Comment.deleteMany({ _id: { $in: id } });
    res.end();
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 404
    }, next);
  }
};
