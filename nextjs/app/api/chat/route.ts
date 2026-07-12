import { NextResponse } from "next/server";
import { chat } from "@/lib/ai/chat";

export async function GET() {
  const answer = await chat("Which vehicle is available for a 450kg shipment?");

  return NextResponse.json({
    success: true,
    answer,
  });
}

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const answer = await chat(question);

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}