export default function DataprotectionComponent() {
  return (
    <div className="px-5 py-10 flex flex-col gap-y-10">
      <div className="mx-50 text-lg">
        <h3 className="text-xl">1. Allgemeine Hinweise</h3>
        Diese Datenschutzerklärung informiert Nutzer über die Art, den Umfang
        und den Zweck der Verarbeitung personenbezogener Daten innerhalb der
        Social Media Plattform OpenPureNet. Der Schutz deiner Daten ist uns ein
        besonderes Anliegen.
      </div>
      <div className="mx-50 text-lg flex flex-col">
        <h3 className="text-xl">2. Verantwortliche Stelle</h3>
        Sven Richter <span>E-Mail: open-pure-net@web.de</span>
      </div>
      <div className="mx-50 text-lg">
        <h3 className="text-xl">3. Welche Daten werden verarbeitet?</h3>
        <table className="mt-5">
          <tr className="border border-gray-200">
            <th className="px-7 py-1.5 border border-gray-200">Datenart</th>
            <th className="px-7 py-1.5 border border-gray-200">Beispiele</th>
            <th className="px-7 py-1.5 border border-gray-200">
              Zweck und Verarbeitung
            </th>
          </tr>
          <tr className="border border-gray-200">
            <td className="px-7 py-1.5 border border-gray-200">Grunddaten</td>
            <td className="px-7 py-1.5 border border-gray-200">
              E-Mail-Adresse, Benutzername
            </td>
            <td className="px-7 py-1.5 border border-gray-200">
              Registrierung, Login
            </td>
          </tr>
          <tr className="border border-gray-200">
            <td className="px-7 py-1.5 border border-gray-200">Inhalte</td>
            <td className="px-7 py-1.5 border border-gray-200">
              Post, Kommentare
            </td>
            <td className="px-7 py-1.5 border border-gray-200">
              Nutzerkommunikation
            </td>
          </tr>
          <tr className="border border-gray-200">
            <td className="px-7 py-1.5 border border-gray-200">Nutzerdaten</td>
            <td className="px-7 py-1.5 border border-gray-200">
              IP-Adresse, Login-Zeit, Browser
            </td>
            <td className="px-7 py-1.5 border border-gray-200">
              Fehlerbehandlung, Sicherheit
            </td>
          </tr>
          <tr className="border border-gray-200">
            <td className="px-7 py-1.5 border border-gray-200">
              Freiwilligen Angaben
            </td>
            <td className="px-7 py-1.5 border border-gray-200">
              Stadt, Straße, weitere Profilinfos
            </td>
            <td className="px-7 py-1.5 border border-gray-200">
              Selbstdarstellung, Kommunikation
            </td>
          </tr>
        </table>
      </div>
      <div className="mx-50 text-lg">
        <h3 className="text-xl">4. Rechtsgrundlage</h3>
        <ul>
          <li>
            Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) - bei freiwilligen Angaben
          </li>
          <li>
            Vertragliche Grundlage (Art. 6 Abs. 1 lit b DSGVO) - für Nutzung der
            Plattform
          </li>
          <li>
            Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) - zur
            Gewährleistung der Sicherheit
          </li>
        </ul>
      </div>
      <div className="mx-50 text-lg">
        <h3 className="text-xl">5. Einsatz von SupaBase</h3>
        OpenPureNet nutzt den Dienst SupaBase zur Authentifizierung,
        Datenbankverarbeitung und Speicherung.
        <ul>
          <li>
            SupaBase verarbeitet Daten ggf. auf Servern innerhalb oder außerhalb
            der EU.
          </li>
          <li>
            Eine 100%ige Kontrolle über die Datenverarbeitung durch SupaBase
            besteht nicht.
          </li>
        </ul>
      </div>
      <div className="mx-50 text-lg">
        <h3 className="text-xl">6. Keine kommerzielle Nutzung</h3>
        OpenPureNet wird derzeit nicht gewerblich betrieben. Es werden keine
        Daten verkauft, vermietet oder für Werbung genutzt. Es gibt keine
        Werbung oder Abos.
      </div>
      <div className="mx-50 text-lg">
        <h3 className="text-xl">7. Deine Rechte</h3>
        Du hast jderzeit das Recht auf:
        <ul>
          <li>Auskunft (Art. 15 DSGVO)</li>
          <li>Berichtigung (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Einschränkung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch (Art. 21 DSGVO)</li>
          <li>Widerruf (Art. 7 Abs. 3 DSGVO)</li>
        </ul>
        Kontakt: open-pure-net@web.de
      </div>
      <div className="mx-50 text-lg">
        <h3 className="text-xl">8. Speicherdauer</h3>
        Personenbezogene Daten werden nur so lange gespeichert, wie es für die
        Nutzung erforderlich ist. Bei Löschung des Kontos werden deine Daten
        gelöscht, soweit technisch möglich.
      </div>
      <div className="mx-50 text-lg">
        <h3 className="text-xl">9. Sicherheit</h3>
        Alle Daten werden über eine verschlüsselte Verbindung übertragen.
        Sicherheitsmaßnahmen werden regelmäßig überprüft und angepasst.
      </div>
      <div className="mx-50 text-lg">
        <h3 className="text-xl">10. Änderungen</h3>
        Diese Datenschutzerklärung kann bei Bedarf angepasst werden. Die jeweils
        aktuelle Version findest du jederzeit auf der Plattform.
      </div>
    </div>
  );
}
