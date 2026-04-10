import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from 'react';
import { useParams } from "react-router-dom";
import DetailsElement from '../elements/DetailsElement';
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';
import ImageList from '../lists/ImageList';
import { formatDate} from '../../utils/utils'

const AnnotationsElement = ({elementName, elementId, noAdd}) => {

    const { t } = useTranslation();

    const [showModal, setShowModal] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [elements, setElements] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [element, setElement] = useState(null);

    const handleAdd = async () => {

        setShowDelete(false);
        setElement(null);
        setShowModal(true);

    };

    const handleSave = async () => {

        const id = document.getElementById('id').value;
        const importance = document.getElementById('importance').value;
        const content = document.getElementById('content').value;

        const res = await window.electronAPI.saveAnnotation({ 
            elementName: elementName, 
            elementId: elementId, 
            id: id,
            importance: importance,
            content: content,
        });

        if (res.success) {
            setShowModal(false);
            loadAll();
        }
    };

    const handleDelete = async () => {

        const confirm = window.confirm("Sei sicuro di voler eliminare questa annotazione?");
        if (!confirm) return;

        setShowModal(false);

        const result = await window.electronAPI.deleteAnnotation(element.id);
        if(result.success) {
            loadAll();
        } else {
            alert("Errore durante l'eliminazione: " + result.error);
        }

    };

    const handleEdit = async (item) => {

        setShowDelete(true);
        setElement(item);
        setShowModal(true);

    };

    async function loadAll() {

        try {

            const params = {elementName: elementName, elementId: elementId};
            const data = await window.electronAPI.getAllAnnotations(params);
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

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setShowModal(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);

    }, []);

    if (error) return <div>{error}</div>;
    if (loading) return <div>Caricamento in corso...</div>;

    return (
        <>

            <div className="d-flex justify-content-between align-items-center mb-3">
            
                <small>
                    <b>
                        {t('annotation.list.title')}
                    </b>
                </small>

                <div className="d-flex gap-2">
                    {!noAdd && (
                        <button 
                            className={`btn btn-xs btn-outline-primary`}
                            onClick={() => handleAdd()}
                            title={t('annotation.action.add')}
                        >
                            <AppIcons.Add />
                        </button>
                    )}
                </div>

            </div>

            {elements.map((item) => (
                <div 
                    className={`note note-${item.importance}`}
                    key={item.id} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleEdit(item)}
                >
                    <div>
                        <small>
                            <b>{formatDate(item.date, 'dd/MM/yyyy HH:mm')}</b>
                        </small>
                    </div>
                    <div style={{whiteSpace: 'pre-wrap'}}>
                        {item.content}
                    </div>
                </div>
            ))}

            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow-lg">
                            <div className="modal-header">
                                <h5 className="modal-title">{t('annotation.label')}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type='hidden'
                                    id="id"
                                    defaultValue={element ? element.id : 0}
                                />
                                <div className="row">
                                    <div className="col">
                                        <textarea
                                            id="content" 
                                            className="form-control" 
                                            rows="5" 
                                            defaultValue={element?.content}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col">
                                        <select 
                                            className="form-select form-select-sm"
                                            id="importance"
                                            defaultValue={element?.importance}
                                        >
                                            <option value="0">{t('annotation.importance.low')}</option>
                                            <option value="1">{t('annotation.importance.high')}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {showDelete && (
                                    <button className="btn btn-danger me-auto" onClick={handleDelete}>{t('action.delete')}</button>
                                )}
                                <button className="btn btn-primary" onClick={handleSave}>{t('action.save')}</button>
                                <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>{t('action.cancel')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}    

        </>
    );

};


export default AnnotationsElement;