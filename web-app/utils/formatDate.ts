import {
    format,
    parseISO,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
} from 'date-fns';

export const formatDate = (isoDateString: string): string => {
    const date = parseISO(isoDateString);
    const currentDate = Date.now();
    const daysAgo = differenceInDays(currentDate, date);
    const hoursAgo = differenceInHours(currentDate, date);
    const minutesAgo = differenceInMinutes(currentDate, date);
    const secondsAgo = differenceInSeconds(currentDate, date);

    if (secondsAgo <= 2) {
        return `just now`;
    }
    if (minutesAgo < 1) {
        return `${secondsAgo} second${secondsAgo > 1 ? 's' : ''} ago`;
    }
    if (hoursAgo < 1) {
        return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    }
    if (daysAgo < 1) {
        return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    }
    if (daysAgo <= 30) {
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    }
    return format(date, 'MMM do, yyyy');
};

export const formateDateForInput = (isoDateString: string): string => {
    if (isoDateString) {
        return format(parseISO(isoDateString), 'yyyy-MM-dd');
    }
    return isoDateString;
};
