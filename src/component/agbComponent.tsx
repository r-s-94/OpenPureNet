import "../responsive.css";

export default function AGBComponent() {
  return (
    <div className="agb-component px-5 py-10 flex flex-col gap-y-10">
      <div className="agb-component-paragraph-div mx-50 text-lg">
        <h3 className="agb-component-headline text-xl">§ 1 Geltungsbereich</h3>
        Diese AGB gelten für die Nutzung der Social-Media-Plattform OpenPureNet
        durch registrierte und nicht registrierte Nutzer. Mit der Risgistrierung
        stimmt der Nutzer diesen Bedingungen zu.
      </div>
      <div className="agb-component-paragraph-div mx-50 text-lg">
        <h3 className="agb-component-headline text-xl">
          § 2 Vertragsgegenstand
        </h3>
        OpenPureNet bietet Nutzern die Möglichkeit, Inhalte zu posten, zu
        kommentieren und sich mit anderen auszutauschen. Es besteht kein
        Anspruch auf bestimmte Funktionen.
      </div>
      <div className="agb-component-paragraph-div mx-50 text-lg">
        <h3 className="agb-component-headline text-xl">
          § 3 Registrierung und Benutzerkonto
        </h3>
        <ol>
          <li>1. Die Nutzung der Plattform erfodert eine Registrierung.</li>
          <li>
            {" "}
            2. Der Nutzer verpflichten sich, keine falschen oder
            missbräuchlichen Angaben zu machen.
          </li>
          <li>
            3. Es besteht keine Pflicht zur Angabe persönlicher Daten - alles
            ist freiwillig.
          </li>
        </ol>
      </div>
      <div className="agb-component-paragraph-div mx-50 text-lg">
        <h3 className="agb-component-headline text-xl">
          § 4 Pflichten der Nutzer
        </h3>
        <ol>
          <li>
            1. Nutzer verpflichent sich, keine Inhalte zu veröffentlichen, die
            gegen geltendes Recht, Rechte Dritter oder die Netiquette verstößt.
          </li>
          <li>
            2. Verstöße können zur Sperrung oder Löschenung des Nutzerkontos
            führen.
          </li>
          <li>
            3. Nutzer sind selbst für ihre veröffentlichenten Inhalte
            verantwortlich
          </li>
        </ol>
      </div>
      <div className="agb-component-paragraph-div mx-50 text-lg">
        <h3 className="agb-component-headline text-xl">
          § 5 Inhalte und Nutzungsrechte
        </h3>
        <ol>
          <li>
            1. Nutzer räumen OpenPureNet ein einfaches Nutzungsrecht zur
            Darstellung ihrer Inhalte auf der Plattform ein.
          </li>
          <li>
            2. Inhalte dürfen nicht für kommerzielle Zwecke außerhalb der
            Plattform weiterverwendet werden.
          </li>
        </ol>
      </div>
      <div className="agb-component-paragraph-div mx-50 text-lg">
        <h3 className="agb-component-headline text-xl">§ 6 Datenschutz</h3>
        <ol>
          <li>
            1. Die Verarbeitung personenbezogener Daten erfolgt gemäß der
            Datenschutzerklärung.
          </li>
          <li>
            2. Nutzer müssen der Verarbeitung und ggf. der Übermittlung an
            Drittanbieter zustimmen.
          </li>
          <li>
            3. Weitere Informationen finden sich in der seperaten
            Datenschutzerklärung.
          </li>
        </ol>
      </div>
      <div className="agb-component-paragraph-div mx-50 text-lg">
        <h3 className="agb-component-headline text-xl">§ 7 Haftung</h3>
        <ol>
          <li>
            1. OpenPureNet haftet uneingeschränkt bei Vorsatz, grober
            Fahrlässigkeit und Verletzung von Leben, Körper und Gesundheit.
          </li>
          <li>
            2. Bei einfacher Fahrlässigkeit wird nur bei Verletzung wesentlicher
            Vertragspflichten gehaftet, und auch nur in vorhersehbarem Umfang.
          </li>
          <li>3. Keine Haftung für von Nutzern eingestellte Inhalte.</li>
        </ol>
      </div>
      <div className="agb-component-paragraph-div mx-50 text-lg">
        <h3 className="agb-component-headline text-xl">
          § 8 Laufzeit und Kündigung
        </h3>
        <ol>
          <li>1. Die Mitgliedschaft ist unbefristet</li>
          <li>2. Nutzer können ihe Konto jederzeit selbständig löschen.</li>
          <li>
            3. Der Betreiber kann das Konto bei Verstößen gegen die AGB löschen
            oder sperren.
          </li>
        </ol>
      </div>
      <div className="agb-component-paragraph-div mx-50 text-lg">
        <h3 className="agb-component-headline text-xl">§ 9 Änderung der AGB</h3>
        <ol>
          <li>
            1. Der Betreiber behält sich vor, die AGB bei Bedarf anzupassen.
          </li>
          <li>2. Nutzer werden rechtzeitig über Änderungen informiert.</li>
        </ol>
      </div>
      <div className="agb-component-paragraph-div mx-50 text-lg">
        <h3 className="agb-component-headline text-xl">
          § 10 Schlussbestimmungen
        </h3>
        <ol>
          <li>1. Es gilt das Recht der Bundesrepublik Deutschland</li>
          <li>
            2. Sollte eine Bestimmung unwirksam sein, bleiben die übrigen
            Regelungen unberührt.
          </li>
        </ol>
      </div>
    </div>
  );
}
