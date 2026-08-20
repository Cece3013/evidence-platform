"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

export default function BillingPage() {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("evidence_pro_token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const [accountRes, invoicesRes] = await Promise.all([
        fetch(API_URL + "/api/pro/auth/me", {
          headers: { Authorization: "Bearer " + token },
        }),
        fetch(API_URL + "/api/pro/auth/invoices", {
          headers: { Authorization: "Bearer " + token },
        }),
      ]);

      if (!accountRes.ok) {
        localStorage.removeItem("evidence_pro_token");
        router.push("/login");
        return;
      }

      const accountData = await accountRes.json();
      setAccount(accountData);

      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json();
        setInvoices(invoicesData.invoices || []);
      }
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f7f4ef] text-[#1f1f1f]">
        <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-8">

          <DashboardSidebar />

          <main className="col-span-10 space-y-8">

            <section>
              <p className="text-sm uppercase tracking-wide text-[#8c6b34]">
                Mon abonnement
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                Facturation
              </h1>

              <p className="mt-3 text-gray-500">
                Consultez votre offre et vos factures.
              </p>
            </section>

           <section className="rounded-[36px] bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-[#8c6b34]">
                    Offre actuelle
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold">
                    {account?.offerName || "—"}
                  </h2>

                  <p className="mt-2 text-gray-500">
                    Statut : {account?.status || "—"}
                  </p>
                </div>

                <a
                  href={"mailto:contact@evidence-homestaging.fr?subject=Modification abonnement"}
                  className="rounded-2xl bg-[#b88a44] px-6 py-4 text-sm font-medium text-white shadow-md transition hover:opacity-90"
                >
                  Modifier mon abonnement
                </a>
              </div>
            </section>

            <section className="rounded-[36px] bg-white p-8 shadow-sm">

              <div className="mb-6">
                <h2 className="text-2xl font-semibold">
                  Historique des factures
                </h2>

                <p className="mt-1 text-gray-500">
                  Retrouvez vos factures Stripe.
                </p>
              </div>

              {invoices.length === 0 && (
                <p className="text-gray-500">Aucune facture pour le moment.</p>
              )}

              <div className="space-y-4">
                {invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between rounded-2xl border border-[#efe6d8] p-5">
                    <div>
                      <p className="font-medium">
                        {account?.offerName} — {inv.amount}€
                      </p>

                      <p className="text-sm text-gray-500">
                        {inv.date}
                      </p>
                    </div>

                    {inv.pdfUrl && (
                      <a
                        href={inv.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-[#d8c5a2] px-4 py-2 text-sm"
                      >
                        Télécharger
                      </a>
                    )}
                  </div>
                ))}
              </div>

            </section>

          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
