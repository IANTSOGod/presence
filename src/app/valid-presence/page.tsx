import AppSidebar from "@/components/custom/Appsidebar";

export default function page() {
  return (
    <div className="flex">
      <AppSidebar></AppSidebar>
      <div className="m-0 w-full bg-slate-50 h-[800px] border-gray border-2">
        Hello
      </div>
    </div>
  );
}
