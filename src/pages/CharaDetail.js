// src/pages/CharaDetail.js
import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import charaDatabase from "../data/chara_database.json";
import cardDatabase from "../data/card_database.json";
import getLegacyImage from "../utils/getLegacyImage";
import getCharaImage, {
  parsePer,
  normalizeCharaId,
} from "../utils/getCharaImage";
import "./CharaDetail.css";

const PROFILE_FIELDS = [
  { key: "full name", label: "Nombre completo" },
  { key: "alias", label: "Alias" },
  { key: "faction", label: "Facción" },
  { key: "group", label: "Grupo" },
  { key: "family", label: "Familia" },
  { key: "allies", label: "Aliados" },
  { key: "sphere", label: "Esferas" },
  { key: "state", label: "Estado" },
  { key: "gender", label: "Género" },
  { key: "dob", label: "Nacimiento" },
  { key: "birthplace", label: "Lugar de nacimiento" },
];

const hasValue = (v) => v !== null && v !== undefined && v !== "";

const renderDescription = (text) => {
  if (!hasValue(text)) return null;
  return String(text)
    .split(/\n+/)
    .filter((p) => p.trim() !== "")
    .map((para, idx) => <p key={idx}>{para}</p>);
};

const pickLatestPerCard = (rows) => {
  const map = new Map();
  rows.forEach((entry) => {
    const key = `${entry.Edi}-${entry.Num}`;
    const existing = map.get(key);
    const verA = Number(entry.Ver) || 0;
    const priA = String(entry.Pri || "");
    if (!existing) {
      map.set(key, entry);
      return;
    }
    const verB = Number(existing.Ver) || 0;
    const priB = String(existing.Pri || "");
    if (verA > verB || (verA === verB && priA < priB)) {
      map.set(key, entry);
    }
  });
  return Array.from(map.values()).sort((a, b) => {
    if (a.Edi !== b.Edi) return String(a.Edi).localeCompare(String(b.Edi));
    return String(a.Num).localeCompare(String(b.Num));
  });
};

const CharaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const normalizedId = useMemo(() => normalizeCharaId(id), [id]);

  const chara = useMemo(() => {
    if (!normalizedId) return null;
    return (
      charaDatabase.find(
        (c) => normalizeCharaId(c.id) === normalizedId,
      ) || null
    );
  }, [normalizedId]);

  const cards = useMemo(() => {
    if (!normalizedId) return [];
    const matches = cardDatabase.filter((c) => {
      const ids = parsePer(c.Per).map(normalizeCharaId);
      return ids.includes(normalizedId);
    });
    return pickLatestPerCard(matches);
  }, [normalizedId]);

  const portrait = getCharaImage(normalizedId);
  const displayName =
    (chara && (chara.name || chara["full name"])) ||
    (normalizedId ? `Personaje ${normalizedId}` : "Personaje");

  if (!chara) {
    return (
      <div className="chara-detail empty">
        <p>Personaje no encontrado{normalizedId ? ` (${normalizedId})` : ""}.</p>
        <Link to="/" className="chara-back">
          {"← Volver a la biblioteca"}
        </Link>
      </div>
    );
  }

  const profileRows = PROFILE_FIELDS.filter(({ key }) => hasValue(chara[key]));

  return (
    <div className="chara-detail">
      <Link to="/" className="chara-back">
        {"← Volver a la biblioteca"}
      </Link>

      <header className="chara-header">
        <div className="chara-portrait">
          {portrait ? (
            <img src={portrait} alt={displayName} />
          ) : (
            <div className="chara-portrait-placeholder">
              <span>Sin retrato</span>
              <span className="chara-portrait-id">{normalizedId}</span>
            </div>
          )}
        </div>
        <div className="chara-title">
          <h1>{displayName}</h1>
          {hasValue(chara["full name"]) &&
            chara["full name"] !== chara.name && (
              <p className="chara-fullname">{chara["full name"]}</p>
            )}
          <p className="chara-id">ID {normalizedId}</p>
        </div>
      </header>

      {profileRows.length > 0 && (
        <dl className="chara-profile">
          {profileRows.map(({ key, label }) => (
            <div key={key} className="chara-profile-row">
              <dt>{label}</dt>
              <dd>{chara[key]}</dd>
            </div>
          ))}
        </dl>
      )}

      {hasValue(chara.description) && (
        <section className="chara-description">
          <h2>Historia</h2>
          {renderDescription(chara.description)}
        </section>
      )}

      <section className="chara-cards">
        <h2>
          Cartas
          <span className="chara-cards-count">
            {cards.length} {cards.length === 1 ? "carta" : "cartas"}
          </span>
        </h2>
        {cards.length === 0 ? (
          <p className="chara-cards-empty">
            No hay cartas que mencionen a este personaje.
          </p>
        ) : (
          <div className="chara-cards-grid">
            {cards.map((card) => {
              const image = getLegacyImage(card.GUID);
              const go = () => navigate(`/library/${card.Edi}/${card.Num}`);
              return (
                <button
                  key={card.GUID}
                  type="button"
                  className="chara-card"
                  onClick={go}
                  aria-label={card.Nam}
                >
                  <div className="chara-card-inner">
                    {image ? (
                      <img src={image} alt={card.Nam} draggable="false" />
                    ) : (
                      <div className="chara-card-placeholder">
                        <span className="chara-card-name-placeholder">
                          {card.Nam}
                        </span>
                        <span className="chara-card-id-placeholder">
                          {`${card.Edi} ${card.Num}`}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="chara-card-name">{card.Nam}</div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default CharaDetail;
