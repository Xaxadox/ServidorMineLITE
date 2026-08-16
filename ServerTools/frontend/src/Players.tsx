import React, { useState, useEffect } from "react";
import { Users, User, Heart, MapPin, Map, RefreshCw, Drumstick, Skull, Trash2, BatteryWarning } from "lucide-react";

const API = "http://localhost:3002/api";

interface Position {
  x: number | string;
  y: number | string;
  z: number | string;
}

interface Player {
  uuid: string;
  name: string;
  health: number;
  position: Position;
  dimension: string;
  gameMode: string;
}

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  const handleAction = async (playerName: string, action: string) => {
    setActionLoading(`${playerName}-${action}`);
    try {
      await fetch(`${API}/players/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, action })
      });
      // Acao enviada!
    } catch (err) {
      console.error(err);
    }
    setActionLoading(null);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div>
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Jogadores</h1>
          <p>Gerencie jogadores online (Cure, Alimente, Esfomeie, ou Mate)</p>
        </div>
        <button className="btn btn-primary" onClick={fetchPlayers} disabled={loading}>
          <RefreshCw size={18} className={loading ? "spin" : ""} /> Atualizar
        </button>
      </div>

      <div className="grid-cards">
        {players.length === 0 && !loading ? (
          <div className="card glass" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
            <Users size={48} color="rgba(255,255,255,0.2)" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ color: "var(--text-muted)" }}>Nenhum jogador registrado no cache</h3>
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
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                UUID: {p.uuid}
              </div>

              <div className="player-stats" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Heart size={16} color="#ef4444" />
                  <span style={{ fontSize: "0.9rem" }}>HP: <strong>{p.health} / 20</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Map size={16} color="#8b5cf6" />
                  <span style={{ fontSize: "0.9rem" }}>Dimensao: <strong>{p.dimension.split(":")[1] || p.dimension}</strong></span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <button 
                  className="btn btn-success" 
                  style={{ padding: "0.5rem", fontSize: "0.9rem" }}
                  onClick={() => handleAction(p.name, "heal")}
                  disabled={actionLoading !== null}
                  title="Curar Vida"
                >
                  <Heart size={16} /> Curar
                </button>
                <button 
                  className="btn btn-warning" 
                  style={{ padding: "0.5rem", fontSize: "0.9rem" }}
                  onClick={() => handleAction(p.name, "feed")}
                  disabled={actionLoading !== null}
                  title="Alimentar"
                >
                  <Drumstick size={16} /> Alimentar
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: "0.5rem", fontSize: "0.9rem", background: "var(--card-border)", color: "var(--text-main)" }}
                  onClick={() => handleAction(p.name, "starve")}
                  disabled={actionLoading !== null}
                  title="Tirar Fome"
                >
                  <BatteryWarning size={16} /> Esfomear
                </button>
                <button 
                  className="btn btn-danger" 
                  style={{ padding: "0.5rem", fontSize: "0.9rem" }}
                  onClick={() => handleAction(p.name, "kill")}
                  disabled={actionLoading !== null}
                  title="Matar"
                >
                  <Skull size={16} /> Matar
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: "0.5rem", fontSize: "0.9rem", gridColumn: "1 / -1" }}
                  onClick={() => handleAction(p.name, "clear")}
                  disabled={actionLoading !== null}
                  title="Limpar Inventario"
                >
                  <Trash2 size={16} /> Limpar Inventario
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
