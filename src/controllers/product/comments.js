const Comment = require('../../models/comment');
const { errorHandler } = require('../../lib/util');

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

exports.getByProductId = async (req, res, next) => {
  const { id: productId } = req.params;
  try {
    const comments = await Comment.find({productId });
    await res.json(comments.map(comment => comment.toJSON()));
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 404
    }, next);
  }
};

exports.create = async (req, res, next) => {
  const { productId, authorId, text, rating, visible } = req.body;
  try {
    const comment = await Comment.create({
      productId,
      authorId,
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
  const { id, authorId, productId, text, rating, visible } = req.body;
  try {
    const comment = await Comment.findById(id)
      .exec();
    comment.authorId = authorId;
    comment.productId = productId;
    comment.text = text;
    comment.rating = rating;
    comment.visible = visible;
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
