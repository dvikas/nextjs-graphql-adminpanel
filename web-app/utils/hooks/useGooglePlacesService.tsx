import { useCallback, useState, Dispatch, SetStateAction, ChangeEvent } from 'react';
import debounce from 'lodash.debounce';
import { useGooglePlacesScript } from './useGooglePlacesScript';

type GooglePlacesOption = { googlePlacesId: string; name: string; id: string };

export function useGooglePlacesService(): [
    (e: ChangeEvent<HTMLInputElement>) => void,
    GooglePlacesOption[],
    boolean,
    string,
    Dispatch<SetStateAction<string>>
] {
    const service = useGooglePlacesScript();

    const [isLoadingLocationResults, setIsLoadingLocationResults] = useState(false);

    const [googleMapsAutocompleteResults, setGoogleMapsAutocompleteResults] = useState<
        google.maps.places.AutocompletePrediction[]
    >();

    const [location, setLocation] = useState('');

    const debouncedGoogleMapsCall = useCallback(
        debounce<(searchQuery: string) => Promise<void>>(async (searchQuery): Promise<void> => {
            if (service && searchQuery) {
                await new Promise((resolve) => {
                    service.getQueryPredictions(
                        {
                            input: searchQuery,
                        },
                        async (results, status) => {
                            if (status === 'OK') {
                                setGoogleMapsAutocompleteResults(
                                    results as google.maps.places.AutocompletePrediction[]
                                );
                            }
                            resolve();
                        }
                    );
                });
            }
            setIsLoadingLocationResults(false);
        }, 500),
        [service, setGoogleMapsAutocompleteResults, setIsLoadingLocationResults]
    );

    const locationOptions: GooglePlacesOption[] = googleMapsAutocompleteResults
        ? googleMapsAutocompleteResults.map((location) => ({
              id: location.place_id,
              googlePlacesId: location.place_id,
              name: location.description,
          }))
        : [];

    const handleLocationSearchQueryChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setLocation(e.target.value);
        setIsLoadingLocationResults(true);
        debouncedGoogleMapsCall(e.target.value);
    };

    return [handleLocationSearchQueryChange, locationOptions, isLoadingLocationResults, location, setLocation];
}
