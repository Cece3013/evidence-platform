
"use client";

import { useState } from "react";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

const ROOM_TYPES = [
  { id: "salon", label: "Salon" },
  { id: "salon_salle_a_manger", label: "Salon / Salle à manger" },
  { id: "cuisine", label: "Cuisine" },
  { id: "salle_bain", label: "Salle de bain" },
  { id: "chambre_parentale", label: "Chambre parentale" },
  { id: "chambre_enfant", label: "Chambre enfant" },
  { id: "chambre_ado", label: "Chambre ado" },
  { id: "balcon_terrasse", label: "Balcon / Terrasse" },
  { id: "coin_repas", label: "Coin repas" },
  { id: "bureau", label: "Bureau" },
];

export default function TestStagingPage() {
  const [testKey, setTestKey] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [roomType, setRoomType] = useState("salon");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!imageUrl.trim()) {
      setError("Collez d'abord l'URL d'une photo.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(API_URL + "/api/test-staging/habites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, roomType, testKey }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error + (data.detail ? " — " + JSON.stringify(data.detail) : ""));
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1f1f] py-10 px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Test génération — Biens habités</h1>
        <p className="mt-2 text-gray-500">
          Outil interne pour tester les prompts sans passer par l'application.
        </p>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Clé de test</label>
            <input
              type="password"
              value={testKey}
              onChange={(e) => setTestKey(e.target.value)}
              placeholder="Votre TEST_STAGING_KEY"
              className="mt-2 w-full rounded-2xl border border-[#d8c5a2] px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">URL de la photo</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="mt-2 w-full rounded-2xl border border-[#d8c5a2] px-4 py-3 text-sm"
            />
            <p className="mt-2 text-xs text-gray-400">
              Uploadez d'abord la photo sur Cloudinary (ou tout hébergeur d'images public) et collez son lien direct ici.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Type de pièce</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#d8c5a2] bg-white px-4 py-3 text-sm"
            >
              {ROOM_TYPES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-2xl bg-[#b88a44] px-6 py-4 text-sm font-medium text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Génération en cours (30-60s)..." : "Lancer la génération"}
          </button>

          {error && <p className="text-sm text-red-600 break-all">{error}</p>}
        </div>

        {result && (
          <div className="mt-8 space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-700">Micro-modules détectés automatiquement</p>
              <p className="mt-2 text-sm text-[#8c6b34]">
                {result.detectedModules?.length ? result.detectedModules.join(", ") : "aucun"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-700 mb-3">Avant</p>
                <img src={result.originalUrl} alt="Avant" className="w-full rounded-2xl" />
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-700 mb-3">Après</p>
                <img src={result.generatedUrl} alt="Après" className="w-full rounded-2xl" />
              </div>
            </div>

            <details className="rounded-3xl bg-white p-6 shadow-sm">
              <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                Voir le prompt envoyé
              </summary>
              <pre className="mt-4 whitespace-pre-wrap text-xs text-gray-600">{result.prompt}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
