import { NextResponse } from "next/server";
import { BaseError } from "../errors/base.error";

export function errorHandler(error: unknown) {
  console.error("Error occurred:", error);

  if (error instanceof BaseError) {
    return NextResponse.json(error.toJSON(), { status: error.statusCode });
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        message: error.message,
        statusCode: 500,
        code: "INTERNAL_SERVER_ERROR"
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "An unexpected error occurred",
      statusCode: 500,
      code: "INTERNAL_SERVER_ERROR"
    },
    { status: 500 }
  );
} 