import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/vehicles');
      if (!response.ok) throw new Error(`A API retornou HTTP ${response.status}.`);
      setVehicles(await response.json());
    } catch (error) {
      setError(`Não foi possível carregar os veículos. ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main>
      <h1>Lista de veículos</h1>
      <p>Veículos cadastrados no banco de dados.</p>
      <button onClick={load} disabled={loading}>
        {loading ? 'Carregando...' : 'Atualizar lista'}
      </button>

      {error && <p role="alert" className="error">{error}</p>}

      <div className="table-wrapper" aria-busy={loading}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Ano</th>
              <th>Quilometragem</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td>{vehicle.plate}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.year}</td>
                <td>{vehicle.mileage} km</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && !error && vehicles.length === 0 && <p>Nenhum veículo cadastrado.</p>}
      {!loading && !error && vehicles.length > 0 && <p>Total: {vehicles.length}</p>}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
