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
          href="/settings"
          className="block rounded-2xl px-4 py-3 opacity-80 transition hover:bg-[#324634] hover:opacity-100"
        >
          Paramètres
        </Link>

        <Link
          href="/support"
          className="block rounded-2xl px-4 py-3 opacity-80 transition hover:bg-[#324634] hover:opacity-100"
        >
          Support
        </Link>
      </div>
    </aside>
  );
}
