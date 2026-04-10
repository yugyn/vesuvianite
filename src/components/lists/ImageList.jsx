import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';
import ImageElement from '../elements/ImageElement';
import NoImageFallback from '../../images/1.jpg';
import ImageGridElement from '../elements/ImageGridElement';
import ImageViewerElement from '../elements/ImageViewerElement';

const ImageList = ({ elementName, elementId, small, noAdd }) => {

    const { t } = useTranslation();

    const [isDragging, setIsDragging] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
  
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

        setCurrentIndex(-1);
        loadAll();

    };

    const handleDelete = async () => {

        const confirm = window.confirm("Sei sicuro di voler eliminare questa immagine?");
        if (!confirm) return;

        const result = await window.electronAPI.deleteImage({ id: currentImg.id, pathFile: currentImg.filename, deleted: currentImg.deleted });
        if(result.success) {
            setElements(prev => prev.filter(item => item.id !== currentImg.id));
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

            setCurrentIndex(-1);
            loadAll();
        }

    };

    const [selectedIndex, setSelectedIndex] = useState(-1);

    const currentImg = selectedIndex !== -1 ? elements[selectedIndex] : null;

    const closeViewer = () => {
        setSelectedIndex(-1);
        currentImg = null;
    };    

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

    }, []);

    if (error) return <div>{error}</div>;
    if (loading) return <div>Caricamento in corso...</div>;

    return (
        <>

            {small ? (

                <div className="d-flex justify-content-between align-items-center mb-3">
                
                    <small>
                        <b>
                        {`${t('image.list.title.short')} (${elements.length})`}
                        </b>
                    </small>

                    <div className="d-flex gap-2">
                        {!noAdd && (
                            <button 
                                className="btn btn-outline-primary btn-xs" 
                                onClick={handleUpload}
                                title={t('image.action.add')}
                            >
                                <AppIcons.Add />
                            </button>
                        )}
                    </div>

                </div>
                
            ) : (

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

            )}
            
            <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`container-fluid p-0 ${isDragging ? 'bg-primary bg-opacity-10' : ''}`}
                style={{ transition: 'background 0.3s' }}
            >

                <ImageGridElement 
                    images={elements} 
                    elementName={elementName} 
                    elementId={elementId} 
                    onImageClick={(index) => setSelectedIndex(index)}
                    small={small} 
                />

                {currentImg && (
                    <ImageViewerElement 
                        elementName={elementName} 
                        elementId={elementId} 
                        currentImg={currentImg}
                        currentIndex={selectedIndex}
                        total={elements.length}
                        onClose={() => setSelectedIndex(-1)}
                        onNext={() => setSelectedIndex((i) => (i + 1) % elements.length)}
                        onPrev={() => setSelectedIndex((i) => (i - 1 + elements.length) % elements.length)}
                        onDelete={handleDelete}
                    />
                )}

            </div>

        </>
    );

};

export default ImageList;