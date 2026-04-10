import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from 'react';
import { useParams } from "react-router-dom";
import DetailsElement from '../elements/DetailsElement';
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';

const TrashView = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();
    const location = useLocation();


    const { element } = useParams();
    const [elements, setElements] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadAll() {

        try {

            const data = await window.electronAPI.getAllTrashes(element);
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
        if(element) {
            loadAll();
        }
    }, [element]);
    
    if (error) return <div>{error}</div>;
    if (loading) return <div>Caricamento in corso...</div>;


    return (
        <>
            <PageHeader 
                title={t('trash.label')}
                name={element.name}
            >
            </PageHeader>            

            <hr/>

            <div className='row'>
                <div className='col-md-10'>

                    <div className='table-responsive'>
                        <table className="table table-bordered table-hover datatable-table" style={{ tableLayout: 'fixed' }}>
                            <thead className="table-light">
                                <tr>
                                    <th scope='col'>
                                        {t(`${element}.label`)}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {elements.map((item) => (
                                    <tr 
                                        key={item.id} 
                                        onClick={() => navigate(`/${element}/${item.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>{item.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>        
                    </div>

                </div>
                <div className='col-md-2'>

                    <div className='content-right'>

                    coming soon...

                    </div>

                </div>

            </div>
                
        </>
    );

};


export default TrashView;