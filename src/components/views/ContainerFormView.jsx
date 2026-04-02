import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';

const ContainerFormView = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();
    const { id } = useParams();
    const [element, setElement] = useState({
        name: '', 
        dimensions: '', 
        seller_id: '', 
    });
    const [sellers, setSellers] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadAll() {

        try {

            if(id && id !== '0') {
                const data = await window.electronAPI.getContainer(id);
                if(data) {
                    setElement(data);
                } else {
                    setError("Not found.");
                }
            }

//            const dataS = await window.electronAPI.getAllCrystalSystems();
            const dataS = [];
            if(dataS) {
                setSellers(dataS);
            }

        } catch(err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        
    }

    useEffect( () => {
        loadAll();
    }, []);

    if (error) return <div>{error}</div>;
    if (loading) return <div>Caricamento in corso...</div>;

    const handleSubmit = async (e) => {
    
        e.preventDefault();
        setError(null);

        const name = document.getElementById('name').value.trim();
        const dimensions = document.getElementById('dimensions').value;
        const seller = document.getElementById('seller').value;

        const params = {
            id: (id ? id : 0),
            name: name,
            dimensions: dimensions,
            seller: (seller == '' ? null : seller),
        }

        const result = await window.electronAPI.saveContainer(params);
        if(result.success) {
            navigate(`/container/${result.id}`, {
                state: {message: "Elemento salvato con successo."} 
            });
        } else {
            setError(result.error);
        }

    }

    return (
        <>
            {id == 0 ? (
                <>
                    <PageHeader 
                        title={t('container.page.create')}
                    >
                        <button 
                            className={`btn btn-outline-primary`}
                            onClick={() => navigate(`/containers`)}
                            title={t('container.action.back.containers')}
                        >
                            <AppIcons.Back />
                        </button>
                    </PageHeader>
                </>
            ) : (
                <>
                    <PageHeader 
                        title={t('container.page.edit')}
                    >
                        <button 
                            className={`btn btn-outline-primary`}
                            onClick={() => navigate(`/container/${element.id}`)}
                            title={t('container.action.back.container')}
                        >
                            <AppIcons.Back />
                        </button>
                    </PageHeader>
                </>
            )}

            <hr/>

            <form onSubmit={handleSubmit}>

                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('container.name')}
                    </label>
                    <div className="col-sm-4">
                        <input 
                            className="form-control"
                            id="name" 
                            defaultValue={element.name}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('container.dimensions')}
                    </label>
                    <div className="col-sm-4">
                        <input 
                            className="form-control"
                            id="dimensions" 
                            defaultValue={element.dimensions}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('seller.label')}
                    </label>
                    <div className="col-sm-4">
                        <select 
                            className="form-select"
                            id="seller"
                            defaultValue={element.seller_id}
                        >
                            <option value=''>- nessuno -</option>
                            {sellers.map((item) => (
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
                >
                    {t('container.action.save')}
                </button>

            </form>

        </>
    );

};


export default ContainerFormView;