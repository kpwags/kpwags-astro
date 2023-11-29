import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (value: string|Date, format = 'MMMM D, YYYY'): string => {
    const date = dayjs(value).add(1, 'day');
    const timeZone = dayjs.tz.guess();
    date.tz(timeZone);
    return date.format(format);
};

export const formatDateTime = (value: string|Date): string => {
    const date = dayjs(value).add(1, 'day');
    const timeZone = dayjs.tz.guess();
    date.tz(timeZone);

    return `${dayjs(date).format('MMMM D, YYYY')} at ${dayjs(date).format('h:mm A')}`;
};

export const getDateParts = (value: string|Date): { year: string, month: string, day: string } => {
    const date = dayjs(value).add(1, 'day');
    const timeZone = dayjs.tz.guess();
    date.tz(timeZone);

    return {
        year: date.format('YYYY'),
        month: date.format('MM'),
        day: date.format('DD'),
    };
};

export const getMonthName = (month: number) => {
    switch (month) {
        case 2:
            return 'February';
        case 3:
            return 'March';
        case 4:
            return 'April';
        case 5:
            return 'May';
        case 6:
            return 'June';
        case 7:
            return 'July';
        case 8:
            return 'August';
        case 9:
            return 'September';
        case 10:
            return 'October';
        case 11:
            return 'November';
        case 12:
            return 'December';
        case 1:
        default:
            return 'Janurary';
    }
}