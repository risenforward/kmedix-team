

export function Where<T>(array: Array<T>, query: (t: T) => boolean): Array<T> {
    var newArray = new Array<T>();
    for (var i = 0; i < array.length; i++) {
        var item: T = array[i];
        if (query(item)) {
            newArray.push(item);
        }
    }
    return newArray;
};



export function FirstWhere<T>(array: Array<T>, query: (t: T) => boolean): T {

    for (var i = 0; i < array.length; i++) {
        var item: T = array[i];
        if (query(item)) {
            return item;
        }
    }
    return null;
};




export function ContainsWhere<T>(array: Array<T>, query: (t: T) => boolean): boolean {

    for (var i = 0; i < array.length; i++) {
        var item: T = array[i];
        if (query(item)) {
            return true;
        }
    }
    return false;
};


//removes an item from an array with the item's reference
export function RemoveElement<T>(array: Array<T>, element: T): void {

    for (var i = 0; i < array.length; i++) {
        var item: T = array[i];
        if (item === element) {
            array.splice(i, 1);
            return;
        }
    }
};

export function GetElementById(array: any[], id: any): any{
    return FirstWhere(array, (t)=>{return t.id == id;});
}


export function StartsWith(text: string, str: string): boolean {
    return text.slice(0, str.length) == str;
};



export function StringFormat(text: string, ...args: Array<any>): string {
    var value: string = text;
    for (var i = 0; i <= args.length - 1; i++)
        value = value.replace(new RegExp('\\{' + i + '}', 'g'), args[i]);
    return value;
};

