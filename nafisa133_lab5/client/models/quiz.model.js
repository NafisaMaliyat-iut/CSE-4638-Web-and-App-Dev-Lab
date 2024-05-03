import mongoose from 'mongoose';

const { Schema } = mongoose;

const quizSchema = new Schema({
    quizName: String
}, {
    strict: false
});

export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
