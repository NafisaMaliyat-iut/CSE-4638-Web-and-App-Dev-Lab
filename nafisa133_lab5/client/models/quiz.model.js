import mongoose from 'mongoose';

const { Schema } = mongoose;

const quizSchema = new Schema({
    quizName: String
}, {
    strict: false,
    timestamps: true
});

export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
