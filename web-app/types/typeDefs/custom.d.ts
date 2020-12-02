/* eslint-disable */
/// <reference path="../../node_modules/@types/googlemaps/index.d.ts" />

declare module '*.jpeg' {
    const value: string;
    export = value;
}

declare module '*.jpg' {
    const value: string;
    export = value;
}

declare module '*.png' {
    const value: string;
    export = value;
}

declare module '*.svg' {
    const value: any;
    export default value;
}

declare module '*.gif' {
    const value: string;
    export = value;
}

declare module '*.ico' {
    const value: string;
    export = value;
}

declare module '*.webp' {
    const value: string;
    export = value;
}
