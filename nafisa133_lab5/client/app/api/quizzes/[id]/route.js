import connectMongoDB from "@/libs/mongodb";
import quizModel from "@/models/quiz.model";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        if (!params || !params.id) {
            return NextResponse.json({ message:"Quiz ID missing" }, { status: 500 });
        }

        const { id } = params;
        await connectMongoDB();
        const quiz = await quizModel.findOne({ _id: id });
        if (!quiz) {
            return NextResponse.json({ message:"Quiz not found" }, { status: 400 });
        }
        return NextResponse.json({ quizName: quiz.quizName, questions:quiz.questions }, { status: 200 });
    } catch (error) {
        return NextResponse.error({ message: "Error fetching quiz: " }, { status: 400 });
    }
}
