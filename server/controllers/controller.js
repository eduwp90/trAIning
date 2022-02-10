const model = require('../models/model');

exports.read = async (req, res) => {
  try {
    const data = await model.find();
    res.status(200);
    res.send(data);
  } catch (e) {
    console.log('e', e);
    res.sendStatus(500);
  }
};

exports.create = async (req, res) => {
  try {
    console.log(req.body)
    const response = await model.create(req.body);
    res.status(201);
    res.send(response);
  } catch (e) {
    console.log('e', e);
    res.sendStatus(500);
  }
};

exports.update = async (req, res) => {
  try {
    // const { id, dir } = req.params;
    // const topic = await Topic.findByIdAndUpdate({
    //   _id: id
    // }, { $inc: { score: dir === "up" ? 1 : -1 } }, { new: true });
    // res.send(topic);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

exports.deleteTopic = async (req, res) => {
  try {
    // await Topic.deleteOne({ _id: req.params.id });
    // res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}