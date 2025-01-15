export class DateUtils {

    public static formatDateToDisplay(dateString: string): string {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    }

    public static formatDateToStorage(dateString: string): string {
        const [day, month, year] = dateString.split('.');
        return `${year}-${month}-${day}`;
    }
}