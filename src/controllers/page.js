const Page = require('../models/page');
const { errorHandler } = require('../lib/util');

exports.getAll = async (req, res, next) => {
  try {
    const pages = await Page.find({})
      .populate({
        path: 'widgets',
        select: 'id name products',
        match: { status: { $eq: true } },
        // populate: {
        //   path: 'products',
        //   select: 'id name productId',
        //   match: { status: { $eq: true } }
        // }
      });
    await res.json(pages.map(page => page.toJSON()));
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const page = await Page.findById(id)
      .populate({
        path: 'widgets',
        select: 'id name widgets',
        match: { status: { $eq: true } }
      });
    await res.json(page.toJSON());
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.create = async (req, res, next) => {
  const { name, status, widgets } = req.body;
  try {
    const page = await Page.create({
      name,
      status,
      widgets: typeof widgets === 'string' ? widgets.split(', ') : widgets
    });
    await res.json(page.toJSON());
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.update = async (req, res, next) => {
  const { id, ...body } = req.body;
  try {
    const widgets = typeof body.widgets === 'string' ? body.widgets.split(', ') : body.widgets;
    const page = await Page.findById(id)
      .exec();
    page.name = body.name || page.name;
    page.widgets = widgets.length ? widgets : page.widgets;
    page.status = !!body.status;
    await page.save();
    await res.json(page.toJSON());
  } catch ({ message }) {
    return errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.query;
  try {
    await Page.deleteMany({ _id: { $in: id } });
    res.end();
  } catch ({ message }) {
    return errorHandler({
      message
    }, next);
  }
};
