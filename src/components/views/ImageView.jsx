import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from 'react';
import { useParams } from "react-router-dom";
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';

const ImageView = () => {

    const elementName = 'image';

    const { t } = useTranslation();

    const navigate = useNavigate();


    const { id } = useParams();
    const [element, setElement] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const details = useMemo(() => {

        if (!element) return [];

        return [
        ];
    }, [element]);

    async function loadAll() {

        setLoading(true);
        setError(null);

            try {

            const data = await window.electronAPI.getImage(id);
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
        }
    }, [id]);
    
    if (error) return <div>{error}</div>;
    if (loading) return <div>Caricamento in corso...</div>;


    const handleDelete = async () => {
    
        setError(null);

        if(!window.confirm(t('confirm.delete'))) {
            return;
        }

        const result = await window.electronAPI.deleteSeller({id: id});
        if(result.success) {
            window.dispatchEvent(new CustomEvent('app-notify', { 
                detail: { message: t('image.message.deleted'), type: 'success' } 
            }));
            navigate(`/images`, {
            });
        } else {
            window.dispatchEvent(new CustomEvent('app-notify', { 
                detail: { message: `${t('global.message.error')}: ${result.error}`, type: 'danger' } 
            }));            
            setError(result.error);
        }

    }

    const handleRestore = async () => {
    
        setError(null);

        if(!window.confirm(t('confirm.restore'))) {
            return;
        }

        const result = await window.electronAPI.restoreSeller(id);
        if(result.success) {
            window.dispatchEvent(new CustomEvent('app-notify', { 
                detail: { message: t('image.message.restored'), type: 'success' } 
            }));
            await loadAll();
        } else {
            window.dispatchEvent(new CustomEvent('app-notify', { 
                detail: { message: `${t('global.message.error')}: ${result.error}`, type: 'danger' } 
            }));            
            setError(result.error);
        }

    }

    return (
        <>
            <PageHeader 
                title={t('image.label')}
                name={element.name}
                deleted={element.deleted}
            >
                {element.deleted && (

                    <>
                        <button 
                            className={`btn btn-outline-primary me-3`}
                            onClick={() => navigate(`/trash/${elementName}`)}
                            title={t('trash.label')}
                        >
                            <AppIcons.Back />
                        </button>
                        <button 
                            className={`btn btn-outline-primary me-1`}
                            onClick={handleRestore}
                            title={t('seller.action.restore')}
                        >
                            <AppIcons.Restore />
                        </button>
                    </>

                )}
                <button 
                    className={`btn btn-outline-danger me-1`}
                    onClick={handleDelete}
                    title={t('seller.action.delete')}
                >
                    <AppIcons.Delete />
                </button>
            </PageHeader>            

            <hr/>

            <div className='row'>
                <div className='col-md-10'>

                </div>
                <div className='col-md-2'>

                    <div className='content-right'>

                    </div>

                </div>

            </div>
                
        </>
    );

};


export default ImageView;