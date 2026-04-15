import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';

const SellerFormView = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();
    const { id } = useParams();
    const [element, setElement] = useState({
        name: '', 
        shortDescription: '', 
        description: '', 
        website: '', 
        email: '', 
        phoneNumber: '', 
        address: '', 
        city: '', 
        postalCode: '', 
        state: '', 
        country: '', 
        mapLink: '', 
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadAll() {

        try {

            if(id && id !== '0') {
                const data = await window.electronAPI.getSeller(id);
                if(data) {
                    setElement(data);
                } else {
                    setError("Not found.");
                }
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
        const shortDescription = document.getElementById('shortDescription').value;
        const description = document.getElementById('description').value;
        const website = document.getElementById('website').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const postalCode = document.getElementById('postalCode').value;
        const state = document.getElementById('state').value;
        const country = document.getElementById('country').value;
        const mapLink = document.getElementById('mapLink').value;

        const params = {
            id: (id ? id : 0),
            name: name,
            shortDescription: shortDescription, 
            description: description,
            website: website, 
            email: email, 
            phoneNumber: phoneNumber, 
            address: address, 
            city: city, 
            postalCode: postalCode, 
            state: state, 
            country: country, 
            mapLink: mapLink, 
        }

        const result = await window.electronAPI.saveSeller(params);
        if(result.success) {
            window.dispatchEvent(new CustomEvent('app-notify', { 
                detail: { message: t('seller.message.saved'), type: 'success' } 
            }));
            navigate(`/seller/${result.id}`, {
                state: {message: "Elemento salvato con successo."} 
            });
        } else {
            window.dispatchEvent(new CustomEvent('app-notify', { 
                detail: { message: `${t('golabl.message.error.saved')}: ${result.error}`, type: 'danger' } 
            }));            
            setError(result.error);
        }

    }

    return (
        <>
            {id == 0 ? (
                <>
                    <PageHeader 
                        title={t('seller.page.create')}
                    >
                        <button 
                            className={`btn btn-outline-primary`}
                            onClick={() => navigate(`/sellers`)}
                            title={t('seller.action.back.sellers')}
                        >
                            <AppIcons.Back />
                        </button>
                    </PageHeader>
                </>
            ) : (
                <>
                    <PageHeader 
                        title={t('seller.page.edit')}
                    >
                        <button 
                            className={`btn btn-outline-primary`}
                            onClick={() => navigate(`/seller/${element.id}`)}
                            title={t('seller.action.back.seller')}
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
                        {t('seller.name')}
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
                        {t('global.shortDescription')}
                    </label>
                    <div className="col-sm-4">
                        <textarea 
                            className="form-control"
                            id="shortDescription" 
                            defaultValue={element.short_description}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('global.description')}
                    </label>
                    <div className="col-sm-4">
                        <textarea 
                            className="form-control"
                            id="description" 
                            defaultValue={element.description}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('seller.website')}
                    </label>
                    <div className="col-sm-4">
                        <input 
                            className="form-control"
                            id="website" 
                            defaultValue={element.website}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('seller.email')}
                    </label>
                    <div className="col-sm-4">
                        <input 
                            className="form-control"
                            id="email" 
                            defaultValue={element.email}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('seller.phoneNumber')}
                    </label>
                    <div className="col-sm-4">
                        <input 
                            className="form-control"
                            id="phoneNumber" 
                            defaultValue={element.phone_number}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('seller.address')}
                    </label>
                    <div className="col-sm-4">
                        <input 
                            className="form-control"
                            id="address" 
                            defaultValue={element.address}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('seller.city')}
                    </label>
                    <div className="col-sm-4">
                        <input 
                            className="form-control"
                            id="city" 
                            defaultValue={element.city}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('seller.postalCode')}
                    </label>
                    <div className="col-sm-4">
                        <input 
                            className="form-control"
                            id="postalCode" 
                            defaultValue={element.postal_code}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('seller.state')}
                    </label>
                    <div className="col-sm-4">
                        <input 
                            className="form-control"
                            id="state" 
                            defaultValue={element.state}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('seller.country')}
                    </label>
                    <div className="col-sm-4">
                        <input 
                            className="form-control"
                            id="country" 
                            defaultValue={element.country}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('seller.mapLink')}
                    </label>
                    <div className="col-sm-4">
                        <input 
                            className="form-control"
                            id="mapLink" 
                            defaultValue={element.mapLink}
                        />
                    </div>
                </div>                

                <hr/>

                <button 
                    className="btn btn-primary"
                >
                    {t('seller.action.save')}
                </button>

            </form>

        </>
    );

};


export default SellerFormView;