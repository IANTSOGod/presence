import Prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { is_valid, id_presence } = body;
  try {
    if (is_valid) {
      const presence = await Prisma.presence.update({
        data: {
          is_valid: is_valid,
        },
        where: {
          id: id_presence,
        },
      });
      if (presence) {
        return NextResponse.json(presence);
      }
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}
