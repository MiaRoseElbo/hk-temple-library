// src/pages/Library.js
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import database from "../data/card_database.json";
import getLegacyImage from "../utils/getLegacyImage";
import "./Library.css";

const pickLatest = (rows) => {
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

const CARDS_PER_PAGE = 25;

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

const EDITION_LABELS = {
  evo: "Evolución",
  dev: "Desviantes",
  sub: "Suburbia",
  rad: "Radix",
  col: "Colosos",
  avl: "Alto Voltaje",
  cal: "Calixto",
  crc: "CRC",
  hk20: "HK 2020",
  hk21: "HK 2021",
  test: "Test",
};

const FREQUENCY_LABELS = {
  C: "Común",
  I: "Infrecuente",
  R: "Rara",
  P: "Promo",
};

const FILTER_DEFS = [
  { key: "Fac", label: "Facción", labels: FACTION_LABELS },
  { key: "Typ", label: "Tipo", labels: TYPE_LABELS },
  { key: "Edi", label: "Edición", labels: EDITION_LABELS },
  { key: "Fre", label: "Frecuencia", labels: FREQUENCY_LABELS },
];

const EMPTY_FILTERS = { Fac: [], Typ: [], Edi: [], Fre: [] };

const STAT_FILTER_DEFS = [
  { key: "Cos", label: "Coste" },
  { key: "Vol", label: "Voluntad" },
  { key: "Fue", label: "Fuerza" },
  { key: "Est", label: "Estructura" },
  { key: "Rea", label: "Reanim" },
  { key: "Adi", label: "Adita" },
  { key: "Res", label: "Restricción" },
];

const EMPTY_STAT_FILTERS = STAT_FILTER_DEFS.reduce((acc, { key }) => {
  acc[key] = { min: "", max: "" };
  return acc;
}, {});

const parseBound = (raw) => {
  if (raw === "" || raw === null || raw === undefined) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

const normalizeForSearch = (value) =>
  (value == null ? "" : String(value))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const collectOptions = (rows, key, labels) => {
  const set = new Set();
  rows.forEach((row) => {
    const value = row[key];
    if (value != null && value !== "") set.add(String(value));
  });
  return Array.from(set)
    .map((value) => ({ value, label: labels[value] || value.toUpperCase() }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const Library = () => {
  const navigate = useNavigate();
  const [draftQuery, setDraftQuery] = useState("");
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [draftStatFilters, setDraftStatFilters] = useState(EMPTY_STAT_FILTERS);
  const [appliedQuery, setAppliedQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [appliedStatFilters, setAppliedStatFilters] =
    useState(EMPTY_STAT_FILTERS);
  const [openFilter, setOpenFilter] = useState(null);
  const [page, setPage] = useState(1);

  const latest = useMemo(() => pickLatest(database), []);

  const filterOptions = useMemo(
    () =>
      FILTER_DEFS.reduce((acc, def) => {
        acc[def.key] = collectOptions(latest, def.key, def.labels);
        return acc;
      }, {}),
    [latest],
  );

  const filtered = useMemo(() => {
    const q = normalizeForSearch(appliedQuery.trim());
    const statBounds = STAT_FILTER_DEFS.map(({ key }) => ({
      key,
      min: parseBound(appliedStatFilters[key].min),
      max: parseBound(appliedStatFilters[key].max),
    })).filter((b) => b.min !== null || b.max !== null);
    return latest.filter((c) => {
      for (const { key } of FILTER_DEFS) {
        const selected = appliedFilters[key];
        if (selected.length > 0 && !selected.includes(String(c[key] ?? ""))) {
          return false;
        }
      }
      for (const { key, min, max } of statBounds) {
        const raw = c[key];
        if (raw === "" || raw === null || raw === undefined) return false;
        const num = Number(raw);
        if (!Number.isFinite(num)) return false;
        if (min !== null && num < min) return false;
        if (max !== null && num > max) return false;
      }
      if (!q) return true;
      return [c.Nam, c.Sub, c.Abi, c.Ill, c.Edi, c.Num]
        .map(normalizeForSearch)
        .some((v) => v.includes(q));
    });
  }, [appliedQuery, appliedFilters, appliedStatFilters, latest]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));

  useEffect(() => {
    setPage(1);
  }, [appliedQuery, appliedFilters, appliedStatFilters]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageStart = (page - 1) * CARDS_PER_PAGE;
  const pageItems = filtered.slice(pageStart, pageStart + CARDS_PER_PAGE);

  const activeFilterCount = FILTER_DEFS.reduce(
    (sum, { key }) => sum + draftFilters[key].length,
    0,
  );

  const activeStatCount = STAT_FILTER_DEFS.reduce(
    (sum, { key }) =>
      sum +
      (draftStatFilters[key].min !== "" || draftStatFilters[key].max !== ""
        ? 1
        : 0),
    0,
  );

  const hasAppliedSearch =
    appliedQuery.trim() !== "" ||
    FILTER_DEFS.some(({ key }) => appliedFilters[key].length > 0) ||
    STAT_FILTER_DEFS.some(
      ({ key }) =>
        appliedStatFilters[key].min !== "" ||
        appliedStatFilters[key].max !== "",
    );

  const handleToggleFilter = (key, value) => {
    setDraftFilters((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const handleStatChange = (key, bound, value) => {
    setDraftStatFilters((prev) => ({
      ...prev,
      [key]: { ...prev[key], [bound]: value },
    }));
  };

  const handleSearch = () => {
    setAppliedQuery(draftQuery);
    setAppliedFilters(draftFilters);
    setAppliedStatFilters(draftStatFilters);
    setOpenFilter(null);
  };

  const handleClear = () => {
    setDraftQuery("");
    setDraftFilters(EMPTY_FILTERS);
    setDraftStatFilters(EMPTY_STAT_FILTERS);
    setAppliedQuery("");
    setAppliedFilters(EMPTY_FILTERS);
    setAppliedStatFilters(EMPTY_STAT_FILTERS);
    setOpenFilter(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateY = ((x - cx) / cx) * 5;
    const rotateX = -((y - cy) / cy) * 5;
    const glareX = (x / rect.width) * 15;
    const glareY = (y / rect.height) * 15;
    card.style.setProperty("--rx", `${rotateX}deg`);
    card.style.setProperty("--ry", `${rotateY}deg`);
    card.style.setProperty("--gx", `${glareX}%`);
    card.style.setProperty("--gy", `${glareY}%`);
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  const handleClick = (card) => {
    navigate(`/library/${card.Edi}/${card.Num}`);
  };

  return (
    <div className="library">
      <h1 className="library-title">Biblioteca del Templo</h1>

      <div className="library-search">
        <div className="library-search-row">
          <input
            type="text"
            placeholder="Buscar por nombre, habilidad, ilustrador..."
            value={draftQuery}
            onChange={(e) => setDraftQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="library-search-btn"
            onClick={handleSearch}
          >
            Buscar
          </button>
          <button
            type="button"
            className="library-search-btn library-search-btn-ghost"
            onClick={handleClear}
            disabled={
              !hasAppliedSearch && draftQuery === "" && activeFilterCount === 0
            }
          >
            Limpiar
          </button>
        </div>

        <div className="library-filters">
          {FILTER_DEFS.map(({ key, label }) => {
            const options = filterOptions[key] || [];
            const selected = draftFilters[key];
            const isOpen = openFilter === key;
            return (
              <div
                key={key}
                className={`library-filter ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="library-filter-toggle"
                  onClick={() => setOpenFilter(isOpen ? null : key)}
                >
                  {label}
                  {selected.length > 0 && (
                    <span className="library-filter-count">
                      {selected.length}
                    </span>
                  )}
                  <span
                    className={`library-filter-arrow ${isOpen ? "is-open" : ""}`}
                  >
                    &#9662;
                  </span>
                </button>
                {isOpen && (
                  <div className="library-filter-panel">
                    {options.map((opt) => {
                      const checked = selected.includes(opt.value);
                      return (
                        <label
                          key={opt.value}
                          className={`library-filter-option ${checked ? "is-checked" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleFilter(key, opt.value)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {(() => {
            const isOpen = openFilter === "__stats";
            return (
              <div
                className={`library-filter ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="library-filter-toggle"
                  onClick={() => setOpenFilter(isOpen ? null : "__stats")}
                >
                  Estadísticas
                  {activeStatCount > 0 && (
                    <span className="library-filter-count">
                      {activeStatCount}
                    </span>
                  )}
                  <span
                    className={`library-filter-arrow ${isOpen ? "is-open" : ""}`}
                  >
                    &#9662;
                  </span>
                </button>
                {isOpen && (
                  <div className="library-filter-panel library-filter-panel-stats">
                    {STAT_FILTER_DEFS.map(({ key, label }) => (
                      <div key={key} className="library-stat-range">
                        <span className="library-stat-range-label">
                          {label}
                        </span>
                        <input
                          type="number"
                          className="library-stat-range-input"
                          placeholder="mín"
                          value={draftStatFilters[key].min}
                          onChange={(e) =>
                            handleStatChange(key, "min", e.target.value)
                          }
                          onKeyDown={handleKeyDown}
                        />
                        <span className="library-stat-range-sep">–</span>
                        <input
                          type="number"
                          className="library-stat-range-input"
                          placeholder="máx"
                          value={draftStatFilters[key].max}
                          onChange={(e) =>
                            handleStatChange(key, "max", e.target.value)
                          }
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        <div className="library-search-meta">
          <span className="library-count">{filtered.length} cartas</span>
          {hasAppliedSearch && (
            <span className="library-search-status">Búsqueda aplicada</span>
          )}
        </div>
      </div>

      {filtered.length > 0 && (
        <div className="library-pagination">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Atrás
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}

      <div className="library-grid">
        {pageItems.map((card) => {
          const image = getLegacyImage(card.GUID);
          return (
            <div
              key={card.GUID}
              className="library-card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(card)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleClick(card);
              }}
            >
              <div className="library-card-inner">
                {image ? (
                  <img src={image} alt={card.Nam} draggable="false" />
                ) : (
                  <div className="library-card-placeholder">
                    <span className="placeholder-name">{card.Nam}</span>
                    <span className="placeholder-id">{`${card.Edi} ${card.Num}`}</span>
                  </div>
                )}
                <div className="library-card-glare" />
              </div>
              <div className="library-card-name">{card.Nam}</div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="library-empty">
          No hay cartas que coincidan con tu búsqueda.
        </div>
      )}

      {filtered.length > 0 && (
        <div className="library-pagination">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Atrás
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Library;
