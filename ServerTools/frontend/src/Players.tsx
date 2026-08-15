import React, { useState, useEffect } from "react";
import { Users, User, Heart, MapPin, Map, RefreshCw } from "lucide-react";

const API = "http://localhost:3002/api";

interface Position {
  x: number | string;
  y: number | string;
  z: number | string;
}

/**
 * Tipagem do espelho de PlayerResponse do backend
 */
interface Player {
  uuid: string;
  name: string;
  health: number;
  position: Position;
  dimension: string;
  gameMode: string;
}

/**
 * Componente que renderiza a grade visual dos jogadores.
 * Alimenta-se do backend via parseamento de arquivo .dat (NBT).
 */
export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /** Realiza Request Manual contra a API de lista NBT */
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/players`);
      const data = await res.json();
      setPlayers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar jogadores:", err);
    }
    setLoading(false);
  };

  /** Render Mount (Once) */
  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div>
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Jogadores</h1>
          <p>Dados de NBT extraidos do servidor em tempo real</p>
        </div>
        <button className="btn btn-primary" onClick={fetchPlayers} disabled={loading}>
          <RefreshCw size={18} className={loading ? "spin" : ""} /> Atualizar
        </button>
      </div>

      <div className="grid-cards">
        {players.length === 0 && !loading ? (
          <div className="card glass" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
            <Users size={48} color="rgba(255,255,255,0.2)" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ color: "var(--text-muted)" }}>Nenhum jogador online ou registrado no cache</h3>
          </div>
        ) : (
          players.map((p) => (
            <div key={p.uuid} className="card glass player-card">
              <div className="card-header">
                <div className="card-title">
                  <User size={20} color="var(--primary)" />
                  {p.name}
                </div>
                <span className="status-badge running" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                  {p.gameMode}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                UUID: {p.uuid}
              </div>

              <div className="player-stats">
                <div className="stat">
                  <Heart size={16} color="#ef4444" />
                  <span>HP: <strong>{p.health} / 20</strong></span>
                </div>
                <div className="stat">
                  <Map size={16} color="#8b5cf6" />
                  <span>Dimensao: <strong>{p.dimension.split(":")[1] || p.dimension}</strong></span>
                </div>
                <div className="stat">
                  <MapPin size={16} color="#10b981" />
                  <span>XYZ: <strong>{p.position.x}, {p.position.y}, {p.position.z}</strong></span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
