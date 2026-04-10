import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from 'react';
import { useParams } from "react-router-dom";
import DetailsElement from '../elements/DetailsElement';
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';
import ImageList from '../lists/ImageList';
import ShortDescriptionElement from '../elements/ShortDescriptionElement';
import DescriptionElement from '../elements/DescriptionElement';
import AnnotationsElement from '../elements/AnnotationsElement';
import ContainerList from '../lists/ContainerList';
import { fullAddress } from '../../utils/sellerUtils';

const SellerView = () => {

    const elementName = 'seller';

    const { t } = useTranslation();

    const navigate = useNavigate();
    const location = useLocation();


    const { id } = useParams();
    const [element, setElement] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const details = useMemo(() => {

        if (!element) return [];

        return [
            { label: t('seller.website'), value: element.website, type: 'website' },
            { label: t('seller.email'), value: element.email, type: 'email' },
            { label: t('seller.phoneNumber'), value: element.phone_number },
            { label: t('seller.fullAddress'), value: fullAddress(element) },
        ];
    }, [element]);

    async function loadAll() {

        try {

            const data = await window.electronAPI.getSeller(id);
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

        if(!window.confirm("Confermi l'eliminazione?")) {
            return;
        }

        const result = await window.electronAPI.deleteSeller(id);
        if(result.success) {
            navigate(`/sellers`, {
                state: {message: "Elemento eliminato con successo."} 
            });
        } else {
            setError(result.error);
        }

    }

    return (
        <>
            <PageHeader 
                title={t('seller.label')}
                name={element.name}
            >
                {element.deleted ? (

                    <>
                        <button 
                            className={`btn btn-outline-primary me-3`}
                            onClick={() => navigate(`/trash/${elementName}`)}
                            title={t('trash.label')}
                        >
                            <AppIcons.Back />
                        </button>
                    </>

                ) : (

                    <>
                        <button 
                            className={`btn btn-outline-primary me-3`}
                            onClick={() => navigate(`/sellers`)}
                            title={t('seller.action.back.sellers')}
                        >
                            <AppIcons.Back />
                        </button>
                        <button 
                            className={`btn btn-outline-primary me-1`}
                            onClick={() => navigate(`/sellerForm/${element.id}`)}
                            title={t('seller.action.edit')}
                        >
                            <AppIcons.Edit />
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

                    <DetailsElement data={details} />

                    <div className='content-sublist'>
                        <ContainerList
                            sellerId={id}
                            subList={true}
                        />
                    </div>
                    
                    <DescriptionElement
                        element={element}
                    />

                </div>
                <div className='col-md-2'>

                    <div className='content-right'>

                        <AnnotationsElement
                            elementName='seller'
                            elementId={element.id}
                            noAdd={true}
                        />

                        <hr/>

                        <ShortDescriptionElement
                            element={element}
                        />

                        <hr/>

                        <ImageList 
                            elementName='seller'
                            elementId={id}
                            small={true}
                            noAdd={true}
                        />

                    </div>

                </div>

            </div>
                
        </>
    );

};


export default SellerView;