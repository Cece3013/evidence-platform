"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

const OFFER_PHOTOS: Record<string, number> = {
  pro_starter: 10,
  pro_business: 30,
  pro_agency: 80,
};

export default function RealEstateStagingDashboard() {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    const token = localStorage.getItem("evidence_pro_token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(API_URL + "/api/pro/auth/me", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        localStorage.removeItem("evidence_pro_token");
        router.push("/login");
        return;
      }
      const data = await res.json();
      setAccount(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f4ef]">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  const totalPhotos = account ? (OFFER_PHOTOS[account.offerId] || 0) : 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f7f4ef] text-[#1f1f1f]">
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
                  {account?.offerName || "Abonnement"}
                </p>
                <p className="text-lg font-semibold">{totalPhotos} photos incluses / mois</p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-8">
          <DashboardSidebar account={account} />

          <main className="col-span-10 space-y-8">
            <section className="rounded-[36px] bg-white p-8 shadow-sm">
              <p className="text-sm uppercase tracking-wide text-[#8c6b34]">
                Bienvenue
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                {account?.companyName || "Votre espace PRO"}
              </h2>
              <p className="mt-3 text-gray-500">
                {account?.email}
              </p>
            </section>

            <section className="grid grid-cols-3 gap-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Offre actuelle</p>
                <h2 className="mt-3 text-2xl font-bold">{account?.offerName || "—"}</h2>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Statut</p>
                <h2 className="mt-3 text-2xl font-bold">{account?.status || "—"}</h2>
              </div>

              <div className="rounded-3xl bg-[#233124] p-6 text-white shadow-xl">
                <p className="text-sm text-[#c9b28a]">Date de souscription</p>
                <h2 className="mt-3 text-xl font-semibold">{account?.subscriptionDate || "—"}</h2>
              </div>
            </section>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
