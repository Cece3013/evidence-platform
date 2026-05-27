import DashboardSidebar from "@/app/components/DashboardSidebar";

export default function BeforeAfterPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-8">
        <DashboardSidebar />

        <main className="col-span-10">
          <h1 className="text-3xl font-semibold">
            Avant-Après
          </h1>

          <p className="mt-2 text-gray-500">
            Gérez vos rendus avant-après
          </p>
        </main>
      </div>
    </div>
  );
}