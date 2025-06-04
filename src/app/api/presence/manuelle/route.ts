import Prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id_user } = body;

  try {
    const now = new Date();
    const localNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const cours = await Prisma.cours.findMany({
      where: {
        date_deb: { lte: localNow },
        date_fin: { gte: localNow },
      },
    });
    if (cours.length > 0) {
      const presence = await Prisma.presence.create({
        data: {
          id_cours: cours[0].id,
          id_etudiant: id_user,
        },
      });
      if (presence) {
        return NextResponse.json(presence);
      } else {
        return new NextResponse(
          JSON.stringify({ message: "Erreur de presence" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Aucun cours disponible" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}
