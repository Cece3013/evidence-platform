
"use client";

import { useEffect, useState } from "react";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

const ROOM_TYPES = [
  { id: "salon", label: "Salon" },
  { id: "salon_salle_a_manger", label: "Salon / Salle à manger" },
  { id: "cuisine", label: "Cuisine" },
  { id: "salle_bain", label: "Salle de bain" },
  { id: "chambre_parentale", label: "Chambre parentale" },
  { id: "chambre_enfant", label: "Chambre enfant" },
  { id: "chambre_ado", label: "Chambre ado" },
  { id: "coin_repas", label: "Coin repas" },
  { id: "balcon_terrasse", label: "Balcon / Terrasse" },
  { id: "bureau", label: "Bureau" },
];

type Photo = { file: File; roomType: string; preview: string };

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
  const [error, setError] = useState("");

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

  const total =
    (formula?.price || 0) +
    Object.entries(selectedOptions).reduce((sum, [id, qty]) => {
      const opt = optionsList.find((o) => o.id === id);
      return sum + (opt ? opt.price * qty : 0);
    }, 0);

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const room = ROOM_TYPES[0].id;
    const added = files.map((file) => ({
      file,
      roomType: room,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...added]);
    e.target.value = "";
  };

  const setPhotoRoom = (index: number, roomType: string) => {
    setPhotos((prev) => prev.map((p, i) => (i === index ? { ...p, roomType } : p)));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleOption = (id: string, multiple: boolean) => {
    setSelectedOptions((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = 1;
      return next;
    });
  };

  const setOptionQty = (id: string, qty: number) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: Math.max(1, qty) }));
  };

  const handlePay = async () => {
    setError("");
    if (!client.name || !client.email || !client.phone || !client.address) {
      setError("Merci de remplir tous les champs.");
      return;
    }
    setSubmitting(true);
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
            rooms: photos.map((p) => p.roomType).join(","),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        setError(data.error || "Erreur lors de la création du paiement.");
        setSubmitting(false);
        return;
      }
      sessionStorage.setItem("evidence_order_id", data.orderId);
      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
      setError("Erreur réseau. Veuillez réessayer.");
      setSubmitting(false);
    }
  };

  const stepTitles = ["Votre bien", "Votre formule", "Vos photos", "Options", "Vos coordonnées", "Récapitulatif"];

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
                onClick={() => { setPropertyType("vide"); setFormulaId(""); setStep(2); }}
                className="w-full rounded-3xl border-2 border-[#efe6d8] p-6 text-left transition hover:border-[#b88a44]"
              >
                <p className="text-lg font-semibold">Bien vide</p>
                <p className="mt-1 text-sm text-gray-500">
                  Nous aménageons vos pièces vides pour aider les acheteurs à se projeter.
                </p>
              </button>
              <button
                onClick={() => { setPropertyType("habite"); setFormulaId(""); setStep(2); }}
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

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotos}
                className="w-full rounded-2xl border border-[#d8c5a2] px-4 py-3 text-sm"
              />

              {photos.length > maxPhotos && (
                <p className="text-sm text-[#8c6b34]">
                  Vous dépassez le nombre inclus. Ajoutez l'option « Photo supplémentaire » à l'étape suivante.
                </p>
              )}

              <div className="space-y-3">
                {photos.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-2xl border border-[#efe6d8] p-3">
                    <img src={p.preview} alt="" className="h-16 w-16 rounded-xl object-cover" />
                    <select
                      value={p.roomType}
                      onChange={(e) => setPhotoRoom(i, e.target.value)}
                      className="flex-1 rounded-xl border border-[#d8c5a2] px-3 py-2 text-sm"
                    >
                      {ROOM_TYPES.map((r) => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                    <button onClick={() => removePhoto(i)} className="text-sm text-red-600">
                      Retirer
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="text-sm text-gray-500 underline">
                  Retour
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={photos.length === 0}
                  className="ml-auto rounded-2xl bg-[#b88a44] px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
                >
                  Continuer
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
                      onChange={() => toggleOption(o.id, o.multiple)}
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
                {submitting ? "Redirection vers le paiement..." : "Payer " + total + "€"}
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
