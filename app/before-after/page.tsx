import DashboardSidebar from "@/app/components/DashboardSidebar";

const comparisons = [
  {
    id: 1,
    title: "Appartement Haussmannien",
    city: "Paris 16",
  },
  {
    id: 2,
    title: "Villa Contemporaine",
    city: "Cannes",
  },
  {
    id: 3,
    title: "Studio Urbain",
    city: "Lyon",
  },
];

export default function BeforeAfterPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1f1f]">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-8">

        {/* SIDEBAR */}
        <DashboardSidebar />

        {/* CONTENT */}
        <main className="col-span-10 space-y-8">

          {/* HEADER */}
          <section className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">
                Avant / Après
              </h1>

              <p className="mt-2 text-gray-500">
                Comparez les projections immobilières réalisées pour chaque bien.
              </p>
            </div>

            <button className="rounded-2xl bg-[#b88a44] px-6 py-4 text-sm font-medium text-white shadow-lg transition hover:opacity-90">
              Nouveau comparatif
            </button>
          </section>

          {/* COMPARISON GRID */}
          <section className="space-y-8">

            {comparisons.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-[36px] bg-white shadow-sm"
              >

                {/* IMAGES */}
                <div className="grid grid-cols-2">

                  {/* BEFORE */}
                  <div className="relative h-[420px] bg-[#d9cfbf]">

                    <div className="absolute left-5 top-5 rounded-full bg-black/70 px-4 py-2 text-sm text-white backdrop-blur-sm">
                      Avant
                    </div>

                  </div>

                  {/* AFTER */}
                  <div className="relative h-[420px] bg-[#cdbda7]">

                    <div className="absolute left-5 top-5 rounded-full bg-[#233124] px-4 py-2 text-sm text-white">
                      Projection Evidence
                    </div>

                  </div>

                </div>

                {/* CONTENT */}
                <div className="flex items-center justify-between p-8">

                  <div>
                    <h2 className="text-2xl font-semibold">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-gray-500">
                      {item.city}
                    </p>
                  </div>

                  <div className="flex gap-3">

                    <button className="rounded-2xl border border-[#d8c5a2] px-5 py-3 text-sm font-medium">
                      Voir le projet
                    </button>

                    <button className="rounded-2xl bg-[#233124] px-5 py-3 text-sm font-medium text-white">
                      Télécharger
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </section>

        </main>
      </div>
    </div>
  );
}