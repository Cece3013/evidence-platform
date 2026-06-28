"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tous");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const token = localStorage.getItem("evidence_pro_token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(API_URL + "/api/pro/auth/projects", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        localStorage.removeItem("evidence_pro_token");
        router.push("/login");
        return;
      }
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === "Tous") return true;
    if (filter === "En cours") return p.status === "En cours" || p.status === "Nouveau";
    if (filter === "Livrés") return p.status === "Livré";
    return true;
  });

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

            <section className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight">
                  Mes projets
                </h1>

                <p className="mt-2 text-gray-500">
                  Retrouvez l'ensemble de vos projections immobilières et suivis de projets.
                </p>
              </div>
            </section>

            <section className="flex items-center gap-4">
              {["Tous", "En cours", "Livrés"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={
                    filter === f
                      ? "rounded-2xl bg-[#233124] px-5 py-3 text-sm text-white shadow-sm"
                      : "rounded-2xl border border-[#d8c5a2] bg-white px-5 py-3 text-sm"
                  }
                >
                  {f}
                </button>
              ))}
            </section>

            {filteredProjects.length === 0 && (
              <section className="rounded-[32px] bg-white p-12 text-center shadow-sm">
                <p className="text-gray-500">Aucun projet pour le moment.</p>
                <p className="mt-2 text-sm text-gray-400">
                  Rendez-vous sur votre tableau de bord pour créer votre premier projet.
                </p>
              </section>
            )}

            <section className="grid grid-cols-2 gap-6">

              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="overflow-hidden rounded-[32px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-64 bg-[#ddd3c1] flex items-center justify-center">
                    <div className="absolute left-5 top-5 rounded-full bg-[#233124] px-4 py-2 text-xs font-medium text-white">
                      {project.status}
                    </div>

                    <div className="absolute bottom-5 left-5 rounded-2xl bg-black/70 px-4 py-3 text-white backdrop-blur-sm">
                      <p className="text-sm opacity-80">
                        {project.projectId}
                      </p>

                      <h2 className="text-xl font-semibold">
                        {project.name}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-6 p-6">

                    <div className="grid grid-cols-2 gap-4">

                      <div className="rounded-2xl bg-[#faf6ef] p-4">
                        <p className="text-sm text-gray-500">
                          Photos reçues
                        </p>

                        <p className="mt-2 text-2xl font-semibold">
                          {project.photosReceived}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#faf6ef] p-4">
                        <p className="text-sm text-gray-500">
                          Photos livrées
                        </p>

                        <p className="mt-2 text-2xl font-semibold">
                          {project.photosDelivered}
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              ))}

            </section>

          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
