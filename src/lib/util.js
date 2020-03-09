/**  Creates a callback that proxies node callback style arguments to an Express Response object.
 *  @param {express.Response} res  Express HTTP Response
 *  @param {number} [status=200]  Status code to send on success
 *
 *  @example
 *    list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
exports.toRes = function toRes(res, status = 200) {
  return (err, thing) => {
    if (err) {
      return res.status(500)
        .send(err);
    }

    if (thing && typeof thing.toObject === 'function') {
      thing = thing.toObject();
    }
    res.status(status)
      .json(thing);
  };
};

exports.asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

exports.errorHandler = ({ message, statusCode = 500 }, next) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return next(err);
};

exports.transformResponse = ({ _id: id, ...body }) => ({ id, ...body });

exports.autoIncremental = async function (model, data, next) {
  if (data.isNew) {
    let total = await model.find()
      .sort({ id: -1 })
      .limit(1);
    data.id = total.length === 0 ? 1 : Number(total[0].id) + 1;
    next();
  }
};
