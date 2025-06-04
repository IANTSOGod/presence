import Image from "next/image";
import Logo from "@/app/assets/logomisa-removebg-preview.png";
export default function Header() {
  return (
    <header className="w-full h-[60px] pl-20 pr-20 border-gray-200 border-b-2 shadow-md">
      <div className=" mt-5 flex gap-x-8">
        <Image src={Logo} alt="" className="w-10 h-10"></Image>
        <h2 className="mt-2 text-red-600">MIT Presence App</h2>
      </div>
    </header>
  );
}
