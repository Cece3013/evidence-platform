"use client";

import { useEffect, useRef, useState } from "react";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

// Types de pièces = modules du pipeline V1 (identifiants identiques au backend)
const ROOM_TYPES = [
  { id: "salon", label: "Salon" },
  { id: "salon_salle_a_manger", label: "Salon / Salle à manger" },
  { id: "cuisine", label: "Cuisine" },
  { id: "salle_bain", label: "Salle de bain" },
  { id: "chambre_parentale", label: "Chambre parentale" },
  { id: "chambre_enfant", label: "Chambre enfant" },
  { id: "chambre_ado", label: "Chambre ado" },
  { id: "balcon_terrasse", label: "Balcon / Terrasse" },
  { id: "entree", label: "Entrée" },
];

type EtatPhoto = "envoi" | "verification" | "acceptee" | "choix" | "refusee" | "erreur" | "prete";

type OptionCuisine = { id: string; label: string; description: string };

type Photo = {
  id: string;
  file: File;
  preview: string;
  roomType: string;
  url?: string;
  etat: EtatPhoto;
  verification?: any;
  jeton?: string;
  raison?: string;
  conseil?: string | null;
  options?: OptionCuisine[];
  choixCuisine?: string;
};

export default function CommandePage() {
  const [step, setStep] = useState(1);
  const [formulas, setFormulas] = useState<any[]>([]);
  const [optionsList, setOptionsList] = useState<any[]>([]);
  const [propertyType, setPropertyType] = useState<"vide" | "habite" | "">("");
  const [formulaId, setFormulaId] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [client, setClient] = useState({ name: "", email: "", phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState("");
  const compteur = useRef(0);
  // Copie toujours à jour de la liste des photos (lue dans les réponses réseau)
  const photosRef = useRef<Photo[]>([]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    fetch(API_URL + "/api/payments/formulas")
      .then((r) => r.json())
      .then((d) => {
        setFormulas(d.formulas || []);
        setOptionsList(d.options || []);
      })
      .catch(() => setError("Impossible de charger les offres."));
  }, []);

  const formula = formulas.find((f) => f.id === formulaId);
  const maxPhotos = formula?.maxPhotos || formula?.maxRooms || 0;
  const isVide = propertyType === "vide";

  const total =
    (formula?.price || 0) +
    Object.entries(selectedOptions).reduce((sum, [id, qty]) => {
      const opt = optionsList.find((o) => o.id === id);
      return sum + (opt ? opt.price * qty : 0);
    }, 0);

  // ── Mise à jour d'une photo précise (sans écraser les autres) ──────────────
  const majPhoto = (id: string, changes: Partial<Photo>) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  };

  // ── Vérification d'une photo de bien vide (Contrôle Photo V1) ──────────────
  const verifierPhoto = async (id: string, url: string, roomType: string) => {
    majPhoto(id, { etat: "verification", raison: undefined, conseil: undefined, options: undefined, choixCuisine: undefined, verification: undefined, jeton: undefined });
    try {
      const res = await fetch(API_URL + "/api/payments/verifier-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, roomType }),
      });
      const data = await res.json();

      // La pièce a pu changer (ou la photo être retirée) pendant la vérification :
      // on ignore alors cette réponse devenue périmée
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

  // ── Envoi d'une photo sur Cloudinary, puis vérification si bien vide ───────
  const envoyerPhoto = async (photo: Photo) => {
    try {
      const formData = new FormData();
      formData.append("photo", photo.file);
      const upRes = await fetch(API_URL + "/api/payments/upload-photo", { method: "POST", body: formData });
      const upData = await upRes.json();
      if (!upRes.ok || !upData.url) {
        majPhoto(photo.id, { etat: "erreur", raison: "L'envoi de la photo a échoué." });
        return;
      }
      majPhoto(photo.id, { url: upData.url });
      if (isVide) {
        await verifierPhoto(photo.id, upData.url, photo.roomType);
      } else {
        majPhoto(photo.id, { etat: "prete" });
      }
    } catch {
      majPhoto(photo.id, { etat: "erreur", raison: "Erreur réseau pendant l'envoi." });
    }
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const added: Photo[] = files.map((file) => ({
      id: `p${++compteur.current}`,
      file,
      roomType: ROOM_TYPES[0].id,
      preview: URL.createObjectURL(file),
      etat: "envoi",
    }));
    setPhotos((prev) => [...prev, ...added]);
    e.target.value = "";
    added.forEach((p) => envoyerPhoto(p));
  };

  const setPhotoRoom = (photo: Photo, roomType: string) => {
    majPhoto(photo.id, { roomType });
    // Le contrôle dépend du type de pièce : on revérifie
    if (isVide && photo.url) verifierPhoto(photo.id, photo.url, roomType);
  };

  const reessayer = (photo: Photo) => {
    if (!photo.url) {
      majPhoto(photo.id, { etat: "envoi", raison: undefined });
      envoyerPhoto(photo);
    } else if (isVide) {
      verifierPhoto(photo.id, photo.url, photo.roomType);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Une photo est prête pour le paiement si elle est acceptée (ou choix cuisine fait)
  const photoPrete = (p: Photo) =>
    isVide ? p.etat === "acceptee" || (p.etat === "choix" && !!p.choixCuisine) : p.etat === "prete";

  const toutesPretes = photos.length > 0 && photos.every(photoPrete);
  const enTraitement = photos.some((p) => p.etat === "envoi" || p.etat === "verification");
  const photosEnTrop = Math.max(0, photos.length - maxPhotos);

  const allerAuxOptions = () => {
    // Bien vide : on ajoute automatiquement les photos supplémentaires nécessaires
    if (isVide && photosEnTrop > 0) {
      setSelectedOptions((prev) => ({
        ...prev,
        photo_supplementaire: Math.max(prev.photo_supplementaire || 0, photosEnTrop),
      }));
    }
    setStep(4);
  };

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = 1;
      return next;
    });
  };

  const setOptionQty = (id: string, qty: number) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: Math.max(1, qty || 1) }));
  };

  const handlePay = async () => {
    setError("");
    if (!client.name || !client.email || !client.phone || !client.address) {
      setError("Merci de remplir tous les champs.");
      return;
    }
    if (!toutesPretes) {
      setError("Certaines photos ne sont pas encore prêtes. Revenez à l'étape Photos.");
      return;
    }
    setSubmitting(true);
    setUploadProgress("Préparation du paiement...");

    try {
      const res = await fetch(API_URL + "/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formulaId,
          options: Object.entries(selectedOptions).map(([id, quantity]) => ({ id, quantity })),
          clientEmail: client.email,
          metadata: {
            clientName: client.name,
            clientEmail: client.email,
            clientPhone: client.phone,
            propertyAddress: client.address,
            propertyType,
            photoCount: String(photos.length),
          },
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
      if (!res.ok || !data.checkoutUrl) {
        setError(data.error || "Erreur lors de la création du paiement.");
        setUploadProgress("");
        setSubmitting(false);
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
      setError("Erreur réseau. Veuillez réessayer.");
      setUploadProgress("");
      setSubmitting(false);
    }
  };

  const stepTitles = ["Votre bien", "Votre formule", "Vos photos", "Options", "Vos coordonnées", "Récapitulatif"];

  const badgeEtat = (p: Photo) => {
    switch (p.etat) {
      case "envoi":
        return <span className="text-xs text-gray-500">Envoi de la photo...</span>;
      case "verification":
        return <span className="text-xs text-gray-500">Vérification de la photo...</span>;
      case "acceptee":
        return <span className="text-xs font-medium text-green-700">Photo acceptée</span>;
      case "prete":
        return <span className="text-xs font-medium text-green-700">Photo reçue</span>;
      case "choix":
        return <span className="text-xs font-medium text-green-700">Photo acceptée · choisissez le niveau de transformation</span>;
      case "refusee":
        return <span className="text-xs font-medium text-red-600">Photo non exploitable</span>;
      case "erreur":
        return <span className="text-xs font-medium text-red-600">Échec</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1f1f] py-10 px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-wide text-[#8c6b34] text-center">
          Commander
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-center">
          {stepTitles[step - 1]}
        </h1>

        <div className="mt-6 flex gap-2">
          {stepTitles.map((_, i) => (
            <div
              key={i}
              className={
                "h-1 flex-1 rounded-full " + (i < step ? "bg-[#b88a44]" : "bg-[#e5ddd0]")
              }
            />
          ))}
        </div>

        <div className="mt-8 rounded-[36px] bg-white p-8 shadow-sm">

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-gray-500">Votre bien est-il vide ou habité ?</p>
              <button
                onClick={() => { setPropertyType("vide"); setFormulaId(""); setPhotos([]); setStep(2); }}
                className="w-full rounded-3xl border-2 border-[#efe6d8] p-6 text-left transition hover:border-[#b88a44]"
              >
                <p className="text-lg font-semibold">Bien vide</p>
                <p className="mt-1 text-sm text-gray-500">
                  Nous aménageons vos pièces vides pour aider les acheteurs à se projeter.
                </p>
              </button>
              <button
                onClick={() => { setPropertyType("habite"); setFormulaId(""); setPhotos([]); setStep(2); }}
                className="w-full rounded-3xl border-2 border-[#efe6d8] p-6 text-left transition hover:border-[#b88a44]"
              >
                <p className="text-lg font-semibold">Bien habité</p>
                <p className="mt-1 text-sm text-gray-500">
                  Nous valorisons votre intérieur existant avec un rapport personnalisé.
                </p>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {formulas.filter((f) => f.type === propertyType).map((f) => (
                <button
                  key={f.id}
                  onClick={() => { setFormulaId(f.id); setStep(3); }}
                  className={
                    "w-full rounded-3xl border-2 p-6 text-left transition hover:border-[#b88a44] " +
                    (formulaId === f.id ? "border-[#b88a44]" : "border-[#efe6d8]")
                  }
                >
                  <div className="flex items-baseline justify-between">
                    <p className="text-lg font-semibold">{f.label}</p>
                    <p className="text-2xl font-semibold">{f.price}€</p>
                  </div>
                </button>
              ))}
              <button onClick={() => setStep(1)} className="text-sm text-gray-500 underline">
                Retour
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <p className="text-gray-500">
                Votre formule inclut {maxPhotos} {formula?.maxRooms ? "pièces" : "photos"}.
                Vous en avez ajouté {photos.length}.
              </p>

              {isVide && (
                <p className="text-sm text-gray-500 leading-relaxed">
                  Une photo par pièce, prise de l'angle le plus large possible, en journée.
                  Chaque photo est vérifiée à l'envoi : si elle ne permet pas un aménagement fiable,
                  nous vous indiquons comment la reprendre.
                </p>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotos}
                className="w-full rounded-2xl border border-[#d8c5a2] px-4 py-3 text-sm"
              />

              {photosEnTrop > 0 && maxPhotos > 0 && (
                <p className="text-sm text-[#8c6b34]">
                  Vous dépassez le nombre inclus de {photosEnTrop}.
                  {isVide
                    ? " L'option « Photo supplémentaire » sera ajoutée automatiquement à l'étape suivante."
                    : " Ajoutez l'option « Photo supplémentaire » à l'étape suivante."}
                </p>
              )}

              <div className="space-y-3">
                {photos.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-[#efe6d8] p-3">
                    <div className="flex items-center gap-4">
                      <img src={p.preview} alt="" className="h-16 w-16 rounded-xl object-cover" />
                      <div className="flex-1 space-y-2">
                        <select
                          value={p.roomType}
                          onChange={(e) => setPhotoRoom(p, e.target.value)}
                          disabled={p.etat === "envoi" || p.etat === "verification"}
                          className="w-full rounded-xl border border-[#d8c5a2] px-3 py-2 text-sm"
                        >
                          {ROOM_TYPES.map((r) => (
                            <option key={r.id} value={r.id}>{r.label}</option>
                          ))}
                        </select>
                        <div>{badgeEtat(p)}</div>
                      </div>
                      <button onClick={() => removePhoto(p.id)} className="text-sm text-red-600">
                        Retirer
                      </button>
                    </div>

                    {p.etat === "refusee" && (
                      <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                        <p>{p.raison}</p>
                        {p.conseil && <p className="mt-1">Conseil : {p.conseil}</p>}
                        <p className="mt-1 text-red-600">Retirez cette photo et ajoutez-en une autre.</p>
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
                        <p className="text-sm font-medium">Niveau de transformation de la cuisine</p>
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
                              name={`cuisine-${p.id}`}
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
              </div>

              {photos.length > 0 && !toutesPretes && !enTraitement && (
                <p className="text-sm text-[#8c6b34]">
                  Toutes les photos doivent être acceptées pour continuer.
                </p>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="text-sm text-gray-500 underline">
                  Retour
                </button>
                <button
                  onClick={allerAuxOptions}
                  disabled={!toutesPretes || enTraitement}
                  className="ml-auto rounded-2xl bg-[#b88a44] px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
                >
                  {enTraitement ? "Vérification en cours..." : "Continuer"}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              {optionsList.map((o) => (
                <div key={o.id} className="rounded-2xl border border-[#efe6d8] p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedOptions[o.id]}
                      onChange={() => toggleOption(o.id)}
                    />
                    <span className="flex-1 text-sm font-medium">{o.label}</span>
                    <span className="text-sm">{o.price}€</span>
                  </label>
                  {o.multiple && selectedOptions[o.id] && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-sm text-gray-500">Quantité</span>
                      <input
                        type="number"
                        min={1}
                        value={selectedOptions[o.id]}
                        onChange={(e) => setOptionQty(o.id, parseInt(e.target.value))}
                        className="w-20 rounded-xl border border-[#d8c5a2] px-3 py-2 text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}

              <p className="text-right text-lg font-semibold">Total : {total}€</p>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="text-sm text-gray-500 underline">
                  Retour
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="ml-auto rounded-2xl bg-[#b88a44] px-6 py-3 text-sm font-medium text-white"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              {[
                { key: "name", label: "Nom complet", type: "text" },
                { key: "email", label: "Email", type: "email" },
                { key: "phone", label: "Téléphone", type: "tel" },
                { key: "address", label: "Adresse du bien", type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-sm font-medium text-gray-700">{f.label}</label>
                  <input
                    type={f.type}
                    value={(client as any)[f.key]}
                    onChange={(e) => setClient({ ...client, [f.key]: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-[#d8c5a2] px-4 py-3 text-sm"
                  />
                </div>
              ))}

              <div className="flex gap-3">
                <button onClick={() => setStep(4)} className="text-sm text-gray-500 underline">
                  Retour
                </button>
                <button
                  onClick={() => setStep(6)}
                  className="ml-auto rounded-2xl bg-[#b88a44] px-6 py-3 text-sm font-medium text-white"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Formule</span>
                  <span>{formula?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Photos</span>
                  <span>{photos.length}</span>
                </div>
                {Object.entries(selectedOptions).map(([id, qty]) => {
                  const o = optionsList.find((x) => x.id === id);
                  return (
                    <div key={id} className="flex justify-between">
                      <span className="text-gray-500">{o?.label}{qty > 1 ? ` x${qty}` : ""}</span>
                      <span>{(o?.price || 0) * qty}€</span>
                    </div>
                  );
                })}
                <div className="flex justify-between border-t border-[#efe6d8] pt-3 text-lg font-semibold">
                  <span>Total</span>
                  <span>{total}€</span>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={submitting}
                className="w-full rounded-2xl bg-[#b88a44] px-6 py-4 text-sm font-medium text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? (uploadProgress || "Traitement...") : "Payer " + total + "€"}
              </button>

              <button onClick={() => setStep(5)} className="text-sm text-gray-500 underline">
                Retour
              </button>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
