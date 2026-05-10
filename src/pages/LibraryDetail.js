// src/pages/LibraryDetail.js
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import database from "../data/card_database.json";
import getLegacyImage from "../utils/getLegacyImage";
import getCardIcon from "../utils/getCardIcon";
import "./LibraryDetail.css";

const FIELD_LABELS = {
  GUID: "GUID",
  Edi: "Edición",
  Num: "Número",
  Fac: "Facción",
  Typ: "Tipo",
  Ver: "Versión",
  Pri: "Impresión",
  Nam: "Nombre",
  Sub: "Subtipo",
  Cos: "Coste",
  Fue: "Fuerza",
  Rea: "Reanim",
  Adi: "Adita",
  Est: "Estructura",
  Vol: "Voluntad",
  Abi: "Habilidad",
  Res: "Restricción",
  Epi: "Epígrafe",
  Ill: "Ilustrador",
  Fre: "Frecuencia",
  Col: "Info Colección",
  Not: "Notas",
  Sta: "Estado",
};

const FACTION_LABELS = {
  qui: "Quimera",
  abi: "Abismales",
  cor: "Corporación",
  acr: "Acracia",
  sin: "Sin Facción",
  quiacr: "Quimera/Acracia",
};

const TYPE_LABELS = {
  san: "Santuario",
  tec: "Tecnología",
  per: "Personaje",
  man: "Manipulación",
  col: "Coloso",
  adi: "Aditamento",
};

const FREQUENCY_LABELS = {
  C: "Común",
  I: "Infrecuente",
  R: "Rara",
  P: "Promo",
};

const STAT_FIELDS = ["Cos", "Vol", "Fue", "Est", "Rea", "Adi", "Res"];
const META_FIELDS = ["Ill", "Fre", "Col"];
const HANDLED_FIELDS = new Set([
  ...STAT_FIELDS,
  ...META_FIELDS,
  "Nam",
  "Sub",
  "Edi",
  "Num",
  "Fac",
  "Typ",
  "Ver",
  "Pri",
  "Abi",
  "Epi",
  "Not",
  "GUID",
]);

const hasValue = (v) => v !== null && v !== undefined && v !== "";

const formatValue = (value) => {
  if (!hasValue(value)) return "—";
  return String(value);
};

const formatMetaValue = (key, value) => {
  if (key === "Fre") return FREQUENCY_LABELS[value] || formatValue(value);
  return formatValue(value);
};

const RICH_TOKEN_RE = /(<\/?[bi]>)/gi;

const renderRichText = (value) => {
  if (!hasValue(value)) return "—";
  const parts = String(value)
    .split(RICH_TOKEN_RE)
    .filter((p) => p !== "");
  const nodes = [];
  let bold = false;
  let italic = false;
  parts.forEach((part, idx) => {
    if (part === "<b>") {
      bold = true;
      return;
    }
    if (part === "</b>") {
      bold = false;
      return;
    }
    if (part === "<i>") {
      italic = true;
      return;
    }
    if (part === "</i>") {
      italic = false;
      return;
    }
    let node = part;
    if (italic) node = <em>{node}</em>;
    if (bold) node = <strong>{node}</strong>;
    nodes.push(<React.Fragment key={idx}>{node}</React.Fragment>);
  });
  return nodes;
};

const ABI_TOKEN_RE = /(<\/?[bi]>| YYY |:[a-z0-9]+:)/gi;

const renderAbility = (value) => {
  if (!hasValue(value)) return null;
  const parts = String(value)
    .split(ABI_TOKEN_RE)
    .filter((p) => p !== "");
  const nodes = [];
  let bold = false;
  let italic = false;
  parts.forEach((part, idx) => {
    if (part === "<b>") {
      bold = true;
      return;
    }
    if (part === "</b>") {
      bold = false;
      return;
    }
    if (part === "<i>") {
      italic = true;
      return;
    }
    if (part === "</i>") {
      italic = false;
      return;
    }
    if (part === " YYY ") {
      nodes.push(<br key={`br-${idx}`} />);
      return;
    }
    if (/^:[a-z0-9]+:$/i.test(part)) {
      const name = part.slice(1, -1);
      const src = getCardIcon(name);
      if (src) {
        nodes.push(
          <img
            key={`ic-${idx}`}
            src={src}
            alt={name}
            className="library-ability-icon"
          />,
        );
        return;
      }
    }
    let node = part;
    if (italic) node = <em>{node}</em>;
    if (bold) node = <strong>{node}</strong>;
    nodes.push(<React.Fragment key={idx}>{node}</React.Fragment>);
  });
  return nodes;
};

const LibraryDetail = () => {
  const { edi, num } = useParams();

  const versions = useMemo(() => {
    return database
      .filter((c) => String(c.Edi) === edi && String(c.Num) === num)
      .sort((a, b) => {
        const va = Number(a.Ver) || 0;
        const vb = Number(b.Ver) || 0;
        if (va !== vb) return vb - va;
        return String(a.Pri || "").localeCompare(String(b.Pri || ""));
      });
  }, [edi, num]);

  if (versions.length === 0) {
    return (
      <div className="library-detail empty">
        <p>Carta no encontrada.</p>
        <Link to="/" className="library-back">
          {"← Volver a la biblioteca"}
        </Link>
      </div>
    );
  }

  const headline = versions[0];

  return (
    <div className="library-detail">
      <Link to="/" className="library-back">
        {"← Volver a la biblioteca"}
      </Link>
      <header className="library-detail-header">
        <h1>{headline.Nam}</h1>
        {hasValue(headline.Sub) && (
          <p className="library-detail-subtitle">{headline.Sub}</p>
        )}
        <p className="library-detail-id">
          {String(headline.Edi).toUpperCase()} {headline.Num}
          <span className="library-detail-count">
            {versions.length} {versions.length === 1 ? "versión" : "versiones"}
          </span>
        </p>
      </header>

      <div className="library-versions">
        {versions.map((v) => {
          const image = getLegacyImage(v.GUID);
          const stats = STAT_FIELDS.filter((k) => hasValue(v[k]));
          const meta = META_FIELDS.filter((k) => hasValue(v[k]));
          const extras = Object.keys(v).filter(
            (k) => !HANDLED_FIELDS.has(k) && hasValue(v[k]),
          );
          const hasBadges = hasValue(v.Fac) || hasValue(v.Typ);
          return (
            <article key={v.GUID} className="library-version">
              <div className="library-version-image">
                {image ? (
                  <img src={image} alt={`${v.Nam} v${v.Ver}`} />
                ) : (
                  <div className="library-version-placeholder">
                    <span>Sin imagen</span>
                    <span className="placeholder-id">{v.GUID}</span>
                  </div>
                )}
              </div>
              <div className="library-version-info">
                <h2 className="library-version-heading">
                  v{v.Ver / 10}
                  {hasValue(v.Pri) && (
                    <span className="library-version-pri">· {v.Pri}</span>
                  )}
                  {hasValue(v.GUID) && (
                    <span className="library-version-guid">{v.GUID}</span>
                  )}
                </h2>

                {hasBadges && (
                  <div className="library-badges">
                    {hasValue(v.Fac) && (
                      <span className="library-badge library-badge-faction">
                        {FACTION_LABELS[v.Fac] || v.Fac}
                      </span>
                    )}
                    {hasValue(v.Typ) && (
                      <span className="library-badge library-badge-type">
                        {TYPE_LABELS[v.Typ] || v.Typ}
                      </span>
                    )}
                  </div>
                )}

                {stats.length > 0 && (
                  <div className="library-stats">
                    {stats.map((k) => (
                      <div key={k} className="library-stat">
                        <span className="library-stat-label">
                          {FIELD_LABELS[k] || k}
                        </span>
                        <span className="library-stat-value">{v[k]}</span>
                      </div>
                    ))}
                  </div>
                )}

                {hasValue(v.Abi) && (
                  <section className="library-ability-block">
                    <h3>Habilidad</h3>
                    <div className="library-ability-text">
                      {renderAbility(v.Abi)}
                    </div>
                  </section>
                )}

                {hasValue(v.Epi) && <p className="library-epigraph">{v.Epi}</p>}

                {(meta.length > 0 || extras.length > 0) && (
                  <dl className="library-meta">
                    {meta.map((k) => (
                      <div key={k} className="library-meta-row">
                        <dt>{FIELD_LABELS[k] || k}</dt>
                        <dd>
                          {k === "Col"
                            ? renderRichText(v[k])
                            : formatMetaValue(k, v[k])}
                        </dd>
                      </div>
                    ))}
                    {extras.map((k) => (
                      <div key={k} className="library-meta-row">
                        <dt>{k}</dt>
                        <dd>{formatValue(v[k])}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {hasValue(v.Not) && (
                  <section className="library-notes">
                    <h3>Notas</h3>
                    <p>{formatValue(v.Not)}</p>
                  </section>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default LibraryDetail;
