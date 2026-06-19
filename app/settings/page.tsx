"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://poetic-youthfulness-production-fecb.up.railway.app";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async () => {
    setError("");
    if (!email.trim()) {
      setError("Veuillez entrer votre email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URL + "/api/pro/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'envoi du code.");
        setLoading(false);
        return;
      }
      setStep("code");
    } catch (err) {
      setError("Erreur reseau. Veuillez reessayer.");
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    setError("");
    if (!code.trim()) {
      setError("Veuillez entrer le code recu.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URL + "/api/pro/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Code invalide.");
        setLoading(false);
        return;
      }
      localStorage.setItem("evidence_pro_token", data.token);
      localStorage.setItem("evidence_pro_email", email.trim());
      router.push("/dashboard");
    } catch (err) {
      setError("Erreur reseau. Veuillez reessayer.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f4ef] px-6">
      <div className="w-full max-w-md rounded-[32px] bg-white p-10 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">
            Evidence Home Staging
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Espace professionnel
          </p>
        </div>

        {step === "email" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Email professionnel
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@agence.fr"
                className="w-full rounded-2xl border border-[#e8dfd2] px-4 py-3 text-sm focus:outline-none focus:border-[#b88a44]"
                onKeyDown={(e) => { if (e.key === "Enter") handleSendCode(); }}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-full rounded-2xl bg-[#b88a44] px-6 py-3 text-sm font-medium text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Envoi en cours..." : "Recevoir mon code"}
            </button>
          </div>
        )}

        {step === "code" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Un code a 6 chiffres a ete envoye a votre adresse email.
            </p>
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Code de connexion
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full rounded-2xl border border-[#e8dfd2] px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:border-[#b88a44]"
                onKeyDown={(e) => { if (e.key === "Enter") handleVerifyCode(); }}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={handleVerifyCode}
              disabled={loading}
              className="w-full rounded-2xl bg-[#233124] px-6 py-3 text-sm font-medium text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Verification..." : "Se connecter"}
            </button>
            <button
              onClick={() => setStep("email")}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Changer d'email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
