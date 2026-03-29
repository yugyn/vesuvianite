import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { VIEW_TABLE, VIEW_LIST, MINERAL_FILTER_ALL, MINERAL_FILTER_BYSEARCH, MINERAL_FILTER_REAL, MINERAL_FILTER_VIRTUAL, MINERAL_GENESIS_NORMAL, MINERAL_GENESIS_FUMAROLIC, MINERAL_GENESIS_BOTH } from '../../costants';
import { MINERAL_TYPOLOGY_REAL, MINERAL_TYPOLOGY_VIRTUAL } from "../../costants";
import { mineralFullname } from '../../utils/mineralUtils';
import { AppIcons } from '../../utils/iconUtils';

const MineralList = ({ elementName, elementId, subList }) => {

    const navigate = useNavigate();
    
    const [elements, setElements] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState(VIEW_TABLE);
    const [filterView, setFilterView] = useState(MINERAL_FILTER_ALL);
    const [counts, setCounts] = useState({
            total: 0
            , real: 0
            , virtual: 0
            , normal: 0
            , fumarolic: 0
            , both: 0
    });
    const [crystalSystems, setCrystalSystems] = useState(null);
    const [mineralClasses, setMineralClasses] = useState(null);

    const initialFilters = {
        content: null,
        typology: null,
        crystalSystem: null,
        mineralClass: null,
    };    
    const [filters, setFilters] = useState(initialFilters);
    const [reallyFilters, setReallyFilters] = useState(initialFilters);


    async function loadAll() {

        try {

            const data = await window.electronAPI.getAllMinerals(reallyFilters);
            if(data) {
                setElements(data);
            } else {
                setError("Not found.");
            }

            const dataCounts = await window.electronAPI.getAllMineralsCount();
            if(dataCounts) {
                setCounts(dataCounts);
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
    }, [reallyFilters]);

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

        setReallyFilters(filters);

        setFilterView(MINERAL_FILTER_BYSEARCH);

    }

    const handleClear = () => {
        setError(null);
        setFilters(initialFilters);        
        setReallyFilters(initialFilters);        
    };    

    const changeFilterView = (filter) => {

        setFilterView(filter);

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
            <div className='row mb-2'>
                <div className='col'>
                    {subList ? (
                        <h4>Minerali ({elements.length})</h4>
                    ) : (
                        <h1>Minerali ({elements.length})</h1>
                    )}
                </div>
            </div>
            <div className='row'>
                <div className='col-md-10'>
                    <div className='row'>
                        <div className='col-md-9'>
                            <button 
                                className={`btn btn-primary btn-sm me-5`}
                                onClick={() => navigate(`/mineralSave/0`)}
                                title='Aggiungi minerale'
                            >
                                <AppIcons.Add />
                            </button>
                            <button 
                                className={`btn btn-outline-secondary btn-sm me-3 ${filterView === MINERAL_FILTER_ALL || !filter ? 'active' : ''}`}
                                onClick={() => changeFilterView(MINERAL_FILTER_ALL)}
                            >
                                Tutti: {counts.total}
                            </button>                    
                            <button 
                                className={`btn btn-outline-secondary btn-sm me-1 ${filterView === MINERAL_FILTER_REAL ? 'active' : ''}`}
                                onClick={() => changeFilterView(MINERAL_FILTER_REAL)}
                            >
                                Reali: {counts.real}
                            </button>                    
                            <button 
                                className={`btn btn-outline-secondary btn-sm me-1 ${filterView === MINERAL_FILTER_VIRTUAL ? 'active' : ''}`}
                                onClick={() => changeFilterView(MINERAL_FILTER_VIRTUAL)}
                            >
                                Virtuali: {counts.virtual}
                            </button>                    
                        </div>
                        <div className='col-md-3'>
                            <input 
                                type='search' 
                                className='form-control form-control-sm' 
                                placeholder='Ricerca rapida...' 
                                onChange={(e) => setSearch(e.target.value)} 
                            />
                        </div>
                    </div>
                    {view == 0 ? (
                        <div className='table-responsive' style={{marginTop: '10px'}}>
                            <table className="table table-bordered table-hover datatable-table" style={{ tableLayout: 'fixed' }}>
                                <thead className="table-light">
                                    <tr>
                                        <th scope='col'>
                                            Minerale
                                        </th>
                                        <th scope='col'>
                                            Formula
                                            </th>
                                        <th scope='col'>
                                            Sistema
                                        </th>
                                        <th scope='col'>
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
                                            <td>{mineralFullname(item)}</td>
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
                    <div className="row">
                        <div className='col-md-12 text-end'>
                            <div className='btn-group' role='group'>
                                <button 
                                    className={`btn btn-sm btn-outline-secondary ${view === VIEW_TABLE ? 'active' : ''}`}
                                    onClick={() => changeView(VIEW_TABLE)}
                                    title='Cambia in tabella'
                                >
                                    <AppIcons.View.Table />
                                </button>                    
                                <button 
                                    className={`btn btn-sm btn-outline-secondary ${view === VIEW_LIST ? 'active' : ''}`}
                                    onClick={() => changeView(VIEW_LIST)}
                                    title='Cambia in lista'
                                >
                                    <AppIcons.View.List />
                                </button>                    
                            </div>
                        </div>
                    </div>
                    <hr/>

                    <small><b><AppIcons.Search/> Cerca minerali</b></small>
                    <form onSubmit={handleSearch}>
                        <div className="row mt-2">
                            <label className="col-form-label">
                                <small>Nome contiene:</small>
                            </label>
                            <div>
                                <input 
                                    className="form-control form-control-sm"
                                    id="searchContent" 
                                    value={filters.content || ""}
                                    onChange={(e) => setFilters({...filters, content: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <label className="col-form-label">
                                <small>Tipo è:</small>
                            </label>
                            <div>
                                <select 
                                    className="form-select form-select-sm"
                                    id="searchTypology"
                                    value={filters.typology || ""}
                                    onChange={(e) => setFilters({...filters, typology: e.target.value})}
                                >
                                    <option value=''>- qualsiasi -</option>
                                    <option value={MINERAL_TYPOLOGY_REAL}>Reale</option>
                                    <option value={MINERAL_TYPOLOGY_VIRTUAL}>Virtuale</option>
                                </select>
                            </div>
                        </div>                
                        <div className="row mt-2">
                            <label className="col-form-label">
                                <small>Genesi è:</small>
                            </label>
                            <div>
                                <select 
                                    className="form-select form-select-sm"
                                    id="searchGenesis"
                                    value={filters.genesis || ""}
                                    onChange={(e) => setFilters({...filters, genesis: e.target.value})}
                                >
                                    <option value=''>- qualsiasi -</option>
                                    <option value={MINERAL_GENESIS_NORMAL}>Normale</option>
                                    <option value={MINERAL_GENESIS_FUMAROLIC}>Fumarolico</option>
                                    <option value={MINERAL_GENESIS_BOTH}>Sia normale sia fumarolico</option>
                                </select>
                            </div>
                        </div>                
                        <div className="row mt-2">
                            <label className="col-form-label">
                                <small>Sistema è:</small>
                            </label>
                            <div>
                                <select 
                                    className="form-select form-select-sm"
                                    id="searchCrystalSystem"
                                    value={filters.crystalSystem || ""}
                                    onChange={(e) => setFilters({...filters, crystalSystem: e.target.value})}
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
                        <div className="row mt-2">
                            <label className="col-form-label">
                                <small>Classe è:</small>
                            </label>
                            <div>
                                <select 
                                    className="form-select form-select-sm"
                                    id="searchMineralClass"
                                    value={filters.mineralClass || ""}
                                    onChange={(e) => setFilters({...filters, mineralClass: e.target.value})}
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

                        <div className="d-flex mt-4">
                            <div>
                                <button 
                                    className="btn btn-primary btn-sm"
                                ><AppIcons.Search/> Cerca</button>
                            </div>
                            <div className="ms-auto">
                                <button 
                                    type="button" 
                                    className="btn btn-sm btn-outline-primary " 
                                    onClick={handleClear}
                                    title='Resetta campi e ricarica'
                                >
                                    <AppIcons.ClearFields />
                                </button>                    
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );

};


export default MineralList;