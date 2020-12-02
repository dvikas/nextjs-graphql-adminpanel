export * from './ContactType';

declare global {
    interface Window {
        // Loaded for google places API
        google: any;
    }
}
