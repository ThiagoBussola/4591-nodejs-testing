import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    ISBN: { type: String, required: true },
  },
  { timestamps: true }
);

const BookModel = model("Books", bookSchema);

export default BookModel;
