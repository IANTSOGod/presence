import Prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { etudiant, matiere, date } = body;

    // 1️⃣ Recherche des personnes (étudiants)
    const personnes = await Prisma.personne.findMany({
      where: etudiant
        ? {
            OR: [
              { nom: { contains: etudiant, mode: "insensitive" } },
              { prenom: { contains: etudiant, mode: "insensitive" } },
            ],
          }
        : {},
    });

    if (personnes.length === 0) {
      return NextResponse.json(
        { message: "Aucune personne correspondante" },
        { status: 409 }
      );
    }

    const idpersonnes = personnes.map((c) => c.id);

    // 2️⃣ Recherche des matières (optionnelle)
    const matieres = matiere
      ? await Prisma.matiere.findMany({
          where: { titre: matiere },
        })
      : await Prisma.matiere.findMany(); // toutes les matières si rien n'est précisé

    const idMatieres = matieres.map((m) => m.id);

    if (idMatieres.length === 0) {
      return NextResponse.json(
        { message: "Aucune matière correspondante" },
        { status: 404 }
      );
    }

    // 3️⃣ Recherche des cours selon les matières et date (si fournie)
    const targetDate = new Date(date); // la date reçue (ex : 2025-06-01T08:54:00.000Z)

    // Créer les bornes de la journée en UTC
    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const cours = await Prisma.cours.findMany({
      where: {
        id_matiere: { in: idMatieres },
        ...(date && {
          date_deb: { lte: endOfDay },
          date_fin: { gte: startOfDay },
        }),
      },
    });

    if (cours.length === 0) {
      return NextResponse.json(
        { message: "Aucun cours correspondant" },
        { status: 404 }
      );
    }

    const idCourses = cours.map((c) => c.id);

    // 4️⃣ Recherche des présences correspondantes
    const presences = await Prisma.presence.findMany({
      where: {
        id_cours: { in: idCourses },
        id_etudiant: { in: idpersonnes },
      },
      include: {
        to_course: true,
        do_presence: true,
      },
    });

    if (presences.length === 0) {
      return NextResponse.json(
        { message: "Aucune présence correspondante" },
        { status: 404 }
      );
    }

    return NextResponse.json(presences);
  } catch (error) {
    console.error("[ERREUR API PRESENCE]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
