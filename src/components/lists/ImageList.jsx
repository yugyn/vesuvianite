import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';
import ImageElement from '../elements/ImageElement';
import NoImageFallback from '../../images/1.jpg';

const ImageList = ({ elementName, elementId }) => {

    const { t } = useTranslation();

    const [isDragging, setIsDragging] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
  
    const [elements, setElements] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };    

    const [zoomLevel, setZoomLevel] = useState(1);
    const MAX_ZOOM = 4;
    const MIN_ZOOM = 0.5;
    const STEP_ZOOM = 0.05;

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + STEP_ZOOM, MAX_ZOOM));
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - STEP_ZOOM, MIN_ZOOM));
    };    

    const resetZoom = () => {
        setZoomLevel(1);
    };

    const openExternal = async () => {
        const absolutePath = await window.electronAPI.getPathImage(`${elementName}/${currentImg.filename}`);
        window.electronAPI.openFile(absolutePath);
    };    

    const getFinalUrl = (path) => {
        if (!path) return NoImageFallback;
        const cleanPath = path.replace(/\\/g, '/');
        return `${cleanPath}`;
    };

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

    const goNext = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % elements.length);
    };

    const goPrev = (e) => {
        e?.stopPropagation();
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
                                    className="ratio ratio-4x3 pointer"
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <ImageElement 
                                        filePath={`${elementName}/${item.filename}`} 
                                        className="card-img-top rounded"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        </div>

                    ))}

                </div>

                {currentImg && (
        
                    <div 
                        className="modal fade show d-block" 
                        style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }} 
                        tabIndex="-1"
                    >
                        
                        <div className={`modal-dialog modal-dialog-centered ${isFullscreen ? 'modal-fullscreen' : 'modal-xl'}`}>

                            <div 
                                className="modal-content bg-dark text-white border-0"
                            >
                                
                                <div 
                                    className="modal-header border-0 d-flex align-items-center justify-content-between"
                                    onDoubleClick={toggleFullscreen}
                                >
    
                                    <div className="d-flex align-items-center gap-2">
                                        <h5 className="modal-title">
                                            {t('image.viewer.title')}
                                        </h5>
                                    </div>

                                    <div className="d-flex align-items-center gap-1">
            
                                        <button 
                                            className="btn btn-outline-light btn-sm" 
                                            onClick={toggleFullscreen}
                                            title={isFullscreen ? t('image.action.resizeScreen') : t('image.action.fullScreen')}
                                        >
                                            {isFullscreen ? (
                                                <AppIcons.Screen.Resize />
                                            ) : (
                                                <AppIcons.Screen.Full />
                                            )}
                                        </button>

                                        <button 
                                            type="button" 
                                            className="btn-close btn-close-white" 
                                            onClick={() => { setCurrentIndex(-1); }}
                                        ></button>
                                    </div>
                                </div>

                                <div className="modal-body p-0 zoom-container d-flex align-items-center justify-content-center" style={{ overflow: 'auto', height: '70vh' }}>
    
                                    <div style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        overflow: 'visible' // Permette all'immagine di uscire quando si zooma
                                    }}>
                                        <ImageElement 
                                            filePath={`${elementName}/${currentImg.filename}`} 
                                            style={{ 
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain',
                                                transform: `scale(${zoomLevel})`,
                                                transformOrigin: 'center center',
                                                transition: 'transform 0.05s linear'
                                            }}
                                            className="img-zoomable"
                                            onDoubleClick={openExternal}
                                        />
                                    </div>
                                </div>
                                <div 
                                    className="modal-footer border-0 bg-dark text-white d-flex justify-content-between align-items-center py-3 px-4"
                                    style={{backgroundColor: '#000'}}
                                >
    
                                    <div style={{ flex: 1 }} className="d-flex justify-content-start">

                                        <button 
                                            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2" 
                                            onClick={handleDelete}
                                            title={t('image.action.delete')}
                                        >
                                            <AppIcons.Delete />
                                        </button>

                                        <button 
                                            className="btn btn-outline-light btn-sm ms-5" 
                                            onClick={openExternal}
                                            title={t('image.action.openExternal')}
                                        >
                                            <AppIcons.Open.External />
                                        </button>
                                                

                                    </div>

                                    <div style={{ flex: 2 }} className="d-flex align-items-center justify-content-center">
                                        <div className="d-flex align-items-center gap-3 px-3 py-2 bg-white bg-opacity-10 rounded-pill">

                                            <button 
                                                className="btn btn-outline-light btn-sm" 
                                                onClick={handleZoomOut}
                                                disabled={zoomLevel <= MIN_ZOOM}
                                                title={t('image.zoom.out')}
                                            >
                                                <AppIcons.Zoom.Out />
                                            </button>

                                            <input 
                                                type="range" 
                                                className="form-range custom-zoom-slider" 
                                                min={MIN_ZOOM} 
                                                max={MAX_ZOOM}
                                                step={STEP_ZOOM}
                                                value={zoomLevel} 
                                                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                                                style={{ width: '120px' }}
                                            />

                                            <button 
                                                className="btn btn-outline-light btn-sm" 
                                                onClick={handleZoomIn}
                                                disabled={zoomLevel >= MAX_ZOOM}
                                                title={t('image.zoom.in')}
                                            >
                                                <AppIcons.Zoom.In/>
                                            </button>
                                            <button 
                                                className="btn btn-outline-light btn-sm" 
                                                onClick={resetZoom}
                                                title={t('image.zoom.reset')}
                                            >
                                                <AppIcons.Zoom.Reset/>
                                            </button>
                                            
                                            <span className="text-white" style={{ minWidth: '45px', fontSize: '0.75rem' }}>
                                                {Math.round(zoomLevel * 100)}%
                                            </span>

                                        </div>
                                    </div>

                                    <div style={{ flex: 1 }} className="d-flex justify-content-end align-items-center gap-3">

                                        <span className="badge rounded-pill bg-secondary px-3 py-2">
                                            {currentIndex + 1} / {elements.length}
                                        </span>

                                        <div className="btn-group border border-secondary rounded">
                                            <button 
                                                className="btn btn-outline-light btn-sm px-3" 
                                                onClick={goPrev}
                                                title={t('image.action.prev')}
                                            >
                                                <AppIcons.Prev />
                                            </button>
                                            <button 
                                                className="btn btn-outline-light btn-sm px-3" 
                                                onClick={goNext}
                                                title={t('image.action.next')}
                                            >
                                                <AppIcons.Next />
                                            </button>
                                        </div>

                                    </div>

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