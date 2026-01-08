import * as XLSX from 'xlsx';
import { Notice } from '../interfaces/notice.interface';
import { SMS_REMINDERS } from 'src/interfaces/reminder.interface';
const path = require('path');
const fs = require('fs');
export class XlsxHelper {

  private excelEpoc = new Date(1900, 0, -1).getTime();
  private excelNoticeDateEpoc = new Date(1900, 0, 0).getTime();
  private msDay = 86400000;

  constructor() {

  }

  public readExcel(filePath): Array<Notice> {
    const workbook = XLSX.readFile(filePath);
    const worksheetName = workbook.SheetNames[0]; // assuming the first sheet
    const worksheet = workbook.Sheets[worksheetName];
    const headers: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: true });

    const combinedArray: Array<Notice> = data.map(data => {
      let obj: Notice = {
        LAN: '',
        DOCUMENT: '',
        NOTICE: '',
        NAME: '',
        CONTACT: '',
        ADDRESS: '',
        CITY: '',
        STATE: '',
        PINCODE: '',
        LANGUAGE: '',
        TYPE: '',
        UPLOAD_TYPE: '',
        BARCODE: '',
        DISPATCH_DATE: '',
        STATUS: '',
        STATUS_AT: '',
        STATUS_DATE: '',
        REASON: '',
        LAST_ACTIVITY: '',
        LAST_CHECKED_DATE: '',
        TOTAL_OUTSTANDING: '',
        NOTICE_DATE: '',
        PRINCIPAL_OS: "",
        INTEREST_OS: "",
        INSTALMENT_AMOUNT: "",
        FURTURE_PRINCIPAL_OUTSTANDING: "",
        FORCLOSURE_CHARGES: "",
        INTEREST_FOR_THE_MONTH: "",
        BOUNCE_CHARGES: "",
        EMI_DEFAULT_CHARGES: "",
        MANDATE_REJECTION_CHARGES: "",
        SWAP_CHARGE: "",
        PENAL_CHARGES: "",
        PART_PREPAYMENT_CHARGES: "",
        DUPICATE_NOC_CHARGES: "",
        LOAN_CANCELLATION_CHARGES: "",
        REPOSSESSION_CHARGES: "",
        REPOSSESSION_DATE: "",
        PARKING_CHARGES: "",
        LEGAL_CHARGES: "",
        TOTAL_DEBITS: "",
        ADVANCE_INSTALMENTS: "",
        ADVANCE_AVAILABLE: "",
        OTHER_REFUND: "",
        SALE_VALUE: "",
        SALE_DATE: "",
        TOTAL_CREDITS: ""
      }
      headers.forEach((header, index) => {
        obj[header] = data[header] ? data[header] : '';
        if (header == 'DISPATCH_DATE' || header == 'STATUS_DATE' || header == 'LAST_CHECKED_DATE') {
          obj[header] = this.excelDateConvertor(obj[header])
        }
      });
      return obj;
    });
    fs.unlinkSync(filePath);
    return combinedArray;
  }


  public readReminderExcel(filePath): Array<SMS_REMINDERS> {
    const workbook = XLSX.readFile(filePath);
    const worksheetName = workbook.SheetNames[0]; // assuming the first sheet
    const worksheet = workbook.Sheets[worksheetName];
    const headers: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false, dateNF: "dd-mm-yyyy" });
    // const data =XLSX.utils.sheet_to_json(worksheet, { raw: true });
    //  console.log('DATA-------------------->',data);

    //XLSX.utils.sheet_to_json(worksheet, { raw: true });

    const combinedArray: Array<SMS_REMINDERS> = data.map(data => {
      let obj: SMS_REMINDERS = {
        LAN: '',
        MESSAGE: '',
        SENT_DATE: '',
        // SENT_AS_ON_DATE: '',
        STATUS: ''
      }
      headers.forEach((header, index) => {
        obj[header] = data[header] ? data[header] : '';
        // if (header == 'SENT_DATE' || header == 'SENT_AS_ON_DATE') {
        //   obj[header] = this.excelDateConvertor(obj[header])
        // }
      });
      return obj;
    });
    fs.unlinkSync(filePath);
    return combinedArray;
  }


  public exportExcel(data) {
    let headerCols: any = Object.keys(data[0])
    const wb = XLSX.utils.book_new();

    const filePath = path.join('./exports', 'Notices' + '_' + new Date().getTime() + '.xlsx')
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [headerCols]);
    XLSX.utils.sheet_add_json(ws, data, { origin: 'A2', skipHeader: true });
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filePath);
    return filePath
  }

  excelDateConvertor(excelDate) {
    return new Date(this.excelEpoc + excelDate * this.msDay);
  }
  excelDateforNoticeConvertor(excelDate, p0: boolean) {
    const date = new Date(this.excelNoticeDateEpoc + excelDate * this.msDay);
    return date.toISOString().split('T')[0];
  }
}


