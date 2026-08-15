import { useState, useEffect } from "react";
import { Play, Square, RotateCw, Server, Zap, HardDrive, Download } from "lucide-react";

const API = "http://localhost:3002/api";

export default function Dashboard() {
  const [status, setStatus] = useState("stopped");
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupToast, setBackupToast] = useState(null);
  const [backups, setBackups] = useState([]);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API}/status`);
      const data = await res.json();
      setStatus(data.status);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBackups = async () => {
    try {
      const res = await fetch(`${API}/backups`);
      const data = await res.json();
      setBackups(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchBackups();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/${action}`, { method: "POST" });
      const data = await res.json();
      if (data.status) setStatus(data.status);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    setBackupToast(null);
    try {
      const res = await fetch(`${API}/backup`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setBackupToast(`Backup criado: ${data.backup.filename} (${data.backup.sizeMB} MB)`);
        fetchBackups();
        setTimeout(() => setBackupToast(null), 5000);
      }
    } catch (err) {
      setBackupToast("Erro ao criar backup!");
      console.error(err);
    }
    setBackupLoading(false);
  };

  const statusLabel = {
    running: "Online",
    stopped: "Offline",
    starting: "Iniciando",
    stopping: "Parando",
  };

  return (
    <div>
      <div className="header">
        <h1>Dashboard</h1>
        <p>Gerencie o estado do servidor ATM Lite</p>
      </div>

      <div className="info-banner glass">
        <Zap size={20} color="#10b981" />
        <span><strong>ATM Lite</strong> - Versao otimizada com ~35 mods. Requer apenas 4-6GB de RAM!</span>
      </div>

      <div className="grid-cards" style={{ marginTop: "2rem" }}>
        {/* Card de controle */}
        <div className="card glass">
          <div className="card-header">
            <div className="card-title">
              <Server size={20} />
              Status do Servidor
            </div>
            <span className={`status-badge ${status}`}>
              {statusLabel[status] || status}
            </span>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              className="btn btn-success"
              onClick={() => handleAction("start")}
              disabled={status !== "stopped" || loading}
              style={{ flex: 1 }}
            >
              <Play size={18} /> Iniciar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleAction("stop")}
              disabled={status !== "running" || loading}
              style={{ flex: 1 }}
            >
              <Square size={18} /> Parar
            </button>
            <button
              className="btn btn-warning"
              onClick={() => handleAction("restart")}
              disabled={(status !== "running" && status !== "stopped") || loading}
              style={{ flex: 1 }}
            >
              <RotateCw size={18} /> Reiniciar
            </button>
          </div>
        </div>

        {/* Card de Backup [US05] */}
        <div className="card glass">
          <div className="card-header">
            <div className="card-title">
              <HardDrive size={20} />
              Backup do Mundo
            </div>
            <button
              className="btn btn-primary"
              onClick={handleBackup}
              disabled={backupLoading || status === "running"}
              title={status === "running" ? "Pare o servidor antes de criar um backup" : ""}
            >
              {backupLoading ? (
                <><RotateCw size={16} style={{ animation: "spin 1s linear infinite" }} /> Criando...</>
              ) : (
                <><Download size={16} /> Criar Backup</>
              )}
            </button>
          </div>

          {backupToast && (
            <div style={{ marginTop: "0.75rem", padding: "0.5rem 1rem", background: "rgba(16,185,129,0.15)", borderRadius: "8px", color: "#10b981", fontSize: "0.85rem" }}>
              {backupToast}
            </div>
          )}

          <div style={{ marginTop: "1rem" }}>
            {backups.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Nenhum backup encontrado.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {backups.slice(0, 5).map((b) => (
                  <li key={b.filename} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{b.filename.replace("world_backup_", "").replace(".zip", "")}</span>
                    <span style={{ color: "var(--accent)" }}>{b.sizeMB} MB</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
