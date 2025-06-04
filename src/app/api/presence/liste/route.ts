import Prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const listpresence = await Prisma.presence.findMany();
    if (listpresence.length > 0) {
      return NextResponse.json(listpresence);
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Aucune présence actuellement" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}
