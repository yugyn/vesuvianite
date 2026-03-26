
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { VIEW_TABLE, VIEW_LIST, MINERAL_FILTER_ALL, MINERAL_FILTER_REAL, MINERAL_FILTER_VIRTUAL } from '../../costants';
import { mineralName } from '../../utils/mineralUtils';

const MineralsList = ({ elementName, elementId, subList }) => {

    const navigate = useNavigate();
    const [elements, setElements] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState(VIEW_TABLE);
    const [filter, setFilter] = useState(MINERAL_FILTER_ALL);
    const [count, setCount] = useState({
            totals: 0
            , reals: 0
            , virtuals: 0
            , normals: 0
            , fumarolics: 0
            , boths: 0
    });

    async function loadElements(filter) {

        try {

            const data = await window.electronAPI.getAllMineralsByElement({elementName: elementName, elementId: elementId, filter: filter});
            if(data) {
                setElements(data);
            } else {
                setError("Not found.");
            }

            const dataCount = await window.electronAPI.getAllMineralsCount();
            if(dataCount) {
                setCount(dataCount);
            }

            setFilter(filter);

        } catch(err) {
            setError("Error...");
            console.error(err);
        } finally {
            setLoading(false);
        }
        
    }

    useEffect( () => {
        loadElements(MINERAL_FILTER_ALL);
    }, []);

    if (error) return <div>{error}</div>;
    if (loading) return <div>Caricamento in corso...</div>;

    const elementsFiltered = elements.filter((e) => {
        const query = search.toLowerCase();
        return e.name.toLowerCase().includes(query);
    });

    const changeView = (view) => {
        setView(view);
    };

    return (
        <>
            <div className='row'>
                <div className='col'>
                    {subList ? (
                        <h4>Minerali ({elements.length})</h4>
                    ) : (
                        <h1>Minerali ({elements.length})</h1>
                    )}
                </div>
                <div className='col d-flex justify-content-end'>
                    <input 
                        style={{width: '200px'}}
                        type='search' 
                        className='form-control' 
                        placeholder='Cerca minerale...' 
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                    <div className='btn-group' role='group'>
                        <button 
                            className={`btn btn-outline-primary ${view === VIEW_TABLE ? 'active' : ''}`}
                            onClick={() => changeView(VIEW_TABLE)}
                        >
                            Cambia in tabella
                        </button>                    
                        <button 
                            className={`btn btn-outline-primary ${view === VIEW_LIST ? 'active' : ''}`}
                            onClick={() => changeView(VIEW_LIST)}
                        >
                            Cambia in lista
                        </button>                    
                    </div>
                </div>
            </div>
            <button 
                className={`btn btn-outline-primary ${filter === MINERAL_FILTER_ALL || !filter ? 'active' : ''}`}
                onClick={() => loadElements(MINERAL_FILTER_ALL)}
            >
                Tutti: {count.totals}
            </button>                    
            <button 
                className={`btn btn-outline-primary ${filter === MINERAL_FILTER_REAL ? 'active' : ''}`}
                onClick={() => loadElements(MINERAL_FILTER_REAL)}
            >
                Reali: {count.reals}
            </button>                    
            <button 
                className={`btn btn-outline-primary ${filter === MINERAL_FILTER_VIRTUAL ? 'active' : ''}`}
                onClick={() => loadElements(MINERAL_FILTER_VIRTUAL)}
            >
                Virtuali: {count.virtuals}
            </button>                    
            {view == 0 ? (
                <div className='table-responsive' style={{marginTop: '10px'}}>
                    <table className="table table-bordered table-hover datatable-table">
                        <thead className="table-light">
                            <tr>
                                <th className='col'>
                                    Minerale
                                </th>
                                <th className='col'>
                                    Formula
                                    </th>
                                <th className='col'>
                                    Sistema
                                </th>
                                <th className='col'>
                                    Classe
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {elementsFiltered.map((item) => (
                                <tr 
                                    key={item.id} 
                                    onClick={() => navigate(`/mineral/${item.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{mineralName(item)}</td>
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
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
                    {elementsFiltered.map((item) => (
                        <div className='col' 
                            key={item.id} 
                            onClick={() => navigate(`/mineral/${item.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className='table-responsive' style={{marginTop: '10px'}}>
                                <table className="table table-bordered table-hover">
                                    <tbody>
                                        <tr>
                                            <td>
                                                {item.name}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );

};


export default MineralsList;