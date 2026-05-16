// src/pages/LibraryDetail.js
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import database from "../data/card_database.json";
import getLegacyImage, { getLegacyFoil } from "../utils/getLegacyImage";
import getCardIcon from "../utils/getCardIcon";
import getCharaImage, { parsePer } from "../utils/getCharaImage";
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
  "Per",
  "Foi",
]);

const isFoil = (v) =>
  v === true || (typeof v === "string" && v.toLowerCase() === "true");

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
  const [lightboxIndex, setLightboxIndex] = useState(null);

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

  const lightboxItems = useMemo(() => {
    return versions
      .map((v) => {
        const src = getLegacyImage(v.GUID);
        if (!src) return null;
        const foil = isFoil(v.Foi) ? getLegacyFoil(v.GUID) : null;
        return { src, alt: `${v.Nam} v${v.Ver}`, version: v, foil };
      })
      .filter(Boolean);
  }, [versions]);

  const lightbox =
    lightboxIndex !== null && lightboxItems[lightboxIndex]
      ? lightboxItems[lightboxIndex]
      : null;

  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () => {
    setLightboxIndex((idx) =>
      idx === null || lightboxItems.length === 0
        ? idx
        : (idx - 1 + lightboxItems.length) % lightboxItems.length,
    );
  };
  const showNext = () => {
    setLightboxIndex((idx) =>
      idx === null || lightboxItems.length === 0
        ? idx
        : (idx + 1) % lightboxItems.length,
    );
  };

  const openLightboxForGuid = (guid) => {
    const idx = lightboxItems.findIndex((item) => item.version.GUID === guid);
    if (idx >= 0) setLightboxIndex(idx);
  };

  const lightboxOpen = lightbox !== null;
  const itemCount = lightboxItems.length;

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft" && itemCount > 0) {
        setLightboxIndex((idx) =>
          idx === null ? idx : (idx - 1 + itemCount) % itemCount,
        );
      } else if (e.key === "ArrowRight" && itemCount > 0) {
        setLightboxIndex((idx) =>
          idx === null ? idx : (idx + 1) % itemCount,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, itemCount]);

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
          const foilSrc = isFoil(v.Foi) ? getLegacyFoil(v.GUID) : null;
          const stats = STAT_FIELDS.filter((k) => hasValue(v[k]));
          const meta = META_FIELDS.filter((k) => hasValue(v[k]));
          const extras = Object.keys(v).filter(
            (k) => !HANDLED_FIELDS.has(k) && hasValue(v[k]),
          );
          const hasBadges = hasValue(v.Fac) || hasValue(v.Typ);
          const charaIds = parsePer(v.Per);
          return (
            <article key={v.GUID} className="library-version">
              <div
                className={`library-version-image${image ? " is-zoomable" : ""}`}
                onClick={
                  image
                    ? () => openLightboxForGuid(v.GUID)
                    : undefined
                }
                onKeyDown={
                  image
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openLightboxForGuid(v.GUID);
                        }
                      }
                    : undefined
                }
                role={image ? "button" : undefined}
                tabIndex={image ? 0 : undefined}
                aria-label={image ? `Ampliar ${v.Nam}` : undefined}
              >
                {image ? (
                  <>
                    <img src={image} alt={`${v.Nam} v${v.Ver}`} />
                    {foilSrc && (
                      <span
                        className="library-foil"
                        style={{
                          WebkitMaskImage: `url(${foilSrc})`,
                          maskImage: `url(${foilSrc})`,
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </>
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

                {charaIds.length > 0 && (
                  <section className="library-charas-block">
                    <h3>Personajes</h3>
                    <div className="library-charas">
                      {charaIds.map((id) => {
                        const src = getCharaImage(id);
                        return (
                          <div
                            key={id}
                            className={`library-chara${src ? "" : " is-missing"}`}
                            title={id}
                          >
                            {src ? (
                              <img src={src} alt={id} />
                            ) : (
                              <span className="library-chara-id">{id}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

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

      {lightbox && (
        <div
          className="library-lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
        >
          <div
            className="library-lightbox-frame"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="library-lightbox-image"
            />
            {lightbox.foil && (
              <span
                className="library-foil library-foil-lightbox"
                style={{
                  WebkitMaskImage: `url(${lightbox.foil})`,
                  maskImage: `url(${lightbox.foil})`,
                }}
                aria-hidden="true"
              />
            )}
          </div>
          {lightboxItems.length > 1 && (
            <>
              <button
                type="button"
                className="library-lightbox-nav library-lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Versión anterior"
              >
                ‹
              </button>
              <button
                type="button"
                className="library-lightbox-nav library-lightbox-next"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Versión siguiente"
              >
                ›
              </button>
              <div
                className="library-lightbox-counter"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="library-lightbox-counter-label">
                  v{lightbox.version.Ver / 10}
                  {hasValue(lightbox.version.Pri) &&
                    ` · ${lightbox.version.Pri}`}
                </span>
                <span className="library-lightbox-counter-index">
                  {lightboxIndex + 1} / {lightboxItems.length}
                </span>
              </div>
            </>
          )}
          <button
            type="button"
            className="library-lightbox-close"
            onClick={closeLightbox}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default LibraryDetail;
