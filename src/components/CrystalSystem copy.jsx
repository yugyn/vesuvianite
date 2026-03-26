import { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';

const CrystalSystem = () => {

    const { id } = useParams();
    const [element, setElement] = useState(null);
    const [elements, setElements] = useState(null);
    const [error, setError] = useState(null);

    useEffect( () => {

        async function loadElement() {

            try {

                const data = await window.electronAPI.getCrystalSystem(id);
                if(data) {
                    setElement(data);
                } else {
                    setError("Not found.");
                }

                const dataMineral = await window.electronAPI.getAllMineralsByCrystalSystem(id);
                if(dataMineral) {
                    setElements(dataMineral);
                } else {
                    setError("Not found.");
                }

            } catch(err) {
                setError("Error...");
                console.error(err);
            }
            
        }

        if(id) loadElement();

    }, [id]);

    if (error) return <div>{error}</div>;
    if (!element || !elements) return <div>Caricamento in corso...</div>;

    return (
        <>
            <div style={{ padding: '20px' }}>
                <h1>Crystal System</h1>
                <Link to="/crystalSystems" className="btn">Torna a Crystal Systems</Link>

                <table className="table table-bordered table-hover datatable-table" id="sortTable">
                    <tbody id="tbody">
                        <tr>
                            <td>
                                Sistema cristallino
                            </td>
                            <td>
                                {element.name}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Area
                            </td>
                            <td>
                                ?
                            </td>
                        </tr>
                    </tbody>
                </table>        

                <h2>Minerals</h2>

                <table className="table table-bordered table-hover datatable-table" id="sortTable">
                    <thead className="table-light">
                        <tr>
                            <th>Minerale</th>
                            <th>Formula</th>
                            <th>Sistema</th>
                            <th>Classe</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elements.map((item) => (
                        <tr 
                            key={item.id} 
                            onClick={() => navigate(`/mineral/${item.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{item.name}</td>
                            <td>{item.formula}</td>
                            <td>
                                <span 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/crystalSystem/${item.csId}`);
                                    }}
                                >{item.csName}</span>
                            </td>
                            <td>
                                <span 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/mineralClass/${item.mcId}`);
                                    }}
                                >{item.mcName}</span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>        

            </div>
        </>
    );

};


export default CrystalSystem;