import Link from "next/link";

export default function DashboardSidebar() {
  return (
    <aside className="col-span-2 rounded-3xl bg-[#233124] p-6 text-white shadow-xl">
      <div className="space-y-3">
        <Link
          href="/dashboard"
          className="block rounded-2xl bg-[#324634] px-4 py-3 font-medium"
        >
          Tableau de bord
        </Link>

        <Link
          href="/projects"
          className="block rounded-2xl px-4 py-3 opacity-80 transition hover:bg-[#324634] hover:opacity-100"
        >
          Projets
        </Link>

        <Link
          href="/billing"
          className="block rounded-2xl px-4 py-3 opacity-80 transition hover:bg-[#324634] hover:opacity-100"
        >
          Facturation
        </Link>

        <Link
          href="/support"
          className="block rounded-2xl px-4 py-3 opacity-80 transition hover:bg-[#324634] hover:opacity-100"
        >
          Support
        </Link>
      </div>

      <div className="mt-10 rounded-2xl border border-[#4e684f] bg-[#2c3c2d] p-5">
        <p className="text-xs uppercase tracking-wide text-[#c7b28b]">
          Offre actuelle
        </p>

        <p className="mt-2 text-xl font-semibold">
          PRO Business
        </p>

        <p className="mt-1 text-sm opacity-80">
          30 photos incluses
        </p>

        <div className="mt-4 rounded-xl bg-[#233124] p-3">
          <p className="text-xs uppercase tracking-wide text-[#c7b28b]">
            Solde actuel
          </p>

          <p className="mt-1 text-lg font-semibold">
            18 photos restantes
          </p>
        </div>

        <button className="mt-5 w-full rounded-xl bg-[#b88a44] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90">
          Gérer mon abonnement
        </button>
      </div>
    </aside>
  );
}