"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

const PIECES: Record<string, string> = {
  salon: "Salon",
  salon_salle_a_manger: "Salon / Salle à manger",
  cuisine: "Cuisine",
  salle_bain: "Salle de bain",
  chambre_parentale: "Chambre parentale",
  chambre_enfant: "Chambre enfant",
  chambre_ado: "Chambre ado",
  bureau: "Bureau",
  entree: "Entrée",
  balcon_terrasse: "Balcon / Terrasse",
  jardin: "Jardin",
};

// Lien de téléchargement direct d'une image Cloudinary, converti en JPG
// haute qualité (format attendu par les portails immobiliers, plus léger que PNG)
const lienTelechargement = (url: string) =>
  url.includes("/upload/") ? url.replace("/upload/", "/upload/fl_attachment,f_jpg,q_90/") : url;

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id || "");
  const [projet, setProjet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const charger = async () => {
      const token = localStorage.getItem("evidence_pro_token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch(API_URL + "/api/pro/projects/" + id, {
          headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();
        if (res.status === 401) {
          localStorage.removeItem("evidence_pro_token");
          router.push("/login");
          return;
        }
        if (!res.ok) setErreur(data.error || "Projet introuvable.");
        else setProjet(data);
      } catch {
        setErreur("Erreur réseau.");
      }
      setLoading(false);
    };
    if (id) charger();
  }, [id]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f7f4ef] text-[#1f1f1f]">
        <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-8">
          <DashboardSidebar />

          <main className="col-span-10 space-y-8">
            <button onClick={() => router.push("/projects")} className="text-sm text-[#8c6b34] underline">
              ← Mes projets
            </button>

            {loading && <p className="text-gray-500">Chargement...</p>}
            {erreur && <p className="text-red-600">{erreur}</p>}

            {projet && (
              <>
                <section className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-[#8c6b34]">
                      {projet.projectId} {projet.typeBien ? `· ${projet.typeBien}` : ""}
                    </p>
                    <h1 className="mt-2 text-4xl font-semibold tracking-tight">{projet.name}</h1>
                  </div>
                  <div className="rounded-2xl bg-[#233124] px-5 py-4 text-white shadow-lg">
                    <p className="text-sm opacity-80">Statut du projet</p>
                    <p className="mt-1 text-lg font-semibold">{projet.status}</p>
                  </div>
                </section>

                <section className="grid grid-cols-2 gap-6">
                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">Photos transmises</p>
                    <p className="mt-3 text-4xl font-bold">{projet.photosReceived}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">Photos livrées</p>
                    <p className="mt-3 text-4xl font-bold">{projet.photosDelivered}</p>
                  </div>
                </section>

                {projet.paires.length === 0 ? (
                  <section className="rounded-[32px] bg-white p-12 text-center shadow-sm">
                    <p className="text-gray-600">Vos visuels sont en cours de préparation.</p>
                    <p className="mt-2 text-sm text-gray-400">
                      Chaque image est vérifiée par notre équipe avant d'apparaître ici.
                    </p>
                  </section>
                ) : (
                  <section className="space-y-8">
                    {projet.paires.map((p: any, i: number) => (
                      <div key={i} className="rounded-[32px] bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-lg font-semibold">{PIECES[p.piece] || p.piece}</p>
                          <a
                            href={lienTelechargement(p.apres)}
                            className="rounded-2xl bg-[#b88a44] px-4 py-2 text-sm font-medium text-white"
                          >
                            Télécharger
                          </a>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {p.avant && (
                            <div>
                              <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">Avant</p>
                              <img src={p.avant} alt="Avant" className="w-full rounded-2xl" />
                            </div>
                          )}
                          <div>
                            <p className="mb-2 text-xs uppercase tracking-wide text-[#8c6b34]">Après</p>
                            <img src={p.apres} alt="Après" className="w-full rounded-2xl" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </section>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
