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

const ROOM_TYPES = [
  { id: "salon", label: "Salon" },
  { id: "chambre", label: "Chambre" },
  { id: "cuisine", label: "Cuisine" },
  { id: "salle_bain", label: "Salle de bain" },
  { id: "terrasse", label: "Terrasse" },
];

export default function RealEstateStagingDashboard() {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [roomType, setRoomType] = useState("salon");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitProject = async () => {
    setMessage("");
    if (!projectName.trim()) {
      setMessage("Veuillez entrer un nom de projet.");
      return;
    }
    if (files.length === 0) {
      setMessage("Veuillez sélectionner au moins une photo.");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("evidence_pro_token");

    try {
      const photosPayload = await Promise.all(
        files.map(async (file) => ({
          imageBase64: await fileToBase64(file),
          roomTypeId: roomType,
          roomSize: "medium",
        }))
      );

      const res = await fetch(API_URL + "/api/pro/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ projectName: projectName.trim(), photos: photosPayload }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Erreur lors de la création du projet.");
        setSubmitting(false);
        return;
      }

      setMessage("Projet en cours de traitement ! Vous recevrez les résultats dans quelques minutes.");
      setProjectName("");
      setFiles([]);
    } catch (err) {
      setMessage("Erreur réseau.");
    }
    setSubmitting(false);
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
          <DashboardSidebar />

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

            <section className="rounded-3xl border-2 border-dashed border-[#d8c5a2] bg-white p-10">
              <h2 className="text-2xl font-semibold">
                Nouveau projet
              </h2>
              <p className="mt-2 text-gray-600">
                Créez un projet et déposez vos photos pour générer des projections immobilières.
              </p>

              <div className="mt-6 space-y-4 max-w-xl">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Nom du projet (ex: Appartement Lyon)"
                  className="w-full rounded-2xl border border-[#e8dfd2] px-4 py-3 text-sm"
                />

                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full rounded-2xl border border-[#e8dfd2] px-4 py-3 text-sm"
                >
                  {ROOM_TYPES.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>

                <div className="rounded-2xl bg-[#faf6ef] p-6">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="block w-full text-sm"
                  />
                  {files.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600">{files.length} photo(s) sélectionnée(s)</p>
                  )}
                </div>

                {message && <p className="text-sm text-[#8c6b34]">{message}</p>}

                <button
                  onClick={handleSubmitProject}
                  disabled={submitting}
                  className="rounded-2xl bg-[#b88a44] px-6 py-4 font-medium text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Envoi en cours..." : "Lancer le traitement"}
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
