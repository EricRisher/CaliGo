const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  locationId: { type: Schema.Types.ObjectId, ref: "Location", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);