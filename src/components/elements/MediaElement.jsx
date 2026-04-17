import React, { useState } from 'react';
import NoImageFallback from '../../images/1.jpg';

function MediaElement({ elementName, elementId, item, onProgressUpdate, ...props }) {
    const [hasError, setHasError] = useState(false);

    const getFinalUrl = (path) => {
        if (!path || hasError) return NoImageFallback;
        return `safe-protocol://${path.replace(/\\/g, '/')}`;
    };

    const filePath = getFinalUrl(`${elementName}/${elementId}/${item.filename}`);

    if (item.type === 'video') {
        return (
            <video 
                id="video-player-viewer"
                src={filePath} 
                {...props} 
                loop
                muted
                onClick={(e) => {
                    if (e.currentTarget.paused) e.currentTarget.play();
                    else e.currentTarget.pause();
                }}                
                onTimeUpdate={(e) => {
                    if (onProgressUpdate) {
                        onProgressUpdate({
                            currentTime: e.target.currentTime,
                            duration: e.target.duration
                        });
                    }
                }}
            />
        );
    }

    return <img src={filePath} {...props} onError={() => setHasError(true)} />;
}

export default MediaElement;