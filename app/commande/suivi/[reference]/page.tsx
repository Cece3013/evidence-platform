
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

export default function SuiviPage() {
  const params = useParams();
  const reference = params?.reference as string;

  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reference) return;

    fetch(`${API_URL}/api/payments/suivi/${encodeURIComponent(reference)}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || "Commande introuvable.");
          setStatus("error");
          return;
        }
        setData(json);
        setStatus("ok");
      })
      .catch(() => {
        setError("Erreur réseau. Réessayez dans quelques instants.");
        setStatus("error");
      });
  }, [reference]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f4ef]">
        <p className="text-gray-500">Chargement de votre commande...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#f7f4ef] py-16 px-6">
        <div className="mx-auto max-w-2xl rounded-[36px] bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-semibold">Commande introuvable</h1>
          <p className="mt-4 text-gray-600">{error}</p>
          <p className="mt-6 text-sm text-gray-500">
            Vérifiez le lien reçu par email, ou contactez-nous à{" "}
            <a href="mailto:contact@evidence-homestaging.fr" className="text-[#8c6b34] underline">
              contact@evidence-homestaging.fr
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1f1f] py-12 px-6">
      <div className="mx-auto max-w-4xl space-y-8">

        <section className="text-center">
          <p className="text-sm uppercase tracking-wide text-[#8c6b34]">
            Suivi de commande
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Bonjour {data.clientName}
          </h1>
          <p className="mt-3 text-gray-500">
            Référence {data.reference} · {data.formule}
          </p>
        </section>

        {!data.pretALivrer && (
          <section className="rounded-[36px] bg-white p-8 shadow-sm text-center">
            <p className="text-lg font-medium">Votre commande est en cours de préparation</p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              {data.isHabite
                ? "Notre équipe analyse votre bien et prépare votre rapport personnalisé. Vous recevrez un email dès qu'il sera disponible ici, sous 48 à 72h."
                : "Nos visuels sont en cours de préparation et vérifiés un par un avant livraison. Vous recevrez un email dès qu'ils seront disponibles ici, sous 12h."}
            </p>
            <p className="mt-5 text-sm text-gray-400">
              Conservez ce lien, vos fichiers apparaîtront sur cette page.
            </p>
          </section>
        )}

        {data.pretALivrer && data.isHabite && data.rapportPdf && (
          <section className="rounded-[36px] bg-white p-8 shadow-sm text-center">
            <p className="text-lg font-medium">Votre rapport est prêt</p>
            <p className="mt-3 text-gray-600">
              Retrouvez l'analyse complète de votre bien et nos conseils pièce par pièce.
            </p>
            
             <a href={data.rapportPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-2xl bg-[#b88a44] px-8 py-4 text-sm font-medium text-white shadow-md transition hover:opacity-90"
            >
              Télécharger mon rapport PDF
            </a>
          </section>
        )}

        {data.pretALivrer && !data.isHabite && data.photosApres?.length > 0 && (
          <section className="rounded-[36px] bg-white p-8 shadow-sm">
            <div className="text-center">
              <p className="text-lg font-medium">Vos visuels sont prêts</p>
              <p className="mt-2 text-gray-600">
                Téléchargement illimité en haute définition.
              </p>
            </div>

            <div className="mt-8 space-y-8">
              {data.photosApres.map((photo: any, i: number) => (
                <div key={i}>
                  <p className="text-sm font-medium text-[#8c6b34] mb-3">{photo.piece}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.photosAvant[i] && (
                      <div>
                        <p className="text-xs text-gray-400 mb-2">Avant</p>
                        <img
                          src={data.photosAvant[i].url}
                          alt="Avant"
                          className="w-full rounded-2xl"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Après</p>
                      <img src={photo.url} alt="Après" className="w-full rounded-2xl" />
                      
                       <a href={photo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block rounded-xl border border-[#d8c5a2] px-5 py-2 text-sm transition hover:bg-[#f7f4ef]"
                      >
                        Télécharger en HD
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="text-center">
          <p className="text-sm text-gray-500">
            Une question sur votre commande ?{" "}
            <a href="mailto:contact@evidence-homestaging.fr" className="text-[#8c6b34] underline">
              contact@evidence-homestaging.fr
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}
