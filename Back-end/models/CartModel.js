import mongoose from 'mongoose';
const { Schema } = mongoose;
import User from "./UserModel";

const cartItemSchema = new Schema({
   product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
   },
   quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1']
   }
});

const cartSchema = new Schema({
   owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   items: [cartItemSchema],
   totalPrice: {
      type: Number,
      default: 0
   }
}, {
 timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
