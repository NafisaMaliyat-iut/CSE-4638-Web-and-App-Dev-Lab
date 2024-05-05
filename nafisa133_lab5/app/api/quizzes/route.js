import connectMongoDB from "@/libs/mongodb";
import quiz from "@/models/quiz.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { quizName, questions } = await request.json();
  console.log(quizName, questions);
  await connectMongoDB();
  await quiz.create({ quizName, questions });
  return NextResponse.json({ message: "Quiz created successfully" }, { status: 201 });
}

export async function GET(request) {
  await connectMongoDB();
  const page = parseInt(request.nextUrl.searchParams.get("page"));
  const limit = parseInt(request.nextUrl.searchParams.get("limit"));

  const quizzes = await quiz.find({}, { quizName: 1 }).skip((page - 1) * limit).limit(limit);

  const quizzesWithPage = quizzes.map((quiz) => ({
    _id: quiz._id,
    quizName: quiz.quizName,
    page: page,
  }));

  return NextResponse.json({ quizzes: quizzesWithPage }, { status: 200 });
}
