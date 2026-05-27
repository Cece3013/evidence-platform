import DashboardSidebar from "@/app/components/DashboardSidebar";

const projects = [
  {
    id: 1,
    title: "Appartement Haussmannien",
    city: "Paris 16",
    status: "Livré",
    style: "Contemporain Luxe",
    photos: 12,
    credits: 8,
  },
  {
    id: 2,
    title: "Villa Moderne",
    city: "Cannes",
    status: "En cours",
    style: "Minimaliste Premium",
    photos: 8,
    credits: 14,
  },
  {
    id: 3,
    title: "Loft Industriel",
    city: "Lyon",
    status: "Retouche demandée",
    style: "Élégance Urbaine",
    photos: 5,
    credits: 6,
  },
];

export default function ProjectsPage() {
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
                Mes projets
              </h1>

              <p className="mt-2 text-gray-500">
                Gérez vos projets de home staging et vos projections immobilières premium.
              </p>
            </div>

            <button className="rounded-2xl bg-[#b88a44] px-6 py-4 text-sm font-medium text-white shadow-lg transition hover:opacity-90">
              Nouveau projet
            </button>
          </section>

          {/* FILTERS */}
          <section className="flex items-center gap-4">
            <button className="rounded-2xl bg-[#233124] px-5 py-3 text-sm text-white shadow-sm">
              Tous
            </button>

            <button className="rounded-2xl border border-[#d8c5a2] bg-white px-5 py-3 text-sm">
              En cours
            </button>

            <button className="rounded-2xl border border-[#d8c5a2] bg-white px-5 py-3 text-sm">
              Livrés
            </button>

            <button className="rounded-2xl border border-[#d8c5a2] bg-white px-5 py-3 text-sm">
              Retouches
            </button>
          </section>

          {/* PROJECT GRID */}
          <section className="grid grid-cols-2 gap-6">

            {projects.map((project) => (
              <div
                key={project.id}
                className="overflow-hidden rounded-[32px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                {/* IMAGE PREVIEW */}
                <div className="relative h-64 bg-[#ddd3c1]">

                  <div className="absolute left-5 top-5 rounded-full bg-[#233124] px-4 py-2 text-xs font-medium text-white">
                    {project.status}
                  </div>

                  <div className="absolute bottom-5 left-5 rounded-2xl bg-black/70 px-4 py-3 text-white backdrop-blur-sm">
                    <p className="text-sm opacity-80">
                      {project.city}
                    </p>

                    <h2 className="text-xl font-semibold">
                      {project.title}
                    </h2>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="space-y-5 p-6">

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Style IA
                      </p>

                      <p className="mt-1 font-medium">
                        {project.style}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Photos
                      </p>

                      <p className="mt-1 font-semibold">
                        {project.photos}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#faf6ef] p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Crédits restants
                      </span>

                      <span className="font-medium">
                        {project.credits}
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8dfd2]">
                      <div className="h-full w-2/3 rounded-full bg-[#b88a44]" />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 rounded-2xl border border-[#d8c5a2] px-4 py-3 text-sm font-medium">
                      Voir projet
                    </button>

                    <button className="flex-1 rounded-2xl bg-[#233124] px-4 py-3 text-sm font-medium text-white">
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