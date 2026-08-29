
export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1f1f] py-12 px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-wide text-[#8c6b34] text-center">
          Evidence Home Staging
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-center">
          Politique de confidentialité
        </h1>

        <div className="mt-10 rounded-[36px] bg-white p-8 md:p-10 shadow-sm space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Données collectées</h2>
            <p className="mt-2">Nous collectons uniquement les données nécessaires à la fourniture des services :</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Nom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone (facultatif)</li>
              <li>Adresse du bien concerné</li>
              <li>Informations transmises par le client (photos, description du bien, etc.)</li>
              <li>Données liées aux commandes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Finalités</h2>
            <p className="mt-2">Les données sont utilisées pour :</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>fournir les prestations</li>
              <li>gérer la relation client</li>
              <li>traiter les paiements et émettre les factures</li>
              <li>répondre aux demandes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Absence de suivi publicitaire</h2>
            <p className="mt-2">
              Aucune donnée n&apos;est utilisée à des fins de suivi publicitaire, de profilage ou de revente à des tiers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Base légale</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>consentement de l&apos;utilisateur</li>
              <li>exécution du contrat</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Durée de conservation</h2>
            <p className="mt-2">
              Les données sont conservées pendant une durée maximale de 3 ans après le dernier contact, à l&apos;exception des documents comptables conservés conformément aux obligations légales.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Destinataires et sous-traitants</h2>
            <p className="mt-2">
              Les données sont destinées à Evidence Home Staging. Pour assurer le fonctionnement du service, certaines données sont traitées par des prestataires techniques agissant en qualité de sous-traitants :
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Stripe — traitement sécurisé des paiements</li>
              <li>Cloudinary — hébergement des photographies transmises</li>
              <li>Notion — gestion des dossiers clients</li>
              <li>Resend — envoi des emails transactionnels</li>
              <li>OpenAI — génération des projections visuelles</li>
              <li>Vercel et Railway — hébergement du site et des services</li>
            </ul>
            <p className="mt-2">
              Ces prestataires n&apos;utilisent les données que pour l&apos;exécution des services confiés. Certains d&apos;entre eux étant situés hors de l&apos;Union européenne, les transferts sont encadrés par les garanties prévues par le RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Sécurité</h2>
            <p className="mt-2">
              Les données sont traitées de manière sécurisée et confidentielle.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Droits des utilisateurs</h2>
            <p className="mt-2">
              Conformément au Règlement général sur la protection des données, vous disposez des droits suivants :
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>accès</li>
              <li>rectification</li>
              <li>suppression</li>
              <li>opposition</li>
              <li>portabilité</li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits : contact@evidence-homestaging.fr
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Application mobile</h2>
            <p className="mt-2">
              L&apos;application mobile ne réalise aucun suivi publicitaire ni tracking utilisateur.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Liens externes</h2>
            <p className="mt-2">
              Le site peut contenir des liens vers des services tiers (réseaux sociaux), soumis à leurs propres politiques de confidentialité.
            </p>
          </section>

          <p className="pt-4 text-xs text-gray-400">
            Dernière mise à jour : août 2026
          </p>

        </div>
      </div>
    </div>
  );
}
