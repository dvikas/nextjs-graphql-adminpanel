import { useEffect, MutableRefObject } from 'react';

export function useOnClickOutside(ref: MutableRefObject<any>, handler: () => void, keyBoardEvents = false): void {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent | KeyboardEvent): void => {
            // Do nothing if clicking ref's element or descendent elements
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }

            handler();
        };

        document.addEventListener('mousedown', listener);

        if (keyBoardEvents) {
            document.addEventListener('touchstart', listener);
            document.addEventListener('keyup', listener);
        }

        return (): void => {
            document.removeEventListener('mousedown', listener);
            if (keyBoardEvents) {
                document.removeEventListener('touchstart', listener);
                document.removeEventListener('keyup', listener);
            }
        };
    }, [ref, handler, keyBoardEvents]);
}
