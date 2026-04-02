import React, { useState } from 'react';
// Assicurati di avere questa immagine nella cartella assets
import NoImageFallback from '../../images/1.jpg';

function ImageElement({ filePath, ...props }) {
    // Stato per gestire se l'immagine è valida o ha avuto un errore
    const [hasError, setHasError] = useState(false);

    // Formattiamo il percorso (gestendo eventuali problemi di slash/backslash)
    const getFinalUrl = (path) => {
        if (!path || hasError) return NoImageFallback;
        const cleanPath = path.replace(/\\/g, '/');
        return `safe-protocol://${cleanPath}`;
    };

    return (
        <img 
            // Usa l'URL del DB o il fallback a seconda dello stato di errore
            src={getFinalUrl(filePath)}
            // Passiamo tutte le altre props (className, alt, style, ecc.)
            {...props} 
            // Se c'è un errore, aggiorniamo lo stato
            onError={() => {
                if (!hasError) {
                    console.warn(`Immagine non trovata nel DB al percorso: ${filePath}`);
                    setHasError(true);
                }
            }}
        />
    );
}

export default ImageElement;