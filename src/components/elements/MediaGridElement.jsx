import { AppIcons } from '../../utils/iconUtils';
import MediaElement from '../elements/MediaElement';
import { useEffect, useState } from 'react';

const MediaGridElement = ({ 
    elementName, 
    elementId, 
    medias,
    onMediaClick,
    small,
    deleted,
}) => {

    const [localMedias, setLocalMedias] = useState(medias);
    const [draggedIndex, setDraggedIndex] = useState(null);

    useEffect(() => {
        setLocalMedias(medias);
    }, [medias]);

    const onDragOver = (e) => {

        if (e.dataTransfer.types.includes('type')) {
            e.preventDefault(); 
            e.stopPropagation(); 
            e.dataTransfer.dropEffect = "move";
        }

    };

    const onDrop = (e, index) => {

        if (e.dataTransfer.getData("type") === "internal") {
            e.preventDefault();
            e.stopPropagation(); 
            handleReorder(index);
        }

    };

    const handleReorder = (index) => {

        if (draggedIndex === null) return;

        const updated = [...localMedias];
        const item = updated.splice(draggedIndex, 1)[0];
        updated.splice(index, 0, item);

        setLocalMedias(updated);

        window.electronAPI.updateMediaOrder(updated.map(img => img.id));

    };

    return (
        <div className="row g-3">

            {localMedias.map((item, index) => (
    
                <div key={item.id} className={small ? "col-12" : "col-6 col-sm-4 col-md-3 col-lg-2"}>
                    <div className="card h-100 shadow-sm">
                        {deleted ? (

                            <div 
                                key={item.id}
                                className="ratio ratio-4x3"
                            >
                                <MediaElement 
                                    elementName={elementName}
                                    elementId={elementId}
                                    item={item} 
                                    className="card-img-top rounded"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>

                        ) : (
                            
                            <div 
                                key={item.id}
                                className={`ratio ratio-4x3 pointer`}
                                onClick={() => onMediaClick(index)}
                                draggable 
                                onDragStart={(e) => {
                                    e.dataTransfer.setData("type", "internal");
                                    setDraggedIndex(index);
                                }}
                                onDragOver={onDragOver}
                                onDrop={(e) => onDrop(e, index)}                       
                            >
                                <MediaElement 
                                    elementName={elementName}
                                    elementId={elementId}
                                    item={item} 
                                    className="card-img-top rounded"
                                    style={{ objectFit: 'cover' }}
                                />
                                {item.type === 'video' && (
                                    <div className="play-overlay">
                                        <AppIcons.Play />
                                    </div>
                                )}
                            </div>

                        )}
                    </div>
                </div>

            ))}

        </div>

    );
};

export default MediaGridElement;