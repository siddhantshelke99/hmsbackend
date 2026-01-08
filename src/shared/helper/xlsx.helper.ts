import * as XLSX from 'xlsx';
import path from 'path';
// import fs from 'fs';
export class XlsxHelper {

  private excelEpoc = new Date(1900, 0, -1).getTime();
  private msDay = 86400000;

  public readExcel(filePath): any[] {
    const workbook = XLSX.readFile(filePath);
    const worksheetName = workbook.SheetNames[0]; // assuming the first sheet
    const worksheet = workbook.Sheets[worksheetName];
    // const headers: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    // fs.unlinkSync(filePath);
    return data;
  }

  public exportExcel(data) {
    const headerCols: any = Object.keys(data[0])
    const wb = XLSX.utils.book_new();

    const filePath = path.join('./public', 'Tickets' + '_' + new Date().getTime() + '.xlsx')
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
}


