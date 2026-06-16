import DashboardSidebar from "@/app/components/DashboardSidebar";
import Link from "next/link";
const projects = [
  {
    id: 1,
    title: "Appartement Haussmannien",
    city: "Paris 16",
    status: "Livré",
    photos: 12,
    updated: "Aujourd’hui",
  },
  {
    id: 2,
    title: "Villa Contemporaine",
    city: "Cannes",
    status: "En cours",
    photos: 8,
    updated: "Hier",
  },
  {
    id: 3,
    title: "Loft Urbain",
    city: "Lyon",
    status: "Retouche demandée",
    photos: 5,
    updated: "Il y a 2 jours",
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
                Retrouvez l’ensemble de vos projections immobilières et suivis de projets.
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
                <div className="space-y-6 p-6">

                  <div className="grid grid-cols-2 gap-4">

                    <div className="rounded-2xl bg-[#faf6ef] p-4">
                      <p className="text-sm text-gray-500">
                        Photos transmises
                      </p>

                      <p className="mt-2 text-2xl font-semibold">
                        {project.photos}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#faf6ef] p-4">
                      <p className="text-sm text-gray-500">
                        Dernière mise à jour
                      </p>

                      <p className="mt-2 text-lg font-medium">
                        {project.updated}
                      </p>
                    </div>

                  </div>

                  <div className="rounded-2xl border border-[#efe6d8] bg-[#fcfaf7] p-5">
                    <p className="text-sm leading-relaxed text-gray-600">
                      Projection immobilière réalisée selon la signature visuelle
                      Evidence, avec une mise en valeur réaliste et cohérente du bien.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link
  href={`/projects/${project.id}`}
  className="flex-1 rounded-2xl border border-[#d8c5a2] px-4 py-3 text-center text-sm font-medium"
>
  Voir projet
</Link>

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