import mongoose from 'mongoose';

const { Schema } = mongoose;

const historySchema = new Schema({
  quizId: {
    type: String,
    required: true
  },
  scores: {
    type: [String], 
    default: [] 
  }
});

export default mongoose.models.History || mongoose.model('History', historySchema);
