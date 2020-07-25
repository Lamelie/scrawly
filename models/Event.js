var mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  dates: [{ type: Date }],
  persons: [
    {
      email: { type: String },
      fullName: { type: String },
      dates: [{ type: Date }]
    }
  ],
  user:  {type: mongoose.Schema.Types.ObjectId, ref:'User'}
});

module.exports = mongoose.model("Event", eventSchema)