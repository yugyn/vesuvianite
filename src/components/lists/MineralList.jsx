import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { VIEW_TABLE, VIEW_LIST, MINERAL_FILTER_ALL, MINERAL_FILTER_REAL, MINERAL_FILTER_VIRTUAL, MINERAL_GENESIS_NORMAL, MINERAL_GENESIS_FUMAROLIC, MINERAL_GENESIS_BOTH, ELEMENT_CRYSTALSYSTEM } from '../../costants';
import { MINERAL_TYPOLOGY_REAL, MINERAL_TYPOLOGY_VIRTUAL } from "../../costants";
import { mineralFullname } from '../../utils/mineralUtils';
import { AppIcons } from '../../utils/iconUtils';

const MineralList = ({ elementName, elementId, subList }) => {

    const { t } = useTranslation();

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
        elementName: elementName,
        elementId: elementId,
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

            const dataCounts = await window.electronAPI.getAllMineralsCount(reallyFilters);
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
            elementName: elementName,
            elementId: elementId,
        });

        setReallyFilters(filters);

    }

    const handleClear = () => {
        setError(null);
        setFilters(initialFilters);        
        setReallyFilters(initialFilters);        
    };    

    const changeFilterView = (filterView) => {

        setFilterView(filterView);

        if(filterView == MINERAL_FILTER_ALL) {
            filters.typology = null;
        } else if(filterView == MINERAL_FILTER_REAL) {
            filters.typology = MINERAL_TYPOLOGY_REAL;
        } else if(filterView == MINERAL_FILTER_VIRTUAL) {
            filters.typology = MINERAL_TYPOLOGY_VIRTUAL;
        }

        loadAll();

    };


    return (
        <>
            <div className='row mb-2'>
                <div className='col'>
                    {subList ? (
                        <h4>{t('mineral.list.title')} ({elements.length})</h4>
                    ) : (
                        <h1>{t('mineral.list.title')} ({elements.length})</h1>
                    )}
                </div>
            </div>
            <div className='row'>
                <div className='col-md-10'>
                    <div className='row' style={{marginBottom: '15px'}}>
                        <div className='col-md-9'>
                            {!subList && (
                                <button 
                                    className={`btn btn-primary btn-sm me-5`}
                                    onClick={() => navigate(`/mineralSave/0`)}
                                    title={t('mineral.action.add')}
                                >
                                    <AppIcons.Add />
                                </button>
                            )}
                            <button 
                                className={`btn btn-outline-secondary btn-sm me-3 ${filterView === MINERAL_FILTER_ALL ? 'active' : ''}`}
                                onClick={() => changeFilterView(MINERAL_FILTER_ALL)}
                            >
                                {t('mineral.filter.alls')} {counts.total}
                            </button>                    
                            <button 
                                className={`btn btn-outline-secondary btn-sm me-1 ${filterView === MINERAL_FILTER_REAL ? 'active' : ''}`}
                                onClick={() => changeFilterView(MINERAL_FILTER_REAL)}
                            >
                                {t('mineral.filter.reals')} {counts.real}
                            </button>                    
                            <button 
                                className={`btn btn-outline-secondary btn-sm me-1 ${filterView === MINERAL_FILTER_VIRTUAL ? 'active' : ''}`}
                                onClick={() => changeFilterView(MINERAL_FILTER_VIRTUAL)}
                            >
                                {t('mineral.filter.virtuals')} {counts.virtual}
                            </button>                    
                        </div>
                        <div className='col-md-3'>
                            <input 
                                type='search' 
                                className='form-control form-control-sm' 
                                placeholder={t('search.quick')}
                                onChange={(e) => setSearch(e.target.value)} 
                            />
                        </div>
                    </div>
                    {view == 0 ? (
                        <div className='table-responsive'>
                            <table className="table table-bordered table-hover datatable-table" style={{ tableLayout: 'fixed' }}>
                                <thead className="table-light">
                                    <tr>
                                        <th scope='col'>
                                            {t('mineral.label')}
                                        </th>
                                        <th scope='col'>
                                            {t('mineral.formula')}
                                        </th>
                                        {!(elementName == ELEMENT_CRYSTALSYSTEM) && (
                                            <th scope='col'>
                                                {t('crystalSystem.label')}
                                            </th>
                                        )}
                                        <th scope='col'>
                                            {t('mineralClass.label')}
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
                                            <td dangerouslySetInnerHTML={{__html: item.formula}} />
                                            {!(elementName == ELEMENT_CRYSTALSYSTEM) && (
                                                <td>
                                                    <span 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/crystalSystem/${item.csId}`);
                                                        }}
                                                    >{item.csName}</span>
                                                </td>
                                            )}
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
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                            {elementsFiltered.map((item) => (
                                <div className='col' 
                                    key={item.id} 
                                    onClick={() => navigate(`/mineral/${item.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className='table-responsive'>
                                        <table className="table table-bordered table-hover" style={{margin: '0px'}}>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        {mineralFullname(item)}
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
                <div className='col-md-2 content-search'>
                    <div className="row">
                        <div className='col-md-12 text-end'>
                            <div className='btn-group' role='group'>
                                <button 
                                    className={`btn btn-sm btn-outline-secondary ${view === VIEW_TABLE ? 'active' : ''}`}
                                    onClick={() => changeView(VIEW_TABLE)}
                                    title={t('view.action.change.table')}
                                >
                                    <AppIcons.View.Table />
                                </button>                    
                                <button 
                                    className={`btn btn-sm btn-outline-secondary ${view === VIEW_LIST ? 'active' : ''}`}
                                    onClick={() => changeView(VIEW_LIST)}
                                    title={t('view.action.change.list')}
                                >
                                    <AppIcons.View.List />
                                </button>                    
                            </div>
                        </div>
                    </div>
                    <hr/>

                    <small>
                        <b>
                            <AppIcons.Search/> {t('mineral.search.title')}
                        </b>
                    </small>
                    <form onSubmit={handleSearch}>
                        <div className="row mt-2">
                            <label className="col-form-label">
                                <small>{t('mineral.search.content')}</small>
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
                                <small>{t('mineral.search.typology')}</small>
                            </label>
                            <div>
                                <select 
                                    className="form-select form-select-sm"
                                    id="searchTypology"
                                    value={filters.typology || ""}
                                    onChange={(e) => setFilters({...filters, typology: e.target.value})}
                                >
                                    <option value=''>{t('search.any')}</option>
                                    <option value={MINERAL_TYPOLOGY_REAL}>Reale</option>
                                    <option value={MINERAL_TYPOLOGY_VIRTUAL}>Virtuale</option>
                                </select>
                            </div>
                        </div>                
                        <div className="row mt-2">
                            <label className="col-form-label">
                                <small>{t('mineral.search.genesis')}</small>
                            </label>
                            <div>
                                <select 
                                    className="form-select form-select-sm"
                                    id="searchGenesis"
                                    value={filters.genesis || ""}
                                    onChange={(e) => setFilters({...filters, genesis: e.target.value})}
                                >
                                    <option value=''>{t('search.any')}</option>
                                    <option value={MINERAL_GENESIS_NORMAL}>Normale</option>
                                    <option value={MINERAL_GENESIS_FUMAROLIC}>Fumarolico</option>
                                    <option value={MINERAL_GENESIS_BOTH}>Sia normale sia fumarolico</option>
                                </select>
                            </div>
                        </div>                
                        <div className="row mt-2" style={{display: (elementName == ELEMENT_CRYSTALSYSTEM ? 'none' : '')}}>
                            <label className="col-form-label">
                                <small>{t('mineral.search.crystalSystem')}</small>
                            </label>
                            <div>
                                <select 
                                    className="form-select form-select-sm"
                                    id="searchCrystalSystem"
                                    value={filters.crystalSystem || ""}
                                    onChange={(e) => setFilters({...filters, crystalSystem: e.target.value})}
                                >
                                    <option value=''>{t('search.any')}</option>
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
                                <small>{t('mineral.search.mineralClass')}</small>
                            </label>
                            <div>
                                <select 
                                    className="form-select form-select-sm"
                                    id="searchMineralClass"
                                    value={filters.mineralClass || ""}
                                    onChange={(e) => setFilters({...filters, mineralClass: e.target.value})}
                                >
                                    <option value=''>{t('search.any')}</option>
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
                                ><AppIcons.Search/> {t('search.action.search')}</button>
                            </div>
                            <div className="ms-auto">
                                <button 
                                    type="button" 
                                    className="btn btn-sm btn-outline-primary " 
                                    onClick={handleClear}
                                    title={t('search.action.clear')}
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