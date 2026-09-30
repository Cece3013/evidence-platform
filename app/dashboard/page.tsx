"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

const OFFER_PHOTOS: Record<string, number> = {
  pro_starter: 10,
  pro_business: 30,
  pro_agency: 80,
};

// Types de pièces = modules des systèmes validés
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
];

const ROOM_TYPES_HABITE = [
  { id: "salon", label: "Salon" },
  { id: "salon_salle_a_manger", label: "Salon / Salle à manger" },
  { id: "cuisine", label: "Cuisine" },
  { id: "salle_bain", label: "Salle de bain" },
  { id: "chambre_parentale", label: "Chambre parentale" },
  { id: "chambre_enfant", label: "Chambre enfant" },
  { id: "chambre_ado", label: "Chambre ado" },
  { id: "bureau", label: "Bureau" },
  { id: "entree", label: "Entrée" },
  { id: "balcon_terrasse", label: "Balcon / Terrasse" },
  { id: "jardin", label: "Jardin" },
];

type Etat = "envoi" | "verification" | "acceptee" | "choix" | "refusee" | "erreur" | "prete";

type Photo = {
  id: string;
  file: File;
  apercu: string;
  roomType: string;
  url?: string;
  etat: Etat;
  raison?: string;
  conseil?: string;
  verification?: any;
  jeton?: string;
  options?: { id: string; label: string; description: string }[];
  choixCuisine?: string;
};

export default function RealEstateStagingDashboard() {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [quota, setQuota] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");
  const [typeBien, setTypeBien] = useState<"vide" | "habite" | "">("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const photosRef = useRef<Photo[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  // Achat de photos supplémentaires
  const [quantiteAchat, setQuantiteAchat] = useState(5);
  const [achatEnCours, setAchatEnCours] = useState(false);
  const [messageAchat, setMessageAchat] = useState("");

  photosRef.current = photos;
  const isVide = typeBien === "vide";
  const roomTypes = typeBien === "habite" ? ROOM_TYPES_HABITE : ROOM_TYPES_VIDE;

  useEffect(() => {
    fetchAccount();
    // Retour de Stripe après un achat : le crédit arrive par le webhook,
    // on relit le quota quelques secondes plus tard
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("achat") === "ok") {
      setMessageAchat("Paiement reçu : vos photos supplémentaires sont ajoutées à votre solde.");
      setTimeout(fetchQuota, 4000);
      window.history.replaceState(null, "", "/dashboard");
    }
  }, []);

  const acheterPhotos = async () => {
    setMessageAchat("");
    setAchatEnCours(true);
    try {
      const res = await fetch(API_URL + "/api/pro/projects/acheter-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token() },
        body: JSON.stringify({ quantite: quantiteAchat }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        setMessageAchat(data.error || "Impossible de lancer l'achat.");
        setAchatEnCours(false);
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setMessageAchat("Erreur réseau.");
      setAchatEnCours(false);
    }
  };

  const token = () => localStorage.getItem("evidence_pro_token");

  const fetchAccount = async () => {
    if (!token()) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(API_URL + "/api/pro/auth/me", {
        headers: { Authorization: "Bearer " + token() },
      });
      if (!res.ok) {
        localStorage.removeItem("evidence_pro_token");
        router.push("/login");
        return;
      }
      setAccount(await res.json());
      fetchQuota();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchQuota = async () => {
    try {
      const res = await fetch(API_URL + "/api/pro/projects/quota", {
        headers: { Authorization: "Bearer " + token() },
      });
      if (res.ok) setQuota(await res.json());
    } catch {
      /* le quota reste simplement non affiché */
    }
  };

  const majPhoto = (id: string, changes: Partial<Photo>) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  };

  // ── Vérification d'une photo de bien vide (même contrôle que les particuliers)
  const verifierPhoto = async (id: string, url: string, roomType: string) => {
    majPhoto(id, { etat: "verification", raison: undefined, conseil: undefined, options: undefined, choixCuisine: undefined, verification: undefined, jeton: undefined });
    try {
      const res = await fetch(API_URL + "/api/payments/verifier-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, roomType }),
      });
      const data = await res.json();
      const actuelle = photosRef.current.find((p) => p.id === id);
      if (!actuelle || actuelle.roomType !== roomType) return;

      if (!res.ok) {
        majPhoto(id, { etat: "erreur", raison: data.error || "La vérification a échoué." });
      } else if (data.statut === "REFUSEE") {
        majPhoto(id, { etat: "refusee", raison: data.raison, conseil: data.conseil });
      } else if (data.statut === "CHOIX_CUISINE") {
        majPhoto(id, {
          etat: "choix",
          verification: data.verification,
          jeton: data.jeton,
          options: data.options,
          choixCuisine: data.recommandation,
        });
      } else {
        majPhoto(id, { etat: "acceptee", verification: data.verification, jeton: data.jeton });
      }
    } catch {
      majPhoto(id, { etat: "erreur", raison: "Erreur réseau pendant la vérification." });
    }
  };

  // ── Envoi sur Cloudinary puis vérification si bien vide
  const envoyerPhoto = async (photo: Photo, vide: boolean) => {
    try {
      const formData = new FormData();
      formData.append("photo", photo.file);
      const res = await fetch(API_URL + "/api/payments/upload-photo", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.url) {
        majPhoto(photo.id, { etat: "erreur", raison: data.error || "Envoi impossible." });
        return;
      }
      majPhoto(photo.id, { url: data.url });
      if (vide) {
        const actuelle = photosRef.current.find((p) => p.id === photo.id);
        await verifierPhoto(photo.id, data.url, actuelle?.roomType || photo.roomType);
      } else {
        majPhoto(photo.id, { etat: "prete" });
      }
    } catch {
      majPhoto(photo.id, { etat: "erreur", raison: "Erreur réseau pendant l'envoi." });
    }
  };

  const ajouterPhotos = (fichiers: File[]) => {
    const nouvelles: Photo[] = fichiers.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      apercu: URL.createObjectURL(file),
      roomType: roomTypes[0].id,
      etat: "envoi",
    }));
    setPhotos((prev) => [...prev, ...nouvelles]);
    nouvelles.forEach((p) => envoyerPhoto(p, isVide));
  };

  const changerPiece = (photo: Photo, roomType: string) => {
    majPhoto(photo.id, { roomType });
    if (isVide && photo.url) verifierPhoto(photo.id, photo.url, roomType);
  };

  const reessayer = (photo: Photo) => {
    if (photo.url && isVide) verifierPhoto(photo.id, photo.url, photo.roomType);
    else {
      majPhoto(photo.id, { etat: "envoi", raison: undefined });
      envoyerPhoto(photo, isVide);
    }
  };

  const retirer = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const changerTypeBien = (t: "vide" | "habite") => {
    if (photos.length > 0 && t !== typeBien) {
      if (!confirm("Changer le type de bien retire les photos déjà ajoutées. Continuer ?")) return;
      setPhotos([]);
    }
    setTypeBien(t);
  };

  const photoPrete = (p: Photo) =>
    isVide ? p.etat === "acceptee" || (p.etat === "choix" && !!p.choixCuisine) : p.etat === "prete";
  const toutesPretes = photos.length > 0 && photos.every(photoPrete);
  const enTraitement = photos.some((p) => p.etat === "envoi" || p.etat === "verification");
  const depasseQuota = quota ? photos.length > quota.restantes : false;

  const handleSubmitProject = async () => {
    setMessage("");
    if (!projectName.trim()) return setMessage("Veuillez entrer un nom de projet.");
    if (!typeBien) return setMessage("Choisissez bien vide ou bien habité.");
    if (!toutesPretes) return setMessage("Toutes les photos doivent être acceptées avant l'envoi.");
    if (depasseQuota) return setMessage(`Il vous reste ${quota.restantes} photo(s).`);

    setSubmitting(true);
    try {
      const res = await fetch(API_URL + "/api/pro/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token() },
        body: JSON.stringify({
          projectName: projectName.trim(),
          typeBien,
          photos: photos.map((p) => ({
            url: p.url,
            roomType: p.roomType,
            verification: p.verification,
            jeton: p.jeton,
            choixCuisine: p.etat === "choix" ? p.choixCuisine : undefined,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Erreur lors de la création du projet.");
      } else {
        setMessage("Projet envoyé ! Vos visuels seront disponibles dans « Mes projets » après validation par notre équipe.");
        setProjectName("");
        setTypeBien("");
        setPhotos([]);
        fetchQuota();
      }
    } catch {
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
                <p className="text-lg font-semibold">
                  {quota ? `${quota.restantes} photo(s) disponible(s)` : `${totalPhotos} photos incluses / mois`}
                </p>
                {quota && (
                  <p className="text-xs text-gray-500">
                    {quota.inclusRestantes} / {quota.inclus} incluses ce mois-ci
                    {quota.supplementaires > 0 ? ` + ${quota.supplementaires} supplémentaire(s)` : ""}
                  </p>
                )}
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
              <h2 className="text-2xl font-semibold">Nouveau projet</h2>
              <p className="mt-2 text-gray-600">
                Un projet = un bien. Une photo par pièce, prise de l'angle le plus large possible, en journée.
              </p>

              <div className="mt-6 max-w-2xl space-y-5">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Nom du projet (ex : Appartement Lyon 6e)"
                  className="w-full rounded-2xl border border-[#e8dfd2] px-4 py-3 text-sm"
                />

                <div>
                  <p className="mb-2 text-sm font-medium">Type de bien</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(["vide", "habite"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => changerTypeBien(t)}
                        className={
                          "rounded-2xl border px-4 py-3 text-left text-sm " +
                          (typeBien === t ? "border-[#b88a44] bg-[#fbf7f0]" : "border-[#e8dfd2] bg-white")
                        }
                      >
                        <span className="font-medium">{t === "vide" ? "Bien vide" : "Bien habité"}</span>
                        <span className="mt-1 block text-gray-500">
                          {t === "vide" ? "Pièces vides à meubler et décorer" : "Pièces meublées à dépersonnaliser et valoriser"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {typeBien && (
                  <div className="rounded-2xl bg-[#faf6ef] p-6">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        ajouterPhotos(Array.from(e.target.files || []));
                        e.target.value = "";
                      }}
                      className="block w-full text-sm"
                    />
                    {isVide && (
                      <p className="mt-2 text-xs text-gray-500">
                        Chaque photo est vérifiée à l'envoi : si elle ne permet pas un aménagement fiable, nous vous indiquons comment la reprendre.
                      </p>
                    )}
                  </div>
                )}

                {photos.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-[#efe6d8] bg-white p-4">
                    <div className="flex items-center gap-4">
                      <img src={p.apercu} alt="" className="h-20 w-20 rounded-xl object-cover" />
                      <div className="flex-1">
                        <select
                          value={p.roomType}
                          onChange={(e) => changerPiece(p, e.target.value)}
                          className="w-full rounded-xl border border-[#e8dfd2] px-3 py-2 text-sm"
                        >
                          {roomTypes.map((r) => (
                            <option key={r.id} value={r.id}>{r.label}</option>
                          ))}
                        </select>
                        <p className="mt-2 text-xs text-gray-500">
                          {p.etat === "envoi" && "Envoi..."}
                          {p.etat === "verification" && "Vérification de la photo..."}
                          {(p.etat === "acceptee" || p.etat === "prete") && <span className="text-green-700">Photo acceptée</span>}
                          {p.etat === "choix" && <span className="text-[#8c6b34]">Choisissez le niveau ci-dessous</span>}
                        </p>
                      </div>
                      <button onClick={() => retirer(p.id)} className="text-sm text-red-600">Retirer</button>
                    </div>

                    {p.etat === "refusee" && (
                      <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                        <p>{p.raison}</p>
                        {p.conseil && <p className="mt-1">Conseil : {p.conseil}</p>}
                        <p className="mt-1">Retirez cette photo et ajoutez-en une autre.</p>
                      </div>
                    )}

                    {p.etat === "erreur" && (
                      <div className="mt-3 flex items-center justify-between rounded-xl bg-red-50 p-3 text-sm text-red-700">
                        <span>{p.raison}</span>
                        <button onClick={() => reessayer(p)} className="underline">Réessayer</button>
                      </div>
                    )}

                    {p.etat === "choix" && p.options && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium">
                          {p.roomType === "salle_bain" ? "Niveau de traitement de la salle de bain" : "Niveau de transformation de la cuisine"}
                        </p>
                        {p.options.map((o) => (
                          <label
                            key={o.id}
                            className={
                              "flex cursor-pointer gap-3 rounded-xl border p-3 text-sm " +
                              (p.choixCuisine === o.id ? "border-[#b88a44] bg-[#fbf7f0]" : "border-[#efe6d8]")
                            }
                          >
                            <input
                              type="radio"
                              name={`niveau-${p.id}`}
                              checked={p.choixCuisine === o.id}
                              onChange={() => majPhoto(p.id, { choixCuisine: o.id })}
                              className="mt-1"
                            />
                            <span>
                              <span className="font-medium">{o.label}</span>
                              <span className="mt-1 block text-gray-500">{o.description}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {depasseQuota && (
                  <p className="text-sm text-red-600">
                    Il vous reste {quota.restantes} photo(s). Retirez des photos, ou achetez des photos supplémentaires ci-dessous.
                  </p>
                )}
                {photos.length > 0 && !toutesPretes && !enTraitement && (
                  <p className="text-sm text-[#8c6b34]">Toutes les photos doivent être acceptées pour continuer.</p>
                )}
                {message && <p className="text-sm text-[#8c6b34]">{message}</p>}

                <button
                  onClick={handleSubmitProject}
                  disabled={submitting || !toutesPretes || enTraitement || depasseQuota || !projectName.trim()}
                  className="rounded-2xl bg-[#b88a44] px-6 py-4 font-medium text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Envoi en cours..." : `Envoyer le projet${photos.length ? ` (${photos.length} photo${photos.length > 1 ? "s" : ""})` : ""}`}
                </button>
              </div>
            </section>

            {quota && (
              <section className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold">Photos supplémentaires</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Besoin de plus de photos ce mois-ci ? {quota.prixPhotoSup} € la photo avec votre offre.
                  Les photos achetées restent valables les mois suivants tant qu'elles ne sont pas utilisées.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={quantiteAchat}
                    onChange={(e) => setQuantiteAchat(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    className="w-24 rounded-2xl border border-[#e8dfd2] px-4 py-3 text-sm"
                  />
                  <span className="text-sm text-gray-600">
                    photo(s) — total {(quantiteAchat * quota.prixPhotoSup).toFixed(2).replace(".", ",")} €
                  </span>
                  <button
                    onClick={acheterPhotos}
                    disabled={achatEnCours}
                    className="rounded-2xl border-2 border-[#b88a44] px-5 py-3 text-sm font-medium text-[#8c6b34] transition hover:bg-[#faf6ef] disabled:opacity-50"
                  >
                    {achatEnCours ? "Redirection..." : "Acheter"}
                  </button>
                </div>
                {messageAchat && <p className="mt-3 text-sm text-[#8c6b34]">{messageAchat}</p>}
              </section>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
