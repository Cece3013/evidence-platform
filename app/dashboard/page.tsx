export default function RealEstateStagingDashboard() {
  const projects = [
    {
      id: 1,
      property: "Appartement Lyon",
      status: "En cours",
      photos: 6,
      remaining: 24,
    },
    {
      id: 2,
      property: "Maison Bordeaux",
      status: "Livré",
      photos: 8,
      remaining: 22,
    },
    {
      id: 3,
      property: "Villa Cannes",
      status: "Retouche demandée",
      photos: 4,
      remaining: 18,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1f1f]">
      {/* HEADER */}
      <header className="border-b border-[#e8dfd2] bg-white px-8 py-5 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Evidence Home-Staging
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Plateforme professionnelle de valorisation immobilière
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-[#d8c5a2] bg-[#faf6ef] px-5 py-3 text-right shadow-sm">
              <p className="text-xs uppercase tracking-wide text-[#8c6b34]">
                Abonnement PRO Business
              </p>
              <p className="text-lg font-semibold">18 photos restantes</p>
            </div>

            <button className="rounded-2xl bg-[#b88a44] px-5 py-3 text-sm font-medium text-white shadow-md transition hover:opacity-90">
              Ajouter un projet
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-8">
        {/* SIDEBAR */}
        <aside className="col-span-2 rounded-3xl bg-[#233124] p-6 text-white shadow-xl">
          <div className="space-y-3">
            <div className="rounded-2xl bg-[#324634] px-4 py-3 font-medium">
              Tableau de bord
            </div>

            <div className="rounded-2xl px-4 py-3 opacity-80 hover:bg-[#324634] hover:opacity-100">
              Mes projets
            </div>

            <div className="rounded-2xl px-4 py-3 opacity-80 hover:bg-[#324634] hover:opacity-100">
              Avant / Après
            </div>

            <div className="rounded-2xl px-4 py-3 opacity-80 hover:bg-[#324634] hover:opacity-100">
              Retouches
            </div>

            <div className="rounded-2xl px-4 py-3 opacity-80 hover:bg-[#324634] hover:opacity-100">
              Facturation
            </div>

            <div className="rounded-2xl px-4 py-3 opacity-80 hover:bg-[#324634] hover:opacity-100">
              Support
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-[#4e684f] bg-[#2c3c2d] p-4">
            <p className="text-xs uppercase tracking-wide text-[#c7b28b]">
              Offre actuelle
            </p>
            <p className="mt-2 text-xl font-semibold">PRO Business</p>
            <p className="mt-1 text-sm opacity-80">
              30 photos incluses / mois
            </p>

            <button className="mt-5 w-full rounded-xl bg-[#b88a44] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90">
              Gérer mon abonnement
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="col-span-10 space-y-8">
          {/* HERO */}
          <section className="grid grid-cols-3 gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Photos traitées</p>
              <h2 className="mt-3 text-4xl font-bold">128</h2>
              <p className="mt-2 text-sm text-green-700">
                +18% ce mois-ci
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Projets actifs</p>
              <h2 className="mt-3 text-4xl font-bold">12</h2>
              <p className="mt-2 text-sm text-green-700">
                Livraison moyenne : 24h
              </p>
            </div>

            <div className="rounded-3xl bg-[#233124] p-6 text-white shadow-xl">
              <p className="text-sm text-[#c9b28a]">
                Satisfaction client
              </p>
              <h2 className="mt-3 text-4xl font-bold">98%</h2>
              <p className="mt-2 text-sm opacity-80">
                Rendus réalistes et cohérents
              </p>
            </div>
          </section>

          {/* UPLOAD ZONE */}
          <section className="rounded-3xl border-2 border-dashed border-[#d8c5a2] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto max-w-xl">
              <h2 className="text-2xl font-semibold">
                Déposez vos photos immobilières
              </h2>

              <p className="mt-3 text-gray-600">
                Importez plusieurs photos pour générer des projections
                immobilières réalistes et cohérentes.
              </p>

              <div className="mt-8 rounded-2xl bg-[#faf6ef] p-12">
                <p className="text-lg font-medium">
                  Glissez-déposez vos photos ici
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  JPG, PNG • Haute définition recommandée
                </p>

                <button className="mt-6 rounded-2xl bg-[#b88a44] px-6 py-4 font-medium text-white shadow-md transition hover:opacity-90">
                  Sélectionner des photos
                </button>
              </div>
            </div>
          </section>

          {/* PROJECTS */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  Projets récents
                </h2>
                <p className="mt-1 text-gray-500">
                  Suivez vos rendus et vos demandes de retouches.
                </p>
              </div>

              <button className="rounded-xl border border-[#d8c5a2] bg-white px-4 py-2 text-sm shadow-sm">
                Voir tous les projets
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="grid grid-cols-12 items-center rounded-3xl bg-white p-5 shadow-sm"
                >
                  <div className="col-span-4">
                    <h3 className="text-lg font-semibold">
                      {project.property}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {project.photos} photos traitées
                    </p>
                  </div>

                  <div className="col-span-2">
                    <span className="rounded-full bg-[#f5efe4] px-4 py-2 text-sm font-medium text-[#8c6b34]">
                      {project.status}
                    </span>
                  </div>

                  <div className="col-span-3 text-sm text-gray-600">
                    {project.remaining} crédits restants
                  </div>

                  <div className="col-span-3 flex justify-end gap-3">
                    <button className="rounded-xl border border-[#d8c5a2] px-4 py-2 text-sm">
                      Voir
                    </button>

                    <button className="rounded-xl bg-[#233124] px-4 py-2 text-sm text-white">
                      Télécharger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
{/* RECENT DELIVERIES */}

<section>
  <div className="mb-5 flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-semibold">
        Derniers rendus livrés
      </h2>

      <p className="mt-1 text-gray-500">
        Suivez vos projections immobilières et optimisations home staging.
      </p>
    </div>

    <button className="rounded-xl border border-[#d8c5a2] bg-white px-4 py-2 text-sm shadow-sm">
      Voir tous les rendus
    </button>
  </div>

  <div className="grid grid-cols-3 gap-6">

    {/* CARD 1 */}

    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="relative h-56 bg-[#e9dfd0]">
        <div className="absolute left-4 top-4 rounded-full bg-[#233124] px-4 py-2 text-xs font-medium text-white">
          Projection Immobilière
        </div>

        <div className="absolute bottom-4 left-4 rounded-xl bg-black/70 px-4 py-2 text-sm text-white">
          Appartement vide
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold">
          Appartement Lyon
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          Mobilier cohérent, décoration neutre et projection réaliste.
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-green-700">
            Livré
          </span>

          <button className="rounded-xl bg-[#233124] px-4 py-2 text-sm text-white">
            Télécharger
          </button>
        </div>
      </div>
    </div>

    {/* CARD 2 */}

    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="relative h-56 bg-[#ddd3c1]">
        <div className="absolute left-4 top-4 rounded-full bg-[#8c6b34] px-4 py-2 text-xs font-medium text-white">
          Home Staging
        </div>

        <div className="absolute bottom-4 left-4 rounded-xl bg-black/70 px-4 py-2 text-sm text-white">
          Bien habité
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold">
          Maison Bordeaux
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          Optimisation visuelle, désencombrement et harmonisation déco.
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-[#8c6b34]">
            Validation en cours
          </span>

          <button className="rounded-xl border border-[#d8c5a2] px-4 py-2 text-sm">
            Voir projet
          </button>
        </div>
      </div>
    </div>

    {/* CARD 3 */}

    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="relative h-56 bg-[#d7c9b3]">
        <div className="absolute left-4 top-4 rounded-full bg-[#233124] px-4 py-2 text-xs font-medium text-white">
          Projection Immobilière
        </div>

        <div className="absolute bottom-4 left-4 rounded-xl bg-black/70 px-4 py-2 text-sm text-white">
          Studio vide
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold">
          Studio Paris
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          Projection optimisée pour annonce immobilière premium.
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-red-600">
            Retouche demandée
          </span>

          <button className="rounded-xl border border-[#d8c5a2] px-4 py-2 text-sm">
            Modifier
          </button>
        </div>
      </div>
    </div>

  </div>
</section>
         
        
        </main>
      </div>
    </div>
  );
}
