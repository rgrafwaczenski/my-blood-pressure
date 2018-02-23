export class PersonalSettings {
    firstName: string;
    lastName: string;
    birthDay: string;
    email: string;
    systoleWarning: number;
    systoleDanger: number;
    diastoleWarning: number;
    diastoleDanger: number;

    constructor() {
        this.systoleWarning = 130;
        this.systoleDanger = 140;
        this.diastoleWarning = 85;
        this.diastoleDanger = 90;
    }
}
