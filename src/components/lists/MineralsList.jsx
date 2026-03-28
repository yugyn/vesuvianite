
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { VIEW_TABLE, VIEW_LIST, MINERAL_FILTER_ALL, MINERAL_FILTER_BYSEARCH, MINERAL_FILTER_REAL, MINERAL_FILTER_VIRTUAL } from '../../costants';
import { MINERAL_TYPOLOGY_REAL, MINERAL_TYPOLOGY_VIRTUAL } from "../../costants";
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
    const [crystalSystems, setCrystalSystems] = useState(null);
    const [mineralClasses, setMineralClasses] = useState(null);
    const [filters, setFilters] = useState({
        content: null,
        typology: null,
        crystalSystem: null,
        mineralClass: null,
    });


    async function loadAll() {

        try {

            const data = await window.electronAPI.getAllMinerals(filters);
            if(data) {
                setElements(data);
            } else {
                setError("Not found.");
            }

            const dataCount = await window.electronAPI.getAllMineralsCount();
            if(dataCount) {
                setCount(dataCount);
            }

            const dataCS = await window.electronAPI.getAllCrystalSystems();
            if(dataCS) {
                setCrystalSystems(dataCS);
            }

            const dataMC = await window.electronAPI.getAllMineralClasses();
            if(dataMC) {
                setMineralClasses(dataMC);
            }

        } catch(err) {
            setError("Error...");
            console.error(err);
        } finally {
            setLoading(false);
        }
        
    }

    useEffect( () => {
        loadAll(MINERAL_FILTER_ALL);
    }, [filters]);

    if (error) return <div>{error}</div>;
    if (loading) return <div>Caricamento in corso...</div>;

    const elementsFiltered = elements.filter((e) => {
        const query = search.toLowerCase();
        return e.name.toLowerCase().includes(query);
    });

    const changeView = (view) => {
        setView(view);
    };

    const handleSearch = async (e) => {
    
        e.preventDefault();
        setError(null);

        const content = document.getElementById('searchContent').value.trim();
        const typology = document.getElementById('searchTypology').value;
        const crystalSystem = document.getElementById('searchCrystalSystem').value;
        const mineralClass = document.getElementById('searchMineralClass').value;

        setFilters({
            content: content,
            typology: typology,
            crystalSystem: crystalSystem,
            mineralClass: mineralClass,
        });

        loadAll();

        setFilter(MINERAL_FILTER_BYSEARCH);

    }

    const changeFilter = (filter) => {

        setFilter(filter);

        if(filter == MINERAL_FILTER_ALL) {
            filters.typology = null;
        } else if(filter == MINERAL_FILTER_REAL) {
            filters.typology = MINERAL_TYPOLOGY_REAL;
        } else if(filter == MINERAL_FILTER_VIRTUAL) {
            filters.typology = MINERAL_TYPOLOGY_VIRTUAL;
        }

        loadAll();

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
            <div className='row'>
                <div className='col-md-10'>
                    <button 
                        className={`btn btn-outline-primary ${filter === MINERAL_FILTER_ALL || !filter ? 'active' : ''}`}
                        onClick={() => changeFilter(MINERAL_FILTER_ALL)}
                    >
                        Tutti: {count.totals}
                    </button>                    
                    <button 
                        className={`btn btn-outline-primary ${filter === MINERAL_FILTER_REAL ? 'active' : ''}`}
                        onClick={() => changeFilter(MINERAL_FILTER_REAL)}
                    >
                        Reali: {count.reals}
                    </button>                    
                    <button 
                        className={`btn btn-outline-primary ${filter === MINERAL_FILTER_VIRTUAL ? 'active' : ''}`}
                        onClick={() => changeFilter(MINERAL_FILTER_VIRTUAL)}
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
                </div>
                <div className='col-md-2'>
                    <form onSubmit={handleSearch}>
                        <div className="row">
                            <label className="col-form-label">
                                Nome contiene:
                            </label>
                            <div>
                                <input 
                                    className="form-control"
                                    id="searchContent" 
                                />
                            </div>
                        </div>
                        <div className="row">
                            <label className="col-form-label">
                                Tipo è:
                            </label>
                            <div>
                                <select 
                                    className="form-select"
                                    id="searchTypology"
                                >
                                    <option value=''>- qualsiasi -</option>
                                    <option value={MINERAL_TYPOLOGY_REAL}>Reale</option>
                                    <option value={MINERAL_TYPOLOGY_VIRTUAL}>Virtuale</option>
                                </select>
                            </div>
                        </div>                
                        <div className="row">
                            <label className="col-form-label">
                                Sistema è:
                            </label>
                            <div>
                                <select 
                                    className="form-select"
                                    id="searchCrystalSystem"
                                >
                                    <option value=''>- qualsiasi -</option>
                                    {crystalSystems.map((item) => (
                                        <option 
                                            key={item.id}
                                            value={item.id}
                                        >{item.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>                
                        <div className="row">
                            <label className="col-form-label">
                                Classe è:
                            </label>
                            <div>
                                <select 
                                    className="form-select"
                                    id="searchMineralClass"
                                >
                                    <option value=''>- qualsiasi -</option>
                                    {mineralClasses.map((item) => (
                                        <option 
                                            key={item.id}
                                            value={item.id}
                                        >{item.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>                
                        <hr/>

                        <button 
                            className="btn btn-primary"
                        >Cerca</button>

                    </form>
                </div>
            </div>
        </>
    );

};


export default MineralsList;