import connectMongoDB from "@/libs/mongodb";
import quizModel from "@/models/quiz.model";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectMongoDB();
  try {
    const count = await quizModel.countDocuments();
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Quiz created successfully" }, { status: 201 });
  }
}
