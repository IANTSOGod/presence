import Prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const presencelist = await Prisma.presence.findMany({
    where: { is_valid: false },
    include: {
      to_course: {
        include: {
          has_matiere: true, // Inclut les infos de la matière du cours
        },
      },
      do_presence: true, // Inclut les infos de l'étudiant
    },
  });
  if (presencelist.length > 0) {
    return NextResponse.json(presencelist);
  } else {
    return new NextResponse(
      JSON.stringify({ message: "Aucune présence à confirmer" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }
}
