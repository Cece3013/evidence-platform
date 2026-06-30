"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

export default function SettingsPage() {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [siret, setSiret] = useState("");

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
      setCompanyName(data.companyName || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setSiret(data.siret || "");
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setMessage("");
    setSaving(true);
    const token = localStorage.getItem("evidence_pro_token");

    try {
      const res = await fetch(API_URL + "/api/pro/auth/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ companyName, phone, address, siret }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Erreur lors de la mise à jour.");
        setSaving(false);
        return;
      }

      setMessage("Vos informations ont été mises à jour avec succès.");
    } catch (err) {
      setMessage("Erreur réseau.");
    }
    setSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("evidence_pro_token");
    localStorage.removeItem("evidence_pro_email");
    router.push("/login");
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
              <h1 className="text-4xl font-semibold tracking-tight">
                Paramètres
              </h1>
              <p className="mt-2 text-gray-500">
                Gérez les informations de votre entreprise.
              </p>
            </section>

            <section className="rounded-[36px] bg-white p-8 shadow-sm max-w-2xl">

              <h2 className="text-xl font-semibold mb-6">
                Informations de l'entreprise
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Nom de l'entreprise</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-2xl border border-[#e8dfd2] px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">SIRET</label>
                  <input
                    type="text"
                    value={siret}
                    onChange={(e) => setSiret(e.target.value)}
                    className="w-full rounded-2xl border border-[#e8dfd2] px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email</label>
                  <input
                    type="email"
                    value={account?.email || ""}
                    disabled
                    className="w-full rounded-2xl border border-[#e8dfd2] bg-[#f7f4ef] px-4 py-3 text-sm text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-400">L'email ne peut pas être modifié.</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Téléphone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-[#e8dfd2] px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Adresse</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-2xl border border-[#e8dfd2] px-4 py-3 text-sm"
                    rows={3}
                  />
                </div>

                {message && (
                  <p className="text-sm text-[#8c6b34]">{message}</p>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-2xl bg-[#b88a44] px-6 py-3 text-sm font-medium text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>

            </section>

            <section className="rounded-[36px] bg-white p-8 shadow-sm max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">
                Session
              </h2>
              <button
                onClick={handleLogout}
                className="rounded-2xl border border-[#d8c5a2] px-6 py-3 text-sm font-medium text-gray-600 hover:bg-[#faf6ef]"
              >
                Se déconnecter
              </button>
            </section>

          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
