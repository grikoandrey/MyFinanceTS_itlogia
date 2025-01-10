export class DateUtils {

    static formatDateToDisplay(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    }

    static formatDateToStorage(dateString) {
        const [day, month, year] = dateString.split('.');
        return `${year}-${month}-${day}`;
    }
}