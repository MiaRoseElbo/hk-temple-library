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
  const [appliedQuery, setAppliedQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
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
    return latest.filter((c) => {
      for (const { key } of FILTER_DEFS) {
        const selected = appliedFilters[key];
        if (selected.length > 0 && !selected.includes(String(c[key] ?? ""))) {
          return false;
        }
      }
      if (!q) return true;
      return [c.Nam, c.Sub, c.Abi, c.Ill, c.Edi, c.Num]
        .map(normalizeForSearch)
        .some((v) => v.includes(q));
    });
  }, [appliedQuery, appliedFilters, latest]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));

  useEffect(() => {
    setPage(1);
  }, [appliedQuery, appliedFilters]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageStart = (page - 1) * CARDS_PER_PAGE;
  const pageItems = filtered.slice(pageStart, pageStart + CARDS_PER_PAGE);

  const activeFilterCount = FILTER_DEFS.reduce(
    (sum, { key }) => sum + draftFilters[key].length,
    0,
  );

  const hasAppliedSearch =
    appliedQuery.trim() !== "" ||
    FILTER_DEFS.some(({ key }) => appliedFilters[key].length > 0);

  const handleToggleFilter = (key, value) => {
    setDraftFilters((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const handleSearch = () => {
    setAppliedQuery(draftQuery);
    setAppliedFilters(draftFilters);
    setOpenFilter(null);
  };

  const handleClear = () => {
    setDraftQuery("");
    setDraftFilters(EMPTY_FILTERS);
    setAppliedQuery("");
    setAppliedFilters(EMPTY_FILTERS);
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
