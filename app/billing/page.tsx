import DashboardSidebar from "@/app/components/DashboardSidebar";

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1f1f]">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-8">

        <DashboardSidebar />

        <main className="col-span-10 space-y-8">

          {/* HEADER */}
          <section>
            <p className="text-sm uppercase tracking-wide text-[#8c6b34]">
              Mon abonnement
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              Facturation
            </h1>

            <p className="mt-3 text-gray-500">
              Consultez votre offre, votre consommation et vos informations de facturation.
            </p>
          </section>

          {/* OFFRE */}
          <section className="rounded-[36px] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-[#8c6b34]">
                  Offre actuelle
                </p>

                <h2 className="mt-2 text-3xl font-semibold">
                  PRO Business
                </h2>

                <p className="mt-2 text-gray-500">
                  Renouvellement le 15 juin 2026
                </p>
              </div>

              <button className="rounded-2xl bg-[#b88a44] px-6 py-4 text-sm font-medium text-white shadow-md transition hover:opacity-90">
                Gérer mon abonnement
              </button>
            </div>
          </section>

          {/* STATISTIQUES */}
          <section className="grid grid-cols-3 gap-6">

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Photos incluses
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                30
              </h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Photos utilisées
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                12
              </h2>
            </div>

            <div className="rounded-3xl bg-[#233124] p-6 text-white shadow-xl">
              <p className="text-sm text-[#c9b28a]">
                Photos restantes
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                18
              </h2>
            </div>

          </section>

          {/* FACTURES */}
          <section className="rounded-[36px] bg-white p-8 shadow-sm">

            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                Historique des factures
              </h2>

              <p className="mt-1 text-gray-500">
                Retrouvez vos dernières factures et paiements.
              </p>
            </div>

            <div className="space-y-4">

              <div className="flex items-center justify-between rounded-2xl border border-[#efe6d8] p-5">
                <div>
                  <p className="font-medium">
                    PRO Business
                  </p>

                  <p className="text-sm text-gray-500">
                    15 mai 2026
                  </p>
                </div>

                <button className="rounded-xl border border-[#d8c5a2] px-4 py-2 text-sm">
                  Télécharger
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#efe6d8] p-5">
                <div>
                  <p className="font-medium">
                    PRO Business
                  </p>

                  <p className="text-sm text-gray-500">
                    15 avril 2026
                  </p>
                </div>

                <button className="rounded-xl border border-[#d8c5a2] px-4 py-2 text-sm">
                  Télécharger
                </button>
              </div>

            </div>

          </section>

        </main>
      </div>
    </div>
  );
}