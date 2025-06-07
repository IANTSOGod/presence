import { firstday } from "@/lib/firstday";
import { lastday } from "@/lib/lastday";
import Prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id_matiere, period } = body;

  const start = firstday(); // { debutSemaine, debutMois, debutSemestre }
  const end = lastday(); // { finSemaine, finMois, finSemestre }

  try {
    if (id_matiere) {
      if (period === "semaine") {
        // 1. Récupérer les cours de la semaine pour cette matière
        const coursSemaine = await Prisma.cours.findMany({
          where: {
            id_matiere: id_matiere,
            date_deb: { gte: start.debutSemaine },
            date_fin: { lte: end.finSemaine },
          },
        });
        // 2. Extraire les IDs de cours
        const idsCours = coursSemaine.map((c) => c.id);
        // 3. Récupérer les présences associées à ces cours
        const presences = await Prisma.presence.findMany({
          where: {
            id_cours: { in: idsCours },
            is_valid: true,
          },
        });
        return NextResponse.json({ presences });
      } else if (period === "mois") {
        // 1. Récupérer les cours du mois pour cette matière
        const coursMois = await Prisma.cours.findMany({
          where: {
            id_matiere: id_matiere,
            date_deb: { gte: start.debutMois },
            date_fin: { lte: end.finMois },
          },
        });
        // 2. Extraire les IDs de cours
        const idsCours = coursMois.map((c) => c.id);
        // 3. Récupérer les présences associées à ces cours
        const presences = await Prisma.presence.findMany({
          where: {
            id_cours: { in: idsCours },
          },
        });
        return NextResponse.json({ presences });
      } else if (period === "semestre") {
        const coursSemestre = await Prisma.cours.findMany({
          where: {
            id_matiere: id_matiere,
            date_deb: { gte: start.debutSemestre },
            date_fin: { lte: end.finSemestre },
          },
        });
        // 2. Extraire les IDs de cours
        const idsCours = coursSemestre.map((c) => c.id);
        // 3. Récupérer les présences associées à ces cours
        const presences = await Prisma.presence.findMany({
          where: {
            id_cours: { in: idsCours },
            is_valid: true,
          },
        });
        return NextResponse.json({ presences });
      }
    } else {
      if (period === "semaine") {
        const coursSemaine = await Prisma.cours.findMany({
          where: {
            date_deb: { gte: start.debutSemaine },
            date_fin: { lte: end.finSemaine },
          },
        });
        // 2. Extraire les IDs de cours
        const idsCours = coursSemaine.map((c) => c.id);
        // 3. Récupérer les présences associées à ces cours
        const presences = await Prisma.presence.findMany({
          where: {
            id_cours: { in: idsCours },
            is_valid: true,
          },
        });
        return NextResponse.json({ presences });
      } else if (period === "mois") {
        // 1. Récupérer les cours du mois pour cette matière
        const coursMois = await Prisma.cours.findMany({
          where: {
            date_deb: { gte: start.debutMois },
            date_fin: { lte: end.finMois },
          },
        });
        // 2. Extraire les IDs de cours
        const idsCours = coursMois.map((c) => c.id);
        // 3. Récupérer les présences associées à ces cours
        const presences = await Prisma.presence.findMany({
          where: {
            id_cours: { in: idsCours },
            is_valid: true,
          },
        });
        return NextResponse.json({ presences });
      } else if (period === "semestre") {
        const coursSemestre = await Prisma.cours.findMany({
          where: {
            date_deb: { gte: start.debutSemestre },
            date_fin: { lte: end.finSemestre },
          },
        });
        const idsCours = coursSemestre.map((c) => c.id);
        const presences = await Prisma.presence.findMany({
          where: {
            id_cours: { in: idsCours },
            is_valid: true,
          },
        });

        return NextResponse.json(presences);
      }
    }
  } catch (error) {
    console.error("Erreur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
