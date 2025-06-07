import Prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const listpresence = await Prisma.presence.findMany({
      where: { is_valid: true },
      include: {
        do_presence: true, // Inclut les infos de l'étudiant
        to_course: {
          include: {
            has_matiere: true, // Inclut les infos de la matière du cours
          },
        },
      },
    });

    if (listpresence.length > 0) {
      return NextResponse.json(listpresence);
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Aucune présence actuellement" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Erreur serveur", error }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
