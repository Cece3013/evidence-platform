import DashboardSidebar from "@/app/components/DashboardSidebar";
import Image from "next/image";

export default function ProjectDetailsPage() {
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
              <p className="text-sm uppercase tracking-wide text-[#8c6b34]">
                Projet immobilier
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                Appartement Haussmannien
              </h1>

              <p className="mt-3 text-gray-500">
                Paris 16 • Projection immobilière premium
              </p>
            </div>

            <div className="rounded-2xl bg-[#233124] px-5 py-4 text-white shadow-lg">
              <p className="text-sm opacity-80">
                Statut du projet
              </p>

              <p className="mt-1 text-lg font-semibold">
                Livré
              </p>
            </div>
          </section>

          {/* HERO IMAGE */}
          <section className="overflow-hidden rounded-[36px] bg-white shadow-sm">
            <div className="h-[420px] bg-[#ddd3c1]" />
          </section>

          {/* INFOS */}
          <section className="grid grid-cols-3 gap-6">

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Photos transmises
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                12
              </h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Date de livraison
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                14 mai 2026
              </h2>
            </div>

            <div className="rounded-3xl bg-[#233124] p-6 text-white shadow-xl">
              <p className="text-sm text-[#c9b28a]">
                Signature Evidence
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Projection validée
              </h2>
            </div>

          </section>

          {/* DESCRIPTION */}
          <section className="rounded-[36px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">
              Détails du projet
            </h2>

            <p className="mt-5 max-w-3xl leading-relaxed text-gray-600">
              Projection immobilière réalisée selon la signature visuelle
              Evidence afin de valoriser les volumes, la luminosité et le
              potentiel du bien tout en conservant un rendu réaliste et
              cohérent.
            </p>
          </section>
{/* COMPARAISON */}

<section className="space-y-5">

  <div>
    <h2 className="text-2xl font-semibold">
      Comparaison de projection
    </h2>

    <p className="mt-1 text-gray-500">
      Comparez le bien d’origine avec la projection réalisée.
    </p>
  </div>

  <div className="overflow-hidden rounded-[36px] bg-white shadow-sm">

    {/* IMAGES */}
    <div className="grid grid-cols-2">

      {/* AVANT */}
      <div className="relative h-[420px] overflow-hidden">

        <Image
          src="/images/avant-salon.jpg"
          alt="Photo avant projection"
          fill
          className="object-cover"
        />

        <div className="absolute left-5 top-5 rounded-full bg-black/70 px-4 py-2 text-sm text-white backdrop-blur-sm">
          Avant
        </div>

      </div>

      {/* PROJECTION */}
      <div className="relative h-[420px] overflow-hidden">

        <Image
          src="/images/projection-salon.jpg"
          alt="Projection immobilière Evidence"
          fill
          className="object-cover"
        />

        <div className="absolute left-5 top-5 rounded-full bg-[#233124] px-4 py-2 text-sm text-white">
          Projection Evidence
        </div>

      </div>

    </div>

    {/* FOOTER */}
    <div className="flex items-center justify-between border-t border-[#efe6d8] p-6">

      <div>
        <p className="text-sm text-gray-500">
          Projection livrée le 14 mai 2026
        </p>

        <p className="mt-1 font-medium">
          Version finale validée
        </p>
      </div>

      <div className="flex gap-3">

        <button className="rounded-2xl border border-[#d8c5a2] px-5 py-3 text-sm font-medium">
          Demander une retouche
        </button>

        <button className="rounded-2xl bg-[#233124] px-5 py-3 text-sm font-medium text-white">
          Télécharger HD
        </button>

      </div>

    </div>

  </div>

</section>

        </main>
      </div>
    </div>
  );
}