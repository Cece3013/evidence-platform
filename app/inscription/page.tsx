"use client";

import { useState } from "react";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

const OFFERS = [
  { id: "pro_starter", priceId: "price_1TjdIzBtigY0O7pljXLznLIs", label: "PRO Starter", price: "49€/mois", description: "10 photos incluses par mois" },
  { id: "pro_business", priceId: "price_1TjdJIBtigY0O7plmAViGr2c", label: "PRO Business", price: "99€/mois", description: "Idéal pour les agences actives" },
  { id: "pro_agency", priceId: "price_1TjdJbBtigY0O7plhTK1GXe4", label: "PRO Agency", price: "199€/mois", description: "Pour les grands volumes" },
];

export default function InscriptionPage() {
  const [selectedOffer, setSelectedOffer] = useState("pro_starter");
  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!companyName.trim() || !siret.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setError("Merci de remplir tous les champs.");
      return;
    }

    const offer = OFFERS.find((o) => o.id === selectedOffer);
    if (!offer) return;

    setSubmitting(true);
    try {
      const res = await fetch(API_URL + "/api/pro/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: offer.priceId,
          companyName,
          siret,
          email,
          phone,
          address,
          offerId: offer.id,
          subscriptionDate: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        setError(data.error || "Erreur lors de la création de votre abonnement.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
      setError("Erreur réseau. Veuillez réessayer.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1f1f] py-12 px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-wide text-[#8c6b34] text-center">
          Rejoignez Evidence Home Staging
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-center">
          Devenir partenaire PRO
        </h1>
        <p className="mt-3 text-gray-500 text-center">
          Choisissez votre offre et créez votre compte professionnel.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {OFFERS.map((offer) => (
            <button
              key={offer.id}
              type="button"
              onClick={() => setSelectedOffer(offer.id)}
              className={
                "rounded-3xl p-6 text-left border-2 transition " +
                (selectedOffer === offer.id
                  ? "border-[#b88a44] bg-white shadow-md"
                  : "border-transparent bg-white/60 hover:bg-white")
              }
            >
              <p className="text-sm uppercase tracking-wide text-[#8c6b34]">{offer.label}</p>
              <p className="mt-2 text-2xl font-semibold">{offer.price}</p>
              <p className="mt-2 text-sm text-gray-500">{offer.description}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-10 rounded-[36px] bg-white p-8 shadow-sm space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Nom de l'entreprise</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#d8c5a2] px-4 py-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">SIRET</label>
              <input
                type="text"
                value={siret}
                onChange={(e) => setSiret(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#d8c5a2] px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#d8c5a2] px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#d8c5a2] px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Adresse</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#d8c5a2] px-4 py-3 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-[#b88a44] px-6 py-4 text-sm font-medium text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Redirection vers le paiement..." : "Continuer vers le paiement"}
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}
