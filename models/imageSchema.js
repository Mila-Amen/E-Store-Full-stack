import { Schema, model } from "mongoose";

const imageSchema = new Schema({
  filename: { type: String, required: true },
  data: { type: Buffer, required: true },
});
const ImageModel = model("Image", imageSchema);
export default ImageModel;
