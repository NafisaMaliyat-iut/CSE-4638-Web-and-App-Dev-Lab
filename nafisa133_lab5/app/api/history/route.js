import connectMongoDB from "@/libs/mongodb";
import historyModel from "@/models/history.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();

    const history = await historyModel.aggregate([
      {
        $project: {
          _id: 1,
          quizId: 1,
          latestScore: { $arrayElemAt: ["$scores", -1] },
        },
      },
    ]);
    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  const { quizId, score } = await request.json();
  console.log({ quizId, score });

  try {
    await connectMongoDB();
    let historyItem = await historyModel.findOne({ quizId });
    if (historyItem) {
      historyItem.scores.push(score);
      await historyItem.save();
    } else {
      historyItem = new historyModel({ quizId, scores: [score] });
      await historyItem.save();
    }

    return NextResponse.json({
      status: 201,
      body: { message: "History updated successfully" },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: { message: "Internal Server Error" },
    });
  }
}
