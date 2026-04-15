import ImageElement from '../elements/ImageElement';
import NoImageFallback from '../../images/1.jpg';
import { useEffect, useState } from 'react';

const ImageGridElement = ({ 
    elementName, 
    elementId, 
    images,
    onImageClick,
    small,
    deleted,
}) => {

    const [localImages, setLocalImages] = useState(images);
    const [draggedIndex, setDraggedIndex] = useState(null);

    useEffect(() => {
        setLocalImages(images);
    }, [images]);

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

        const updated = [...localImages];
        const item = updated.splice(draggedIndex, 1)[0];
        updated.splice(index, 0, item);

        setLocalImages(updated);

        window.electronAPI.updateImageOrder(updated.map(img => img.id));

    };

    return (
        <div className="row g-3">

            {localImages.map((item, index) => (
    
                <div key={item.id} className={small ? "col-12" : "col-6 col-sm-4 col-md-3 col-lg-2"}>
                    <div className="card h-100 shadow-sm">
                        {deleted ? (

                            <div 
                                key={item.id}
                                className="ratio ratio-4x3"
                            >
                                <ImageElement 
                                    filePath={`${elementName}/${elementId}/${item.filename}`} 
                                    className="card-img-top rounded"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>

                        ) : (
                            
                            <div 
                                key={item.id}
                                className="ratio ratio-4x3 pointer"
                                onClick={() => onImageClick(index)}
                                draggable 
                                onDragStart={(e) => {
                                    e.dataTransfer.setData("type", "internal");
                                    setDraggedIndex(index);
                                }}
                                onDragOver={onDragOver}
                                onDrop={(e) => onDrop(e, index)}                       
                            >
                                <ImageElement 
                                    filePath={`${elementName}/${elementId}/${item.filename}`} 
                                    className="card-img-top rounded"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>

                        )}
                    </div>
                </div>

            ))}

        </div>

    );
};

export default ImageGridElement;