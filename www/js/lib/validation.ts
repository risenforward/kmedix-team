
export class valid {

    public static dateString(date: Date) {

        return date.toISOString().substr(0, 10);
    }

    public static timeString(time: Date) {

        return time.getHours() + ":" + time.getMinutes();
    }

    public static parseDate(d) {
        if (d.indexOf('/') > -1) { //contains '/'
            var splitDate = d.split("/");
            return new Date(splitDate[2], parseInt(splitDate[1]) - 1, splitDate[0]);
        }
        return new Date(d);
    }

    public static addDays(date: Date, days: any) {
        var dat = new Date(date.valueOf());
        dat.setDate(dat.getDate() + parseInt(days) - 1);
        return dat;
    }

    public static daysDiff(date1, date2) {

        var timeDiff = date2.getTime() - date1.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    }

    public static hasValue(value) {

        if (value === 0 || value) {
            return true;
        }
        else {
            return false;
        }
    }

    public static stringLength(value: string, min: number, max: number) {
        let stringValue= value.toString();
        return (stringValue.length >= min && stringValue.length <= max);
    }


    public static range(value: number, min: number, max: number) {
        return (value >= min && value <= max);
    }

    public static isInt(value) {
        return parseInt(value) == value;
    }

    public static datePeriod(value: Date, start: Date, period: number) {
        var ValueDatePeriod = valid.daysDiff(start, value);
        return ValueDatePeriod <= period;
    }

    public static dateHasntGone(value: Date) {
        var today = new Date();
        return valid.daysDiff(today, value) >= 0;
    }

    public static datesOrder(date1: Date, date2: Date) {
        return date1.getTime() <= date2.getTime();
    }

}