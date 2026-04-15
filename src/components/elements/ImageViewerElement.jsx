import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { AppIcons } from '../../utils/iconUtils';
import ImageElement from '../elements/ImageElement';

const ImageViewerElement = ({ 
    elementName, 
    elementId, 
    currentImg, 
    onClose, 
    onNext, 
    onPrev, 
    onDelete, 
    total, 
    currentIndex    
}) => {

    const { t } = useTranslation();

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
        const absolutePath = await window.electronAPI.getPathImage(`${elementName}/${elementId}/${currentImg.filename}`);
        window.electronAPI.openFile(absolutePath);
    };    

    const handleDownload = async () => {

        const absolutePath = await window.electronAPI.getPathImage(`${elementName}/${elementId}/${currentImg.filename}`);
        const result = await window.electronAPI.downloadFile({
            sourcePath: absolutePath,
            fileName: currentImg.filename
        });

    };

    useEffect( () => {

        const handleKeyDown = (e) => {

            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'Escape') onClose();

            if (e.key === '+' || e.key === 'Add') {
                e.preventDefault();
                handleZoomIn();
            }

            if (e.key === '-' || e.key === 'Subtract') {
                e.preventDefault();
                handleZoomOut();
            }            

        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);


    }, []);

    return (
        <>

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
                                    onClick={onClose }
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
                                overflow: 'visible'
                            }}>
                                <ImageElement 
                                    filePath={`${elementName}/${elementId}/${currentImg.filename}`} 
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
                                    onClick={onDelete}
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

                                <button 
                                    className="btn btn-outline-light btn-sm ms-1" 
                                    onClick={handleDownload}
                                    title={t('image.action.download')}
                                >
                                    <AppIcons.Download />
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
                                    {currentIndex + 1} / {total}
                                </span>

                                <div className="btn-group border border-secondary rounded">
                                    <button 
                                        className="btn btn-outline-light btn-sm px-3" 
                                        onClick={onPrev}
                                        title={t('image.action.prev')}
                                    >
                                        <AppIcons.Prev />
                                    </button>
                                    <button 
                                        className="btn btn-outline-light btn-sm px-3" 
                                        onClick={onNext}
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
                
        </>
    );

};


export default ImageViewerElement;