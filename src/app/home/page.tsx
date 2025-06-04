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
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
interface matierelistInterface {
  id: string;
  titre: string;
}
export default function page() {
  const [matierelist, setmatierelist] = useState<matierelistInterface[]>();
  const [selectedmatiere, setselectedmatiere] =
    useState<string>("Communication");
  const [date, setDate] = useState<Date>();
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
    handlematiere();
  }, []);

  return (
    <div className="flex">
      <AppSidebar></AppSidebar>
      <div className="m-0 w-full bg-slate-50 h-[800px] border-gray border-2">
        <h1 className="ml-10 text-red-600 text-md mt-10">
          Consultation historique
        </h1>
        <Label className="text-gray-400 ml-10 mt-2">
          Consultez et filtrez l'historique de présence
        </Label>
        <form className="flex mt-20 w-full mx-auto">
          <div className="ml-30">
            <Label>Nom Etudiant</Label>
            <Input
              className="mt-5 w-[250px]"
              placeholder="Entrez un nom ou prenom"
            ></Input>
          </div>
          <div className="ml-20">
            <Label>Matière</Label>
            <Select
              onValueChange={(value) => setselectedmatiere(value)}
              defaultValue={selectedmatiere}
            >
              <SelectTrigger className="w-[250px] bg-white mt-5">
                <SelectValue placeholder="Select a ticker" />
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
              <PopoverTrigger asChild className="mt-5 ">
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-slate-200 focus:border-blue-500",
                    !date && "text-slate-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date
                    ? format(date, "PPP", { locale: fr })
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
        </form>
      </div>
    </div>
  );
}
