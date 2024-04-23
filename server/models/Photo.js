const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  locationId: { type: Schema.Types.ObjectId, ref: "Location", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Photo", photoSchema);
