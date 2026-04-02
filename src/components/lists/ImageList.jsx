import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';
import ImageElement from '../elements/ImageElement';

const ImageList = ({ elementName, elementId }) => {

    const { t } = useTranslation();

    const navigate = useNavigate();
    
    const [isDragging, setIsDragging] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isZoomed, setIsZoomed] = useState(false);

    const [elements, setElements] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleUpload = async () => {

        const paths = await window.electronAPI.uploadImages();
        if (!paths || paths.length === 0) return;

        const nuoviRecord = await window.electronAPI.saveImages({
            elementName: elementName,
            elementId: elementId,
            pathsSorgente: paths
        });

        loadAll();

    };

    const handleDelete = async (id, pathFile, deleted) => {

        const confirm = window.confirm("Sei sicuro di voler eliminare questa immagine?");
        if (!confirm) return;

        const result = await window.electronAPI.deleteImage({ id, pathFile, deleted });
        if(result.success) {
            setElements(prev => prev.filter(item => item.id !== id));
        } else {
            alert("Errore durante l'eliminazione: " + result.error);
        }

    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e) => {

        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        
        const validPaths = files
            .filter(file => file.type.startsWith('image/'))
            .map(file => window.electronAPI.getFilePath(file));

        if (validPaths.length > 0) {
            const nuoviRecord = await window.electronAPI.saveImages({
                elementName: elementName,
                elementId: elementId,
                pathsSorgente: validPaths
            });

            loadAll();
        }

    };

    const goNext = (e) => {
        e?.stopPropagation();
        setIsZoomed(false);
        setCurrentIndex((prev) => (prev + 1) % elements.length);
    };

    const goPrev = (e) => {
        e?.stopPropagation();
        setIsZoomed(false);
        setCurrentIndex((prev) => (prev - 1 + elements.length) % elements.length);
    };    

    const currentImg = currentIndex !== -1 ? elements[currentIndex] : null;

    async function loadAll() {

        try {

            const params = {elementName: elementName, elementId: elementId }
            const data = await window.electronAPI.getAllImages(params);
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
        setIsZoomed(false);

        const handleKeyDown = (e) => {
            if (currentIndex === -1) return;
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'Escape') setCurrentIndex(-1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);


    }, [currentIndex]);

    if (error) return <div>{error}</div>;
    if (loading) return <div>Caricamento in corso...</div>;

    return (
        <>

            <PageHeader 
                title={`${t('image.list.title')} (${elements.length})`}
                subTitle={true}
            >
                <button 
                    className="btn btn-outline-primary btn-sm mb-3" 
                    onClick={handleUpload}
                    title={t('image.action.add')}
                >
                    <AppIcons.Add />
                </button>
            </PageHeader>            

            <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`container-fluid p-0 ${isDragging ? 'bg-primary bg-opacity-10' : ''}`}
                style={{ transition: 'background 0.3s' }}
            >

                <div className="row g-3">

                    {elements.map((item, index) => (
          
                        <div key={item.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                            <div className="card h-100 shadow-sm">
                                <div 
                                    key={item.id}
                                    className="ratio ratio-1x1 pointer"
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <ImageElement 
                                        filePath={`${elementName}/${item.filename}`} 
                                        className="card-img-top rounded"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>

                                <div className="card-body p-2 d-flex justify-content-between align-items-center">
                                    <button 
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleDelete(item.id, item.filename, item.deleted)}
                                    >
                                        <AppIcons.Delete
                                            className="bi bi-x-lg"
                                            title={t('image.action.delete')}
                                        />
                                    </button>                                
                                </div>
                            </div>
                        </div>

                    ))}

                </div>

                {currentImg && (
        
                    <div 
                        className="modal fade show d-block" 
                        style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} 
                        tabIndex="-1"
                    >

                        <div className="modal-dialog modal-dialog-centered modal-xl">
                            <div className="modal-content">

                                <div className="modal-header border-0">
                                    <h5 className="modal-title">Visualizzatore Immagine</h5>
                                    <button type="button" className="btn-close" onClick={() => setCurrentIndex(-1)}></button>
                                </div>
              
                                <div className="modal-body p-0 zoom-container">
                                    <ImageElement 
                                        filePath={`${elementName}/${currentImg.filename}`} 
                                        className={`img-zoomable ${isZoomed ? 'zoomed' : ''}`}
                                        onClick={() => setIsZoomed(!isZoomed)}
                                    />
                                </div>

                                <div className="modal-footer border-0 justify-content-center">
                                    {currentIndex + 1} / {elements.length}
          {/* Freccia Sinistra */}
          <button 
            className="btn btn-link text-white position-absolute start-0 top-50 translate-middle-y m-3"
            style={{ zIndex: 1100, fontSize: '2rem' }}
            onClick={goPrev}
          >
            SX <i className="bi bi-chevron-left"></i>
          </button>                        
{/* Freccia Destra */}
          <button 
            className="btn btn-link text-white position-absolute end-0 top-50 translate-middle-y m-3"
            style={{ zIndex: 1100, fontSize: '2rem' }}
            onClick={goNext}
          >
            DX<i className="bi bi-chevron-right"></i>
          </button>                        

                                </div>

                            </div>

                        </div>

                    </div>
                )}                

            </div>

        </>
    );

};


export default ImageList;