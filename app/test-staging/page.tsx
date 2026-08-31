"use client";

import { useState } from "react";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

const ROOM_TYPES_VIDE = [
  { id: "salon", label: "Salon" },
  { id: "salon_salle_a_manger", label: "Salon / Salle à manger" },
  { id: "cuisine", label: "Cuisine" },
  { id: "salle_bain", label: "Salle de bain" },
  { id: "chambre_parentale", label: "Chambre parentale" },
  { id: "chambre_enfant", label: "Chambre enfant" },
  { id: "chambre_ado", label: "Chambre ado" },
  { id: "entree", label: "Entrée" },
  { id: "balcon_terrasse", label: "Balcon / Terrasse" },
  { id: "jardin", label: "Jardin" },
];

const ROOM_TYPES_HABITE = [
  { id: "salon", label: "Salon" },
  { id: "salon_salle_a_manger", label: "Salon / Salle à manger" },
  { id: "cuisine", label: "Cuisine" },
  { id: "coin_repas", label: "Coin repas" },
  { id: "salle_bain", label: "Salle de bain" },
  { id: "chambre_parentale", label: "Chambre parentale" },
  { id: "chambre_enfant", label: "Chambre enfant" },
  { id: "chambre_ado", label: "Chambre ado" },
  { id: "bureau", label: "Bureau" },
  { id: "entree", label: "Entrée (PRO)" },
  { id: "balcon_terrasse", label: "Balcon / Terrasse" },
  { id: "jardin", label: "Jardin (PRO)" },
];

const MICRO_MODULES = [
  { id: "coin_repas", label: "Coin repas" },
  { id: "espace_bureau", label: "Espace bureau" },
  { id: "coin_lecture", label: "Coin lecture" },
  { id: "habillage_irregularite", label: "Habillage d'une irrégularité" },
];

export default function TestStagingPage() {
  const [testKey, setTestKey] = useState("");
  const [mode, setMode] = useState<"vide" | "habite">("vide");
  const [clientType, setClientType] = useState("particulier");
  const [imageUrl, setImageUrl] = useState("");
  const [vuesComp, setVuesComp] = useState<string[]>([]);
  const [roomType, setRoomType] = useState("salon");
  const [micros, setMicros] = useState<string[]>([]);
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const roomList = mode === "vide" ? ROOM_TYPES_VIDE : ROOM_TYPES_HABITE;

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("testKey", testKey);
    const res = await fetch(API_URL + "/api/test-staging/upload", {
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

  const handleMainPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!testKey.trim()) return setError("Renseignez d'abord la clé de test.");
    setUploading("principale");
    setError("");
    setResult(null);
    const url = await uploadFile(file);
    if (url) setImageUrl(url);
    setUploading("");
  };

  const handleVueComp = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!testKey.trim()) return setError("Renseignez d'abord la clé de test.");
    if (vuesComp.length >= 2) return setError("Maximum 2 vues complémentaires.");
    setUploading("complementaire");
    setError("");
    const url = await uploadFile(file);
    if (url) setVuesComp((prev) => [...prev, url]);
    setUploading("");
    e.target.value = "";
  };

  const toggleMicro = (id: string) => {
    setMicros((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  };

  const handleGenerate = async () => {
    if (!imageUrl.trim()) return setError("Choisissez d'abord une photo principale.");
    setLoading(true);
    setError("");
    setResult(null);

    const endpoint = mode === "vide" ? "/api/test-staging/vides" : "/api/test-staging/habites";
    const body = mode === "vide"
      ? {
          imageUrl,
          photosComplementaires: vuesComp,
          roomType,
          testKey,
          activeMicroModules: micros,
          commentaireClient: commentaire,
        }
      : { imageUrl, roomType, testKey, clientType };

    try {
      const res = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
    <div className="min-h-screen bg-[#f7f2ee] text-[#1a1a1a] py-10 px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Test génération</h1>
        <p className="mt-2 text-gray-500">
          Outil interne — pipeline complet sans passer par l'application.
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

          {/* Mode */}
          <div className="flex gap-2 rounded-2xl bg-[#f7f2ee] p-1">
            {(["vide", "habite"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setRoomType("salon"); setResult(null); }}
                className={
                  "flex-1 rounded-xl py-3 text-sm font-medium transition " +
                  (mode === m ? "bg-[#bd8a34] text-white" : "text-gray-600")
                }
              >
                {m === "vide" ? "Bien vide (A → B → C)" : "Bien habité"}
              </button>
            ))}
          </div>

          {mode === "habite" && (
            <div>
              <label className="text-sm font-medium text-gray-700">Type de client</label>
              <select
                value={clientType}
                onChange={(e) => setClientType(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#e8d3b0] bg-white px-4 py-3 text-sm"
              >
                <option value="particulier">Particulier</option>
                <option value="pro">PRO</option>
              </select>
            </div>
          )}

          {/* Photo principale */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Photo principale <span className="text-gray-400">(celle qui sera transformée)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainPhoto}
              disabled={!!uploading}
              className="mt-2 w-full rounded-2xl border border-[#e8d3b0] px-4 py-3 text-sm"
            />
            {uploading === "principale" && <p className="mt-2 text-xs text-[#9a6f26]">Envoi...</p>}
            {imageUrl && (
              <img src={imageUrl} alt="" className="mt-3 h-32 rounded-xl object-cover" />
            )}
          </div>

          {/* Vues complémentaires — biens vides uniquement */}
          {mode === "vide" && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Vues complémentaires <span className="text-gray-400">(facultatif, max 2)</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Autres angles de la même pièce. Servent à comprendre l'espace, ne génèrent pas d'image.
              </p>
              {vuesComp.length < 2 && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleVueComp}
                  disabled={!!uploading}
                  className="mt-2 w-full rounded-2xl border border-[#e8d3b0] px-4 py-3 text-sm"
                />
              )}
              {uploading === "complementaire" && <p className="mt-2 text-xs text-[#9a6f26]">Envoi...</p>}
              {vuesComp.length > 0 && (
                <div className="mt-3 flex gap-3">
                  {vuesComp.map((u, i) => (
                    <div key={i} className="relative">
                      <img src={u} alt="" className="h-24 rounded-xl object-cover" />
                      <button
                        onClick={() => setVuesComp((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 text-xs text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Type de pièce */}
          <div>
            <label className="text-sm font-medium text-gray-700">Type de pièce</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#e8d3b0] bg-white px-4 py-3 text-sm"
            >
              {roomList.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Micro-modules — biens vides uniquement */}
          {mode === "vide" && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Besoins particuliers <span className="text-gray-400">(facultatif)</span>
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {MICRO_MODULES.map((m) => (
                  <label
                    key={m.id}
                    className={
                      "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm " +
                      (micros.includes(m.id)
                        ? "border-[#bd8a34] bg-[#faf4ec]"
                        : "border-[#e8e0d8] bg-white")
                    }
                  >
                    <input
                      type="checkbox"
                      checked={micros.includes(m.id)}
                      onChange={() => toggleMicro(m.id)}
                    />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Commentaire */}
          {mode === "vide" && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Commentaire client <span className="text-gray-400">(facultatif)</span>
              </label>
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                rows={3}
                placeholder="Précisions particulières sur cette pièce..."
                className="mt-2 w-full resize-none rounded-2xl border border-[#e8d3b0] px-4 py-3 text-sm"
              />
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !!uploading}
            className="w-full rounded-2xl bg-[#bd8a34] px-6 py-4 text-sm font-medium text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? mode === "vide"
                ? "Analyse, implantation puis génération (1 à 2 min)..."
                : "Génération en cours..."
              : "Lancer"}
          </button>

          {error && <p className="text-sm text-red-600 break-all">{error}</p>}
        </div>

        {/* ── Pipeline bloqué ── */}
        {result?.blocked && (
          <div className="mt-8 rounded-3xl border-2 border-amber-300 bg-amber-50 p-8">
            <p className="text-lg font-semibold text-amber-900">
              Génération non lancée
            </p>
            <p className="mt-2 text-sm text-amber-800">
              Arrêt à l'étape {result.etape} — {result.raison}
            </p>

            {result.demandes?.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium text-amber-900">Vues nécessaires :</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-amber-800 space-y-1">
                  {result.demandes.map((d: string, i: number) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-amber-800">
                Voir l'analyse complète
              </summary>
              <pre className="mt-3 overflow-auto whitespace-pre-wrap rounded-xl bg-white p-4 text-xs text-gray-600">
                {JSON.stringify(result.analyse, null, 2)}
              </pre>
              {result.implantation && (
                <pre className="mt-3 overflow-auto whitespace-pre-wrap rounded-xl bg-white p-4 text-xs text-gray-600">
                  {JSON.stringify(result.implantation, null, 2)}
                </pre>
              )}
            </details>
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

            {result.detectedModules && (
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-700">Micro-modules détectés</p>
                <p className="mt-2 text-sm text-[#9a6f26]">
                  {result.detectedModules.length ? result.detectedModules.join(", ") : "aucun"}
                </p>
              </div>
            )}

            {result.implantation && (
              <details className="rounded-3xl bg-white p-6 shadow-sm">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  Voir l'implantation verrouillée
                </summary>
                <pre className="mt-4 overflow-auto whitespace-pre-wrap text-xs text-gray-600">
                  {JSON.stringify(result.implantation, null, 2)}
                </pre>
              </details>
            )}

            <details className="rounded-3xl bg-white p-6 shadow-sm">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
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
