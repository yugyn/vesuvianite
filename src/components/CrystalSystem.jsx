import { useTranslation } from 'react-i18next';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import MineralList from './lists/MineralList';
import { ELEMENT_CRYSTALSYSTEM } from '../costants';
import DetailsElement from './elements/DetailsElement';

const CrystalSystem = () => {

    const { t } = useTranslation();

    const { id } = useParams();
    const [element, setElement] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const details = useMemo(() => {

        if (!element) return [];

        return [
            { label: t('area.label'), value: 'Coming soon...' },
        ];
    }, [element]);

    async function loadElement() {

        try {

            const data = await window.electronAPI.getCrystalSystem(id);
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
            loadElement();
        }
    }, [id]);
    
    if (error) return <div>{error}</div>;
    if (loading) return <div>Caricamento in corso...</div>;

    return (
        <>
            <div style={{ padding: '20px' }}>
                <h1>{element.name}</h1>
                <Link to="/crystalSystems" className="btn">Torna a Crystal Systems</Link>

                <DetailsElement data={details} />

                <div className='content-sublist'>
                    <MineralList 
                        elementName={ELEMENT_CRYSTALSYSTEM} 
                        elementId={element.id}
                        subList={true}
                    />
                </div>

            </div>
        </>
    );

};


export default CrystalSystem;