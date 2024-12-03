import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
  // The one who is subscribing
  subscriber: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // one to whom 'subscriber' is Subscribing
  channel: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
