import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const CrystalSystems = () => {

    const navigate = useNavigate();
    const [elements, setElements] = useState(null);
    const [error, setError] = useState(null);

    useEffect( () => {

        async function loadElements() {

            try {

                const data = await window.electronAPI.getAllCrystalSystems();
                if(data) {
                    setElements(data);
                } else {
                    setError("Not found.");
                }
            } catch(err) {
                setError("Error...");
                console.error(err);
            }
            
        }

        loadElements();

    }, []);

    if (error) return <div>{error}</div>;
    if (!elements) return <div>Caricamento in corso...</div>;

    return (
        <div style={{ padding: '20px' }}>
        <h1>Crystal Systems </h1>
        <Link to="/" className="btn">Torna alla Home</Link>

        <table className="table table-bordered table-hover datatable-table" id="sortTable">
            <thead className="table-light">
                <tr>
                    <th>Classe</th>
                    <th style={{textAlign: 'center', width: '100px'}}>Modelli</th>
                    <th style={{textAlign: 'center', width: '100px'}}>Minerali</th>
                    <th>Area</th>
                </tr>
            </thead>
            <tbody>
                {elements.map((item) => (
                <tr 
                    key={item.id} 
                    onClick={() => navigate(`/crystalSystem/${item.id}`)}
                    style={{ cursor: 'pointer' }}
                >
                    <td>{item.name}</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                ))}
            </tbody>
        </table>        

        </div>
    );

};


export default CrystalSystems;