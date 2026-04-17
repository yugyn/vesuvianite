import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';
import MediaElement from '../elements/MediaElement';
import NoMediaFallback from '../../images/1.jpg';
import MediaGridElement from '../elements/MediaGridElement';
import MediaViewerElement from '../elements/MediaViewerElement';

const MediaList = ({ elementName, elementId, small, deleted }) => {

    const { t } = useTranslation();

    const [isDragging, setIsDragging] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
  
    const [elements, setElements] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleUpload = async () => {

        const paths = await window.electronAPI.uploadMedias();
        if (!paths || paths.length === 0) return;

        const nuoviRecord = await window.electronAPI.saveMedias({
            elementName: elementName,
            elementId: elementId,
            pathsSorgente: paths
        });

        setCurrentIndex(-1);
        loadAll();

    };

    const handleDelete = async () => {

        let message = t('media.confirm.delete');
        if(currentMedia.type === 'image') {
            message = t('media.confirm.delete.image');
        } else if(currentMedia.type === 'video') {
            message = t('media.confirm.delete.video');
        }
        const confirm = window.confirm(message);
        if (!confirm) return;

        const result = await window.electronAPI.deleteMedia({id: currentMedia.id});
        if(result.success) {
            setElements(prev => prev.filter(item => item.id !== currentMedia.id));
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
            .filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'))
            .map(file => window.electronAPI.getFilePath(file));

        if (validPaths.length > 0) {
            const nuoviRecord = await window.electronAPI.saveMedias({
                elementName: elementName,
                elementId: elementId,
                pathsSorgente: validPaths
            });

            setCurrentIndex(-1);
            loadAll();
        }

    };

    const [selectedIndex, setSelectedIndex] = useState(-1);

    const currentMedia = selectedIndex !== -1 ? elements[selectedIndex] : null;

    const closeViewer = () => {
        setSelectedIndex(-1);
        currentMedia = null;
    };    

    async function loadAll() {

        try {

            const params = {elementName: elementName, elementId: elementId }
            const data = await window.electronAPI.getAllMedias(params);
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
                        {`${t('media.list.title.short')} (${elements.length})`}
                        </b>
                    </small>

                    <div className="d-flex gap-2">
                        {!deleted && (
                            <button 
                                className="btn btn-outline-primary btn-xs" 
                                onClick={handleUpload}
                                title={t('media.action.add')}
                            >
                                <AppIcons.Add />
                            </button>
                        )}
                    </div>

                </div>
                
            ) : (

                <PageHeader 
                    title={`${t('media.list.title')} (${elements.length})`}
                    subTitle={true}
                >
                    <button 
                        className="btn btn-outline-primary btn-sm mb-3" 
                        onClick={handleUpload}
                        title={t('media.action.add')}
                    >
                        <AppIcons.Add />
                    </button>
                </PageHeader>            

            )}
            
            <div 
                onDragOver={!deleted ? handleDragOver : undefined}
                onDragLeave={!deleted ? handleDragLeave : undefined}
                onDrop={!deleted ? handleDrop : undefined}
                className={`container-fluid p-0 ${isDragging ? 'bg-primary bg-opacity-10' : ''}`}
                style={{ transition: 'background 0.3s' }}
            >

                <MediaGridElement 
                    medias={elements} 
                    elementName={elementName} 
                    elementId={elementId} 
                    onMediaClick={(index) => {
                        if (!deleted) {
                            setSelectedIndex(index);
                        }
                    }}                    
                    small={small}
                    deleted={deleted} 
                />

                {currentMedia && (
                    <MediaViewerElement 
                        elementName={elementName} 
                        elementId={elementId} 
                        currentMedia={currentMedia}
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

export default MediaList;