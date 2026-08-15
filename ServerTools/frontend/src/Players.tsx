import { useState, useEffect } from 'react';
import { Users, Heart, Drumstick } from 'lucide-react';

const API = 'http://localhost:3002/api';

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = async () => {
    try {
      const res = await fetch(`${API}/players`);
      const data = await res.json();
      setPlayers(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatItemName = (id) => {
    if (!id) return '';
    return id.replace('minecraft:', '').replace(/_/g, ' ');
  };

  return (
    <div>
      <div className="header">
        <h1>Jogadores</h1>
        <p>Acompanhe o status e o inventario dos jogadores (Atualizado ao salvar o servidor)</p>
      </div>

      {loading ? (
        <p>Carregando dados dos jogadores...</p>
      ) : players.length === 0 ? (
        <div className="card glass">
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum dado de jogador encontrado ainda. Inicie o servidor e jogue um pouco!</p>
        </div>
      ) : (
        <div className="grid-cards">
          {players.map((player) => (
            <div className="card glass player-card" key={player.uuid}>
              <div className="player-header">
                <div className="player-avatar">
                  <img src={`https://mc-heads.net/avatar/${player.uuid}/48`} alt={player.name} />
                </div>
                <div className="player-info">
                  <h3>{player.name}</h3>
                  <p>Posicao: X:{player.pos[0]} Y:{player.pos[1]} Z:{player.pos[2]}</p>
                </div>
              </div>

              <div>
                <div className="stat-bar-container">
                  <div className="stat-bar-label">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Heart size={14} color="#ef4444" /> Vida</span>
                    <span>{Math.ceil(player.health)} / 20</span>
                  </div>
                  <div className="stat-bar-bg">
                    <div className="stat-bar-fill health-fill" style={{ width: `${Math.min(100, (player.health / 20) * 100)}%` }}></div>
                  </div>
                </div>

                <div className="stat-bar-container">
                  <div className="stat-bar-label">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Drumstick size={14} color="#f59e0b" /> Fome</span>
                    <span>{Math.ceil(player.foodLevel)} / 20</span>
                  </div>
                  <div className="stat-bar-bg">
                    <div className="stat-bar-fill food-fill" style={{ width: `${Math.min(100, (player.foodLevel / 20) * 100)}%` }}></div>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Inventario (Itens)</h4>
                <div className="inventory-grid">
                  {player.inventory && player.inventory.length > 0 ? (
                    player.inventory.map((item, idx) => (
                      <div className="inventory-slot" key={idx} title={formatItemName(item.id)}>
                        <img 
                           src={`https://mc-heads.net/inventory/${item.id.replace('minecraft:', '')}`} 
                           alt={item.id} 
                           style={{ width: '24px', height: '24px' }}
                           onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = '?'; }}
                        />
                        {item.count > 1 && <span className="item-count">{item.count}</span>}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.8rem', gridColumn: '1 / -1' }}>Inventario vazio ou nao lido.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
