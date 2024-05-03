import connectMongoDB from "@/libs/mongodb";
import quiz from "@/models/quiz.model";
import { NextResponse } from "next/server";

export async function POST(request){
  const {quizName, questions} = await request.json();
  console.log(quizName, questions)
  await connectMongoDB();
  await quiz.create({quizName, questions})
  return NextResponse.json({message : "Quiz created successfully"}, {status:201})
}

export async function GET(){
  await connectMongoDB();
  const quizzes = await quiz.find();
  return NextResponse.json({quizzes})
}


