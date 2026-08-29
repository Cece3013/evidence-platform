
"use client";

import { useEffect, useState } from "react";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

export default function ConfirmationPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session");

    if (!sessionId) {
      setError("Session de paiement introuvable.");
      setStatus("error");
      return;
    }

    fetch(API_URL + "/api/payments/finalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Erreur lors de la confirmation.");
          setStatus("error");
          return;
        }
        setOrder(data);
        setStatus("success");
      })
      .catch(() => {
        setError("Erreur réseau. Votre paiement a bien été pris en compte, contactez-nous si besoin.");
        setStatus("error");
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1f1f] py-16 px-6">
      <div className="mx-auto max-w-2xl">

        {status === "loading" && (
          <div className="rounded-[36px] bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">Confirmation de votre commande en cours...</p>
          </div>
        )}

        {status === "success" && order && (
          <div className="rounded-[36px] bg-white p-10 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-[#8c6b34] text-center">
              Commande confirmée
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-center">
              Merci {order.clientName || ""} !
            </h1>

            <p className="mt-5 text-center text-gray-600 leading-relaxed">
              Votre paiement a bien été enregistré et nous avons reçu vos {order.photoCount} photo(s).
            </p>

            <p className="mt-4 text-center text-gray-600 leading-relaxed">
              {order.isHabite
                ? "Notre équipe analyse votre bien et vous enverra votre rapport personnalisé sous 48 à 72h."
                : "Vos visuels sont en cours de préparation et vous seront livrés sous 12h."}
            </p>

            <div className="mt-8 rounded-2xl bg-[#f7f4ef] p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Référence</span>
                <span className="font-medium">{order.referenceDossier}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-gray-500">Formule</span>
                <span className="font-medium">{order.formulaLabel}</span>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              Un email de confirmation vient de vous être envoyé.
            </p>

            <p className="mt-6 text-center text-sm text-gray-500">
              Une question ?{" "}
              <a href="mailto:contact@evidence-homestaging.fr" className="text-[#8c6b34] underline">
                contact@evidence-homestaging.fr
              </a>
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-[36px] bg-white p-10 shadow-sm text-center">
            <h1 className="text-2xl font-semibold">Un problème est survenu</h1>
            <p className="mt-4 text-gray-600">{error}</p>
            <p className="mt-6 text-sm text-gray-500">
              Contactez-nous à{" "}
              <a href="mailto:contact@evidence-homestaging.fr" className="text-[#8c6b34] underline">
                contact@evidence-homestaging.fr
              </a>{" "}
              en précisant votre nom, nous retrouverons votre commande.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
