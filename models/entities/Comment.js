const { Schema, model, Types: {ObjectId } } = require("mongoose");

const commentsSchema = new Schema({
  owner: {
    type: ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isReply: {
    type: Boolean,
    default: false,
  },
  parent: {
    type: ObjectId,
    ref: "Comment",
  },
  logTime: {
    type: Date,
    required: true,
  },
  reactions: {
    type: [ObjectId],
    default: [],
  },
});

const Comment = model("Comment", commentsSchema);

module.exports = Comment;