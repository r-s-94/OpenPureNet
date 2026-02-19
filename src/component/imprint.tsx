import { Link } from "react-router-dom";
//import "../responsive.css";

export default function Imprint() {
  return (
    <div className="imprint-section">
      {" "}
      <Link to="/" className="imprint-section-back-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="imprint-section-back-icon w-10 mt-10 ml-30 cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </Link>
      <div className="imprint-section-main-div flex flex-col items-center justify-center">
        <h2 className="imprint-section-headline text-3xl">Impressum</h2>

        <div className="imprint-section-tmg-div mt-3">
          <p className="imprint-section-tmg-headline text-lg">
            Angaben gemäß § 5 TMG
          </p>
          <p className="imprint-section-tmg-name text-lg">Sven Richter</p>
          <p className="imprint-section-tmg-adress text-lg">
            Wartislawstraße 10 <br />
            18437 Stralsund
          </p>
          <br />
          <p className="imprint-section-tmg-contact mt-5 text-xl text-center">
            Kontakt
          </p>
          <p className="imprint-section-tmg-mail text-lg">
            open-pure-net@web.de
          </p>
        </div>
      </div>
    </div>
  );
}
