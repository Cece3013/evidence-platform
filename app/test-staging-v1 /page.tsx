"use client";

import { useState } from "react";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

const ROOM_TYPES_V1 = [
  { id: "salon", label: "Salon" },
  { id: "salon_salle_a_manger", label: "Salon / Salle à manger" },
  { id: "cuisine", label: "Cuisine" },
  { id: "salle_bain", label: "Salle de bain" },
  { id: "chambre_parentale", label: "Chambre parentale" },
  { id: "chambre_enfant", label: "Chambre enfant" },
  { id: "chambre_ado", label: "Chambre ado" },
  { id: "entree", label: "Entrée" },
  { id: "balcon_terrasse", label: "Balcon / Terrasse" },
];

export default function TestStagingV1Page() {
  const [testKey, setTestKey] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [roomType, setRoomType] = useState("salon");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  // État spécifique à l'écran de choix cuisine
  const [choixCuisineAttente, setChoixCuisineAttente] = useState<any>(null);
  const [choixCuisineEnvoi, setChoixCuisineEnvoi] = useState(false);

  // PROTOTYPE — Guide Visuel Assisté (salon_salle_a_manger uniquement)
  const [guideImageUrl, setGuideImageUrl] = useState("");
  const [guideUploading, setGuideUploading] = useState(false);

  // TEST A/B — STYLE_VARIANT (salon et salon_salle_a_manger uniquement)
  const [utiliserStyleVariant, setUtiliserStyleVariant] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("testKey", testKey);
    const res = await fetch(API_URL + "/api/test-staging-v1/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      setError(data.error || "Erreur lors de l'envoi de la photo.");
      return null;
    }
    return data.url;
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!testKey.trim()) return setError("Renseignez d'abord la clé de test.");
    setUploading(true);
    setError("");
    setResult(null);
    setChoixCuisineAttente(null);
    const url = await uploadFile(file);
    if (url) setImageUrl(url);
    setUploading(false);
  };

  // PROTOTYPE — upload du guide visuel (salon_salle_a_manger uniquement)
  const handleGuide = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!testKey.trim()) return setError("Renseignez d'abord la clé de test.");
    setGuideUploading(true);
    setError("");
    const url = await uploadFile(file);
    if (url) setGuideImageUrl(url);
    setGuideUploading(false);
  };

  const lancerGeneration = async (choixCuisine: string | null = null) => {
    if (!imageUrl.trim()) return setError("Choisissez d'abord une photo.");
    if (choixCuisine) {
      setChoixCuisineEnvoi(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const res = await fetch(API_URL + "/api/test-staging-v1/vides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, roomType, choixCuisine, guideImageUrl, utiliserStyleVariant, testKey }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error + (data.detail ? " — " + JSON.stringify(data.detail) : ""));
      } else if (data.status === "CHOIX_CUISINE_REQUIS") {
        setChoixCuisineAttente(data);
        setResult(null);
      } else if (data.status === "PHOTO_A_REPRENDRE") {
        setChoixCuisineAttente(null);
        setResult(data);
      } else {
        setChoixCuisineAttente(null);
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau.");
    }
    setLoading(false);
    setChoixCuisineEnvoi(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f2ee] text-[#1a1a1a] py-10 px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Test génération — Pipeline V1</h1>
        <p className="mt-2 text-gray-500">
          Nouvelle architecture officielle : Contrôle Photo V2 → Noyau + Module → génération.
          Une seule photo, jamais de vues complémentaires.
        </p>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Clé de test</label>
            <input
              type="password"
              value={testKey}
              onChange={(e) => setTestKey(e.target.value)}
              placeholder="TEST_STAGING_KEY"
              className="mt-2 w-full rounded-2xl border border-[#e8d3b0] px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Photo <span className="text-gray-400">(une seule)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              disabled={uploading}
              className="mt-2 w-full rounded-2xl border border-[#e8d3b0] px-4 py-3 text-sm"
            />
            {uploading && <p className="mt-2 text-xs text-[#9a6f26]">Envoi...</p>}
            {imageUrl && (
              <img src={imageUrl} alt="" className="mt-3 h-32 rounded-xl object-cover" />
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Type de pièce</label>
            <select
              value={roomType}
              onChange={(e) => {
                setRoomType(e.target.value);
                setResult(null);
                setChoixCuisineAttente(null);
              }}
              className="mt-2 w-full rounded-2xl border border-[#e8d3b0] bg-white px-4 py-3 text-sm"
            >
              {ROOM_TYPES_V1.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* TEST A/B — STYLE_VARIANT, salon et salon_salle_a_manger uniquement */}
          {(roomType === "salon" || roomType === "salon_salle_a_manger") && (
            <label className="flex items-center gap-3 rounded-2xl border border-dashed border-[#bd8a34] p-4 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={utiliserStyleVariant}
                onChange={(e) => setUtiliserStyleVariant(e.target.checked)}
                className="h-4 w-4"
              />
              Activer STYLE_VARIANT (test A/B — rotation séquentielle des 5 familles)
            </label>
          )}

          {/* PROTOTYPE — Guide Visuel Assisté, salon_salle_a_manger uniquement */}
          {roomType === "salon_salle_a_manger" && (
            <div className="rounded-2xl border border-dashed border-[#bd8a34] p-4">
              <label className="text-sm font-medium text-gray-700">
                Guide visuel (optionnel — prototype)
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Image avec les zones Salon/Salle à manger/Cuisine/Passage surlignées.
                Si fourni, remplace la Lecture Fonctionnelle textuelle pour ce test.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleGuide}
                disabled={guideUploading}
                className="mt-2 w-full rounded-2xl border border-[#e8d3b0] px-4 py-3 text-sm"
              />
              {guideUploading && <p className="mt-2 text-xs text-[#9a6f26]">Envoi du guide...</p>}
              {guideImageUrl && (
                <img src={guideImageUrl} alt="Guide" className="mt-3 h-32 rounded-xl object-cover" />
              )}
            </div>
          )}

          <button
            onClick={() => lancerGeneration(null)}
            disabled={loading || uploading}
            className="w-full rounded-2xl bg-[#bd8a34] px-6 py-4 text-sm font-medium text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Analyse puis génération..." : "Lancer"}
          </button>

          {error && <p className="text-sm text-red-600 break-all">{error}</p>}
        </div>


        {/* ── Photo à reprendre ── */}
        {result?.status === "PHOTO_A_REPRENDRE" && (
          <div className="mt-8 rounded-3xl border-2 border-amber-300 bg-amber-50 p-8">
            <p className="text-lg font-semibold text-amber-900">Photo à reprendre</p>
            <p className="mt-2 text-sm text-amber-800">{result.raison}</p>
            {result.retakeInstruction && (
              <p className="mt-3 rounded-xl bg-white p-3 text-sm text-amber-900">
                {result.retakeInstruction}
              </p>
            )}
            <p className="mt-3 text-xs text-amber-700">
              Envoyez une nouvelle photo ci-dessus — elle remplacera celle-ci.
            </p>
          </div>
        )}

        {/* ── Choix cuisine requis ── */}
        {choixCuisineAttente && (
          <div className="mt-8 rounded-3xl border-2 border-[#e8d3b0] bg-white p-8">
            <p className="text-lg font-semibold text-[#1a1a1a]">
              Niveau de transformation de la cuisine
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Cuisine détectée comme :{" "}
              <span className="font-medium">
                {choixCuisineAttente.classificationCuisine?.status}
              </span>
              {" — "}
              {choixCuisineAttente.classificationCuisine?.reason}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {choixCuisineAttente.options?.map((opt: any) => {
                const recommande = opt.id === choixCuisineAttente.recommandation;
                return (
                  <button
                    key={opt.id}
                    onClick={() => lancerGeneration(opt.id)}
                    disabled={choixCuisineEnvoi}
                    className={
                      "rounded-2xl border p-5 text-left text-sm transition disabled:opacity-50 " +
                      (recommande
                        ? "border-[#bd8a34] bg-[#faf4ec]"
                        : "border-[#e8e0d8] bg-white hover:border-[#bd8a34]")
                    }
                  >
                    <p className="font-medium text-[#1a1a1a]">
                      {opt.id === "valorisation_douce" ? "Valorisation douce" : "Projection modernisée"}
                      {recommande && (
                        <span className="ml-2 rounded-full bg-[#bd8a34] px-2 py-0.5 text-xs text-white">
                          recommandé
                        </span>
                      )}
                    </p>
                    <p className="mt-2 text-xs text-gray-600">{opt.label}</p>
                  </button>
                );
              })}
            </div>
            {choixCuisineEnvoi && (
              <p className="mt-4 text-xs text-[#9a6f26]">Génération en cours...</p>
            )}
          </div>
        )}

        {/* ── Résultat ── */}
        {result?.success && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="mb-3 text-sm font-medium text-gray-700">Avant</p>
                <img src={result.originalUrl} alt="Avant" className="w-full rounded-2xl" />
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="mb-3 text-sm font-medium text-gray-700">Après</p>
                <img src={result.generatedUrl} alt="Après" className="w-full rounded-2xl" />
              </div>
            </div>

            {result.classificationCuisine && (
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-700">Classification cuisine appliquée</p>
                <p className="mt-2 text-sm text-[#9a6f26]">
                  {result.classificationCuisine.status} — {result.classificationCuisine.reason}
                </p>
              </div>
            )}

            {result.styleVariantId && (
              <div className="rounded-3xl border-2 border-[#bd8a34] bg-[#faf4ec] p-6 shadow-sm">
                <p className="text-sm font-medium text-[#1a1a1a]">
                  STYLE_VARIANT appliqué — Famille {result.styleVariantId}
                </p>
              </div>
            )}

            {result.guideVisuelUtilise && (
              <div className="rounded-3xl border-2 border-[#bd8a34] bg-[#faf4ec] p-6 shadow-sm">
                <p className="text-sm font-medium text-[#1a1a1a]">
                  Guide visuel utilisé pour ce test (Lecture Fonctionnelle textuelle désactivée)
                </p>
                <img src={result.guideImageUrl} alt="Guide utilisé" className="mt-3 max-h-64 rounded-xl" />
              </div>
            )}

            <details className="rounded-3xl bg-white p-6 shadow-sm">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Voir le contrôle photo
              </summary>
              <pre className="mt-4 overflow-auto whitespace-pre-wrap text-xs text-gray-600">
                {JSON.stringify(result.controle, null, 2)}
              </pre>
            </details>

            <details className="rounded-3xl bg-white p-6 shadow-sm">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Voir le prompt envoyé (Noyau + Module)
              </summary>
              <pre className="mt-4 whitespace-pre-wrap text-xs text-gray-600">{result.prompt}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
