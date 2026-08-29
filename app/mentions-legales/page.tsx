export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1f1f] py-12 px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-wide text-[#8c6b34] text-center">
          Evidence Home Staging
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-center">
          Mentions légales
        </h1>

        <div className="mt-10 rounded-[36px] bg-white p-8 md:p-10 shadow-sm space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Éditeur du site</h2>
            <p className="mt-2">
              Nom de l&apos;entreprise : Evidence Home Staging<br />
              Statut : Auto-entrepreneur<br />
              Siège social : 675 route d&apos;Aigues-Vives, 30420 Calvisson<br />
              SIRET : 80876342900020<br />
              Email : contact@evidence-homestaging.fr<br />
              Téléphone : 06 12 95 04 95<br />
              Directrice de la publication : Cécile PINTARD
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Hébergement</h2>
            <p className="mt-2">
              Le site est hébergé par :<br />
              Vercel Inc.<br />
              440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
              https://vercel.com
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Activité</h2>
            <p className="mt-2">
              Le site a pour objet la présentation et la commercialisation des services de home staging proposés par Evidence Home Staging, accessibles via le site internet et une application mobile.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Propriété intellectuelle</h2>
            <p className="mt-2">
              L&apos;ensemble des contenus (textes, images, visuels, logos) est protégé.<br />
              Toute reproduction ou utilisation sans autorisation préalable est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Données personnelles</h2>
            <p className="mt-2">
              Les données sont traitées conformément au Règlement général sur la protection des données.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#1f1f1f]">Contact</h2>
            <p className="mt-2">
              Pour toute demande : contact@evidence-homestaging.fr
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
