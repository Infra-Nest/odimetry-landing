import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';

type Kind = 'privacy' | 'terms' | 'cookies';
type Language = 'es' | 'en' | 'fr' | 'de';
type Document = { title: string; updated: string; intro: string; sections: [string, string][] };

const documents: Record<Language, Record<Kind, Document>> = {
  es: {
    privacy: {
      title: 'Privacidad de Odimetry', updated: '14 de octubre de 2026',
      intro: 'Esta web presenta un producto en desarrollo. No permite crear cuentas, contratar planes ni ejecutar evaluaciones.',
      sections: [
        ['Responsable y finalidad', 'Infranest gestiona esta landing y las solicitudes de novedades. Si envías el formulario, una función de Vercel transmite tu dirección a nuestro proveedor de correo para notificarnos la solicitud en info@infranest.es. La web no crea cuentas ni guarda una lista en una base de datos. El formulario no comprueba que la dirección te pertenezca; se tratará como una solicitud pendiente de verificar. Antes de enviarte novedades confirmaremos la titularidad de la dirección. La base para ese envío será tu consentimiento confirmado, que podrás retirar en cualquier momento.'],
        ['Proveedores y conservación', 'Vercel y el proveedor de correo pueden tratar tu dirección y los datos técnicos necesarios para entregar la solicitud. Las fuentes se cargan desde Google Fonts. Conservamos el mensaje recibido mientras sea necesario para gestionar tu solicitud y tu dirección hasta que solicites la baja o termine esa finalidad, sin perjuicio de las obligaciones legales aplicables.'],
        ['Tus derechos', 'Puedes pedir acceso, rectificación, supresión, limitación u oposición al tratamiento y retirar tu consentimiento escribiendo a info@infranest.es. También puedes reclamar ante la Agencia Española de Protección de Datos. Para dejar de recibir novedades, escribe a esa dirección con el asunto «Baja».'],
      ],
    },
    terms: {
      title: 'Condiciones de esta web', updated: '14 de octubre de 2026',
      intro: 'Odimetry se muestra aquí como concepto de producto en desarrollo. La información y las pantallas de ejemplo explican la propuesta.',
      sections: [
        ['Disponibilidad', 'Esta web no ofrece todavía cuentas, evaluaciones automáticas, compras ni suscripciones. Las pantallas y resultados de ejemplo son ilustrativos y no representan una evaluación real.'],
        ['Contacto', 'Enviar el formulario de interés no crea una cuenta, inicia una prueba, garantiza acceso ni constituye una contratación. Puedes consultar la disponibilidad y las condiciones futuras en info@infranest.es.'],
        ['Uso responsable', 'Cuando el servicio esté disponible, las evaluaciones deberán limitarse a dominios y activos propios o expresamente autorizados. Esta web no autoriza a evaluar sistemas de terceros.'],
      ],
    },
    cookies: {
      title: 'Cookies y almacenamiento local', updated: '14 de octubre de 2026',
      intro: 'Esta versión informativa no incorpora cuentas, analítica ni publicidad.',
      sections: [
        ['Preferencia de idioma', 'La web guarda el idioma elegido en el almacenamiento local del navegador para recordarlo en la siguiente visita. Puedes eliminar esa preferencia desde los ajustes del navegador.'],
        ['Servicios externos', 'El alojamiento puede generar registros técnicos necesarios para servir la web. Las fuentes se solicitan a Google Fonts. No hemos integrado cookies de seguimiento o publicidad en esta versión.'],
      ],
    },
  },
  en: {
    privacy: {
      title: 'Odimetry privacy', updated: '14 October 2026',
      intro: 'This website presents a product in development. It does not offer accounts, paid plans or live assessments.',
      sections: [
        ['Who handles your request', 'Infranest operates this landing page and handles requests for updates. If you submit the form, a Vercel function sends your address through our email provider to notify us at info@infranest.es. The website does not create accounts or store a list in a database. The form does not verify that the address belongs to you, so the request remains unverified. We will confirm ownership before sending updates. Confirmed consent will be the basis for those updates, and you can withdraw it at any time.'],
        ['Providers and retention', 'Vercel and the email provider may process your address and technical data needed to deliver the request. Fonts are loaded from Google Fonts. We keep the received message as long as needed to handle your request, and your address until you unsubscribe or that purpose ends, subject to applicable legal obligations.'],
        ['Your rights', 'You can request access, correction, erasure, restriction or objection to processing, and withdraw consent, by writing to info@infranest.es. You may also complain to the Spanish Data Protection Agency. To stop receiving updates, email that address with the subject “Unsubscribe”.'],
      ],
    },
    terms: {
      title: 'Website terms', updated: '14 October 2026',
      intro: 'Odimetry is shown here as a product concept in development. The information and example screens explain the proposal.',
      sections: [
        ['Availability', 'This website does not yet offer accounts, automated assessments, purchases or subscriptions. Screens and results are illustrative and do not represent a real assessment.'],
        ['Contact', 'Submitting the interest form does not create an account, start a trial, guarantee access or form a contract. Ask about availability and future terms at info@infranest.es.'],
        ['Responsible use', 'When the service becomes available, assessments must be limited to domains and assets you own or are expressly authorised to assess. This website does not authorise assessments of third-party systems.'],
      ],
    },
    cookies: {
      title: 'Cookies and local storage', updated: '14 October 2026',
      intro: 'This informational version has no accounts, analytics or advertising.',
      sections: [
        ['Language preference', 'The website saves your chosen language in your browser’s local storage so it can remember it on your next visit. You can remove this preference in your browser settings.'],
        ['External services', 'Hosting may produce technical logs needed to serve the website. Fonts are requested from Google Fonts. We have not integrated tracking or advertising cookies in this version.'],
      ],
    },
  },
  fr: {
    privacy: {
      title: 'Confidentialité d’Odimetry', updated: '14 octobre 2026',
      intro: 'Ce site présente un produit en développement. Il ne permet pas de créer un compte, de souscrire une offre ni de lancer une évaluation.',
      sections: [
        ['Responsable et finalité', 'Infranest gère cette page et les demandes d’actualités. Si vous envoyez le formulaire, une fonction Vercel transmet votre adresse par notre prestataire de messagerie afin de nous notifier à info@infranest.es. Le site ne crée pas de compte et ne conserve pas de liste dans une base de données. Le formulaire ne vérifie pas que l’adresse vous appartient : la demande reste donc à vérifier. Nous confirmerons sa titularité avant d’envoyer des actualités. Le consentement confirmé fondera cet envoi et pourra être retiré à tout moment.'],
        ['Prestataires et conservation', 'Vercel et le prestataire de messagerie peuvent traiter votre adresse et les données techniques nécessaires à la remise de la demande. Les polices sont chargées depuis Google Fonts. Nous conservons le message reçu le temps nécessaire au traitement de votre demande et votre adresse jusqu’à votre désinscription ou la fin de cette finalité, sous réserve des obligations légales applicables.'],
        ['Vos droits', 'Vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou l’opposition au traitement, et retirer votre consentement, en écrivant à info@infranest.es. Vous pouvez également saisir l’Agence espagnole de protection des données. Pour vous désinscrire, envoyez un courriel à cette adresse avec l’objet « Désinscription ».'],
      ],
    },
    terms: {
      title: 'Conditions de ce site', updated: '14 octobre 2026',
      intro: 'Odimetry est présenté ici comme un concept de produit en développement. Les informations et écrans d’exemple illustrent le projet.',
      sections: [
        ['Disponibilité', 'Ce site ne propose pas encore de comptes, d’évaluations automatisées, d’achats ni d’abonnements. Les écrans et résultats sont illustratifs et ne représentent pas une évaluation réelle.'],
        ['Contact', 'Envoyer le formulaire d’intérêt ne crée pas de compte, ne lance pas d’essai, ne garantit pas l’accès et ne constitue pas un contrat. Contactez info@infranest.es pour connaître la disponibilité et les futures conditions.'],
        ['Utilisation responsable', 'Lorsque le service sera disponible, les évaluations devront se limiter aux domaines et actifs qui vous appartiennent ou pour lesquels vous disposez d’une autorisation expresse. Ce site n’autorise pas l’évaluation de systèmes tiers.'],
      ],
    },
    cookies: {
      title: 'Cookies et stockage local', updated: '14 octobre 2026',
      intro: 'Cette version informative ne comporte ni compte, ni analyse d’audience, ni publicité.',
      sections: [
        ['Langue préférée', 'Le site enregistre la langue choisie dans le stockage local de votre navigateur afin de la retrouver lors de votre prochaine visite. Vous pouvez supprimer cette préférence dans les paramètres du navigateur.'],
        ['Services externes', 'L’hébergement peut générer des journaux techniques nécessaires à l’affichage du site. Les polices sont demandées à Google Fonts. Nous n’avons pas intégré de cookies de suivi ou de publicité dans cette version.'],
      ],
    },
  },
  de: {
    privacy: {
      title: 'Datenschutz bei Odimetry', updated: '14. Oktober 2026',
      intro: 'Diese Website stellt ein Produkt in Entwicklung vor. Konten, kostenpflichtige Tarife und echte Prüfungen sind hier noch nicht verfügbar.',
      sections: [
        ['Verantwortlicher und Zweck', 'Infranest betreibt diese Landingpage und bearbeitet Anfragen zu Neuigkeiten. Wenn Sie das Formular absenden, übermittelt eine Vercel-Funktion Ihre Adresse über unseren E-Mail-Dienstleister als Benachrichtigung an info@infranest.es. Die Website erstellt keine Konten und speichert keine Liste in einer Datenbank. Das Formular prüft nicht, ob die Adresse Ihnen gehört; die Anfrage bleibt daher unbestätigt. Vor dem Versand von Neuigkeiten bestätigen wir die Inhaberschaft der Adresse. Grundlage dafür ist Ihre bestätigte Einwilligung, die Sie jederzeit widerrufen können.'],
        ['Dienstleister und Aufbewahrung', 'Vercel und der E-Mail-Dienstleister können Ihre Adresse und die für die Zustellung der Anfrage nötigen technischen Daten verarbeiten. Schriftarten werden von Google Fonts geladen. Wir bewahren die empfangene Nachricht so lange auf, wie es zur Bearbeitung Ihrer Anfrage nötig ist, und Ihre Adresse bis zur Abmeldung oder bis zum Ende dieses Zwecks, vorbehaltlich geltender gesetzlicher Pflichten.'],
        ['Ihre Rechte', 'Sie können Auskunft, Berichtigung, Löschung, Einschränkung oder Widerspruch gegen die Verarbeitung verlangen und Ihre Einwilligung widerrufen, indem Sie an info@infranest.es schreiben. Sie können sich auch bei der spanischen Datenschutzbehörde beschweren. Zum Abmelden senden Sie eine E-Mail mit dem Betreff „Abmelden“ an diese Adresse.'],
      ],
    },
    terms: {
      title: 'Nutzungsbedingungen dieser Website', updated: '14. Oktober 2026',
      intro: 'Odimetry wird hier als Produktkonzept in Entwicklung gezeigt. Informationen und Beispielansichten erklären die geplante Lösung.',
      sections: [
        ['Verfügbarkeit', 'Diese Website bietet noch keine Konten, automatisierten Prüfungen, Käufe oder Abonnements. Ansichten und Ergebnisse sind Beispiele und stellen keine echte Prüfung dar.'],
        ['Kontakt', 'Das Absenden des Interessenformulars erstellt kein Konto, startet keinen Test, garantiert keinen Zugang und schließt keinen Vertrag. Fragen zur Verfügbarkeit und zu künftigen Bedingungen können Sie an info@infranest.es richten.'],
        ['Verantwortungsvolle Nutzung', 'Sobald der Dienst verfügbar ist, dürfen Prüfungen nur für eigene oder ausdrücklich autorisierte Domains und Assets erfolgen. Diese Website erlaubt keine Prüfung fremder Systeme.'],
      ],
    },
    cookies: {
      title: 'Cookies und lokaler Speicher', updated: '14. Oktober 2026',
      intro: 'Diese Informationsversion enthält keine Konten, Analyse- oder Werbedienste.',
      sections: [
        ['Spracheinstellung', 'Die Website speichert Ihre gewählte Sprache im lokalen Speicher des Browsers, damit sie beim nächsten Besuch erhalten bleibt. Sie können diese Einstellung in den Browsereinstellungen löschen.'],
        ['Externe Dienste', 'Das Hosting kann technische Protokolle erzeugen, die für die Bereitstellung der Website nötig sind. Schriftarten werden von Google Fonts angefordert. Tracking- oder Werbe-Cookies wurden in dieser Version nicht integriert.'],
      ],
    },
  },
};

export function LaunchLegalPage({ kind }: { kind: Kind }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.slice(0, 2) as Language | undefined;
  const locale = language && language in documents ? language : 'es';
  const content = documents[locale][kind];

  return (
    <section className="bg-gray-950 py-16 text-gray-300 md:py-24">
      <Container>
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-4xl font-bold text-gray-100 md:text-5xl">{content.title}</h1>
          <p className="mb-8 text-sm text-gray-400">{content.updated}</p>
          <p className="mb-10 text-lg leading-relaxed">{content.intro}</p>
          <div className="space-y-8">
            {content.sections.map(([title, body]) => (
              <section key={title}>
                <h2 className="mb-3 text-2xl font-semibold text-gray-100">{title}</h2>
                <p className="leading-relaxed">{body}</p>
              </section>
            ))}
          </div>
          <p className="mt-10">
            <a className="text-teal-300 underline underline-offset-4 hover:text-teal-200" href="mailto:info@infranest.es">info@infranest.es</a>
            {kind === 'cookies' && <><span aria-hidden="true"> · </span><Link className="text-teal-300 underline underline-offset-4 hover:text-teal-200" to="/privacy">{documents[locale].privacy.title}</Link></>}
          </p>
        </div>
      </Container>
    </section>
  );
}
