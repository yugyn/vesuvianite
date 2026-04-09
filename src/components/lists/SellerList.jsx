import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { VIEW_TABLE, VIEW_LIST } from '../../costants';
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';

const SellerList = ({ subList }) => {

    const { t } = useTranslation();

    const navigate = useNavigate();
    
    const [elements, setElements] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState(VIEW_TABLE);
    const [counts, setCounts] = useState({
            total: 0
    });

    const initialFilters = {
        content: null,
    };    
    const [filters, setFilters] = useState(initialFilters);
    const [reallyFilters, setReallyFilters] = useState(initialFilters);


    async function loadAll() {

        try {

            const data = await window.electronAPI.getAllSellers(reallyFilters);
            if(data) {
                setElements(data);
            } else {
                setError("Not found.");
            }

        } catch(err) {
            setError("Error...");
            console.error(err);
        } finally {
            setLoading(false);
        }
        
    }

    useEffect( () => {
        loadAll();
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

        setFilters({
            content: content,
        });

        setReallyFilters(filters);

    }

    const handleClear = () => {
        setError(null);
        setFilters(initialFilters);        
        setReallyFilters(initialFilters);        
    };    


    return (
        <>

            <PageHeader 
                title={`${t('seller.list.title')} (${elements.length})`}
                subTitle={subList}
            >
                {!subList && (
                    <button 
                        className={`btn btn-outline-primary me-3`}
                        onClick={() => navigate(`/sellerForm/0`)}
                        title={t('seller.action.add')}
                    >
                        <AppIcons.Add />
                    </button>
                )}
                <div className='btn-group' role='group'>
                    <button 
                        className={`btn btn-outline-secondary ${view === VIEW_TABLE ? 'active' : ''}`}
                        onClick={() => changeView(VIEW_TABLE)}
                        title={t('view.action.change.table')}
                    >
                        <AppIcons.View.Table />
                    </button>                    
                    <button 
                        className={`btn btn-outline-secondary ${view === VIEW_LIST ? 'active' : ''}`}
                        onClick={() => changeView(VIEW_LIST)}
                        title={t('view.action.change.list')}
                    >
                        <AppIcons.View.List />
                    </button>                    
                </div>
            </PageHeader>            


            <div className='row'>
                <div className='col-md-10'>
                    <div className='row' style={{marginBottom: '15px'}}>
                        <div className='col-md-9'>
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
                                            {t('seller.label')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {elementsFiltered.map((item) => (
                                        <tr 
                                            key={item.id} 
                                            onClick={() => navigate(`/seller/${item.id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td>{item.name}</td>
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
                                    onClick={() => navigate(`/seller/${item.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className='table-responsive'>
                                        <table className="table table-bordered table-hover" style={{margin: '0px'}}>
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
                    <div className='content-right'>
                        <small>
                            <b>
                                <AppIcons.Search/> {t('seller.search.title')}
                            </b>
                        </small>
                        <form onSubmit={handleSearch}>
                            <div className="row mt-2">
                                <label className="col-form-label">
                                    <small>{t('seller.search.content')}</small>
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
            </div>
        </>
    );

};


export default SellerList;