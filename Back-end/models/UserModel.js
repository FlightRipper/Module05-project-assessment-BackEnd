import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
   username: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
});

UserSchema.pre('save', async function(next) {
 try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
 } catch (err) {
    return next(err);
 }
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
