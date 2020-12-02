import { useEffect } from 'react';

const cachedScripts: string[] = [];
let service: google.maps.places.AutocompleteService;
const src = `https://maps.googleapis.com/maps/api/js?key=${process.env.WEB_APP_GOOGLE_API_KEY}&libraries=places`;

export function useGooglePlacesScript(): google.maps.places.AutocompleteService | undefined {
    useEffect(
        () => {
            if (!cachedScripts.includes(src)) {
                cachedScripts.push(src);

                // Create script
                const script = document.createElement('script');
                script.src = src;
                script.async = true;

                // Script event listener callbacks for load and error
                const onScriptLoad = (): void => {
                    service = new window.google.maps.places.AutocompleteService();
                };

                const onScriptError = (): void => {
                    // Remove from cachedScripts we can try loading again
                    const index = cachedScripts.indexOf(src);
                    if (index >= 0) {
                        cachedScripts.splice(index, 1);
                    }
                    script.remove();
                };

                script.addEventListener('load', onScriptLoad);
                script.addEventListener('error', onScriptError);

                // Add script to document body
                document.body.appendChild(script);

                // Remove event listeners on cleanup
                return (): void => {
                    script.removeEventListener('load', onScriptLoad);
                    script.removeEventListener('error', onScriptError);
                };
            }
        },
        [] // Only re-run effect if script src changes
    );

    return service;
}
