"use client";
import AppSidebar from "@/components/custom/Appsidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface docourseInterface {
  id: string;
  date_deb: string;
  date_fin: string;
  id_matiere: string;
}
interface docourseInterface2 {
  id: string;
  date_deb: string;
  date_fin: string;
  id_matiere: string;
  has_matiere: hasmatiere;
}
interface hasmatiere {
  id: string;
  titre: string;
}
interface dopresence {
  id: string;
  nom: string;
  prenom: string;
  mdp: string;
  email: string;
  role: string;
}
interface presenceInterface {
  to_course: docourseInterface;
  do_presence: dopresence;
  id: string;
  id_cours: string;
  id_etudiant: string;
  is_valid: Boolean;
}
interface presenceInterface2 {
  to_course: docourseInterface2;
  do_presence: dopresence;
  id: string;
  id_cours: string;
  id_etudiant: string;
  is_valid: Boolean;
}
interface matierelistInterface {
  id: string;
  titre: string;
}

interface historiqueInterface {
  etudiant?: string;
  matiere?: string;
  date?: Date;
}

export default function Page() {
  const [isfiltered, setisfiltered] = useState(false);
  const [data, setdata] = useState<historiqueInterface>();
  const [presencetable, setpresencetable] = useState<presenceInterface[]>();
  const [allpresence, setallpresence] = useState<presenceInterface2[]>();
  const [matierelist, setmatierelist] = useState<matierelistInterface[]>();
  const [selectedmatiere, setselectedmatiere] =
    useState<string>("Communication");
  const [date, setDate] = useState<Date>(); // ✅ Valeur initiale undefined
  const [selectedstudent, setselectedstudent] = useState<string>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isoDate;
    if (data?.date) {
      const dateInMadagascar = new Date(
        data.date.getTime() - data.date.getTimezoneOffset() * 60000
      );
      dateInMadagascar.setHours(dateInMadagascar.getHours() + 3);
      isoDate = dateInMadagascar.toISOString();
    }
    console.log(isoDate);
    console.log(data);
    const response = await fetch("http://localhost:3000/api/presence/history", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        etudiant: data?.etudiant,
        matiere: data?.matiere,
        date: isoDate,
      }),
    });
    if (response.ok) {
      const result = await response.json();
      const finaldata = result as presenceInterface[];
      setpresencetable(finaldata);
    } else {
      setpresencetable([]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setselectedstudent(e.target.value);
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setdata((prev) => ({ ...prev, matiere: selectedmatiere }));
  }, [selectedmatiere]);

  useEffect(() => {
    if (date) {
      setdata((prev) => ({ ...prev, date: new Date(date) }));
    }
  }, [date]);

  useEffect(() => {
    const handlematiere = async () => {
      const response = await fetch(
        "http://localhost:3000/api/matiere/getlist",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setmatierelist(result as matierelistInterface[]);
      }
    };
    const handleAllpres = async () => {
      const response = await fetch("http://localhost:3000/api/presence/liste", {
        method: "GET",
      });
      if (response.ok) {
        const result = await response.json();
        setallpresence(result as presenceInterface2[]);
      }
    };
    handlematiere();
    handleAllpres();
  }, []);

  return (
    <div className="flex">
      <AppSidebar />
      <div className="m-0 w-full bg-slate-50 h-[800px] border-gray border-2">
        <h1 className="ml-10 text-red-600 text-md mt-10">
          Consultation historique
        </h1>
        <Label className="text-gray-400 ml-10 mt-2">
          Consultez et filtrez l'historique de présence
        </Label>

        <form className="md:flex mt-20 w-full mx-auto" onSubmit={handleSubmit}>
          <div className="ml-30">
            <Label>Nom Etudiant</Label>
            <Input
              className="mt-5 w-[250px]"
              placeholder="Entrez un nom ou prenom"
              name="etudiant"
              onChange={handleChange}
            />
          </div>
          <div className="ml-20">
            <Label>Matière</Label>
            <Select
              onValueChange={(value) => setselectedmatiere(value)}
              defaultValue={selectedmatiere}
            >
              <SelectTrigger className="w-[250px] bg-white mt-5">
                <SelectValue placeholder="Sélectionnez une matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Matières</SelectLabel>
                  {matierelist?.map((item, index) => (
                    <SelectItem value={item.titre} key={index}>
                      {item.titre}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-20">
            <Label>Calendrier</Label>
            <Popover>
              <PopoverTrigger asChild className="mt-5">
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-slate-200 focus:border-blue-500",
                    !date && "text-slate-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date
                    ? new Date(date).toLocaleDateString()
                    : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="ml-20">
            <Button
              className="w-[250px] bg-blue-500 text-white mt-8"
              type="submit"
              onClick={() => {
                setisfiltered(true);
              }}
            >
              Filtrer
            </Button>
          </div>
        </form>

        <div>
          {isfiltered ? (
            presencetable && presencetable.length > 0 ? (
              presencetable.map((presence) => (
                <Card key={presence.id} className="mx-20 mt-10 h-[150px]">
                  <CardTitle className="text-xl text-blue-500 ml-5">
                    {presence.do_presence.nom} {presence.do_presence.prenom}
                  </CardTitle>
                  <CardContent className="flex">
                    <Label>{selectedmatiere}</Label>
                    <Label className="ml-auto">
                      {presence.is_valid ? (
                        <Badge variant={"secondary"}>Présent</Badge>
                      ) : (
                        <Badge variant={"destructive"}>Absent</Badge>
                      )}
                    </Label>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500 text-lg italic">
                  Aucun résultat trouvé
                </p>
              </div>
            )
          ) : (
            allpresence?.map((presence) => (
              <Card key={presence.id} className="mx-20 mt-10 h-[150px]">
                <CardTitle className="text-xl text-blue-500 ml-5">
                  {presence.do_presence.nom} {presence.do_presence.prenom}
                </CardTitle>
                <CardContent className="flex">
                  <Label>{presence.to_course.has_matiere.titre}</Label>
                  <Label className="ml-auto">
                    {presence.is_valid ? (
                      <Badge variant={"secondary"}>Présent</Badge>
                    ) : (
                      <Badge variant={"destructive"}>Absent</Badge>
                    )}
                  </Label>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
