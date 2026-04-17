import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from 'react';
import { useParams } from "react-router-dom";
import DetailsElement from '../elements/DetailsElement';
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';
import MediaList from '../lists/MediaList';
import ShortDescriptionElement from '../elements/ShortDescriptionElement';
import AnnotationsElement from '../elements/AnnotationsElement';

const ContainerView = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();
    const location = useLocation();


    const { id } = useParams();
    const [element, setElement] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState("");

    async function loadNotification() {

        if(location.state && location.state.message) {
            setNotification(location.state.message);
//            const timer = setTimeout(() => setNotification(""), 5000);
//            return () => clearTimeout(timer);
        }

    }

    const details = useMemo(() => {

        if (!element) return [];

        return [
            { label: t('container.name'), value: element.name },
            { label: t('container.dimensions'), value: element.dimensions },
            { label: t('seller.label'), value: (
                <span 
                    className="element-link"
                    onClick={(e) => {
                        navigate(`/seller/${element.sId}`);
                    }}
                >{element.sName}</span>
            )},
        ];

    }, [element]);

    async function loadAll() {

        try {

            const data = await window.electronAPI.getContainer(id);
            if(data) {
                setElement(data);
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
        if(id) {
            loadAll();
            loadNotification();
        }
    }, [id]);
    
    if (error) return <div>{error}</div>;
    if (loading) return <div>Caricamento in corso...</div>;


    const handleDelete = async () => {
    
        setError(null);

        if(!window.confirm("Confermi l'eliminazione?")) {
            return;
        }

        const result = await window.electronAPI.deleteContainer(id);
        if(result.success) {
            navigate(`/containers`, {
                state: {message: "Elemento eliminato con successo."} 
            });
        } else {
            setError(result.error);
        }

    }


    const elemento = {};


    return (
        <>
            {notification && (
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#d4edda', 
                    color: '#155724',
                    borderRadius: '5px',
                    marginBottom: '20px' 
                }}>
                    {notification}
                </div>
            )}

            <PageHeader 
                title={t('container.label')}
            >
                <button 
                    className={`btn btn-outline-primary me-3`}
                    onClick={() => navigate(`/containers`)}
                    title={t('container.action.back.containers')}
                >
                    <AppIcons.Back />
                </button>
                <button 
                    className={`btn btn-outline-primary me-1`}
                    onClick={() => navigate(`/containerForm/${element.id}`)}
                    title={t('container.action.edit')}
                >
                    <AppIcons.Edit />
                </button>
                <button 
                    className={`btn btn-outline-danger me-1`}
                    onClick={handleDelete}
                    title={t('container.action.delete')}
                >
                    <AppIcons.Delete />
                </button>
            </PageHeader>            

            <hr/>

            <div className='row'>
                <div className='col-md-10'>

                    <DetailsElement data={details} />

                    <div className='content-sublist'>
                        <MediaList 
                            elementName='container'
                            elementId={id}
                        />
                    </div>

                </div>
                <div className='col-md-2'>

                    <div className='content-right'>

                        <ShortDescriptionElement
                            element={element}
                        />

                        <hr/>

                        <AnnotationsElement
                            elementName='container'
                            elementId={element.id}
                        />

                    </div>

                </div>
            </div>
                
        </>
    );

};


export default ContainerView;