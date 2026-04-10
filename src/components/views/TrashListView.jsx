import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import PageHeader from '../elements/PageHeaderElement';

const TrashListView = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();
    
    const [elements, setElements] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadAll() {

        try {

            const data = await window.electronAPI.getAllTrashesCount();
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
    }, []);

    if (error) return <div>{error}</div>;
    if (loading) return <div>Caricamento in corso...</div>;

    return (
        <>

            <PageHeader 
                title={`${t('trash.list.title')}`}
            >
            </PageHeader>            

            <div className="container-fluid mt-4">

                <div className="row g-4">

                    {elements.map((item) => (
          
                        <div 
                            className="col-12 col-md-6 col-lg-3"
                            key={item.id}
                        >
                            <div 
                                className="card h-100 shadow-sm"
                                key={item.element} 
                                onClick={() => navigate(`/trash/${item.element}`)}
                            >
                                <div className="card-body">
                                    <h5 className="card-title">{t(`${item.element}.list.title`)}</h5>
                                    <p className="card-text">&nbsp;</p>
                                    <span className={`badge rounded-pill text-bg-${item.count <= 0 ? 'light' : 'danger'}`}>{item.count}</span>
                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>
            
        </>
    );

};


export default TrashListView;