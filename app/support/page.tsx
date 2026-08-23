"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

export default function SupportPage() {
  const router = useRouter();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    const token = localStorage.getItem("evidence_pro_token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(API_URL + "/api/pro/auth/me", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        localStorage.removeItem("evidence_pro_token");
        router.push("/login");
        return;
      }
      const data = await res.json();
      setAccount(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("evidence_pro_token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setResult({ type: "error", text: "Merci de remplir le sujet et le message." });
      return;
    }

    setSending(true);
    setResult(null);
    try {
      const res = await fetch(API_URL + "/api/pro/auth/support-request", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
          companyName: account?.companyName,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({ type: "error", text: data.error || "Erreur lors de l'envoi." });
      } else {
        setResult({ type: "success", text: "Votre demande a bien été envoyée. Nous vous répondrons rapidement." });
        setSubject("");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setResult({ type: "error", text: "Erreur réseau. Veuillez réessayer." });
    }
    setSending(false);
  };

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

            <section>
              <p className="text-sm uppercase tracking-wide text-[#8c6b34]">
                Assistance
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                Support
              </h1>

              <p className="mt-3 text-gray-500">
                Une question, un problème ? Envoyez-nous un message, nous vous répondrons rapidement.
              </p>
            </section>

            <section className="rounded-[36px] bg-white p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Sujet</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex : Question sur ma facture"
                    className="mt-2 w-full rounded-2xl border border-[#d8c5a2] px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Décrivez votre demande en détail..."
                    rows={6}
                    className="mt-2 w-full rounded-2xl border border-[#d8c5a2] px-4 py-3 text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-2xl bg-[#b88a44] px-6 py-4 text-sm font-medium text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? "Envoi..." : "Envoyer la demande"}
                </button>

                {result && (
                  <p
                    className={
                      "text-sm " +
                      (result.type === "success" ? "text-green-700" : "text-red-600")
                    }
                  >
                    {result.text}
                  </p>
                )}
              </form>

              <div className="mt-8 border-t border-[#efe6d8] pt-6">
                <p className="text-sm text-gray-500">
                  Vous pouvez aussi nous contacter directement à{" "}
                  <a href="mailto:contact@evidence-homestaging.fr" className="text-[#8c6b34] underline">
                    contact@evidence-homestaging.fr
                  </a>
                </p>
              </div>
            </section>

          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
