import Prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id_matiere, date_deb, date_fin } = body;

  const getcours = await Prisma.cours.findMany({
    where: { date_deb: { lte: date_deb }, date_fin: { gte: date_fin } },
  });
  if (getcours.length > 0) {
    return new NextResponse(
      JSON.stringify({ message: "Un cours a déja lieu" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } else {
    try {
      const newCours = await Prisma.cours.create({
        data: {
          id_matiere: id_matiere,
          date_deb: date_deb,
          date_fin: date_fin,
        },
      });
      if (newCours) {
        return NextResponse.json(newCours);
      }
    } catch (error) {
      return NextResponse.json(error);
    }
  }
}

export async function GET() {
  try {
    const listcours = await Prisma.cours.findMany();
    return NextResponse.json(listcours);
  } catch (error) {
    return NextResponse.json(error);
  }
}
