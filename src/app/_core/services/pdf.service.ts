import { Injectable } from '@angular/core';
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import  pdfMake from 'pdfmake/build/pdfmake';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

//android 
import { Filesystem, FilesystemDirectory, FilesystemEncoding,Directory ,Encoding} from '@capacitor/filesystem';
import { Capacitor,Plugins } from '@capacitor/core';
const { Intent } = Plugins;
import { FileOpener } from '@ionic-native/file-opener';
//android
let docDefinition: any;
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
// (pdfMake as any).vfs = (pdfFonts as any).vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  url = "../assets/images/iq-world.png";
  // url = "http://192.168.70.100/IQWORLD/assets/images/iq-world.png";
  constructor() {
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
    // (pdfMake as any).vfs = (pdfFonts as any).vfs;
        // (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

  }
  async generatePDFSP(action: any, history: any, reportname: any, columns: any, columnsdataFields: any, column_width: any, fdate: any, tdate: any) {
    // console.log("history");
    let widths = this.pdfColumnWithsByNumber(column_width);
    // console.log(widths);
    let bodyColumns = this.pdfBodyColumns(columns);
    // console.log(bodyColumns);
    let bodydata = this.pdfBodyHistory(history, columnsdataFields);
    // console.log(bodydata);

    let reportTime = this.getReportPrintTime();
    // console.log(reportTime);

    docDefinition = {
      pageSize: 'A4',
      // pageOrientation: 'portrait',
      pageOrientation: 'landscape',
      // pageMargins: [120, 50, 120, 50],
      // pageMargins: [25, 60, 40, 60],
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          columns: [
            {
              image: await this.getBase64ImageFromURL(this.url),
              width: 80,
              alignment: 'left',
            },
            {
              text: reportname,
              alignment: 'right',
              fontSize: 12,
            },
            {
              text: 'IQ-WORLD',
              alignment: 'center',
              fontSize: 10,
              margin: [250, 0, 0, 0],
            },
          ]
        },
        {
          text: ' ',
          margin: [0, 0, 0, 3],
        },
        {
          text: ` ADDRESS`,
          style: 'texInvoice',
        },
        {
          columns: [
            {
              alignment: 'left',
              width: 350,
              table: {
                headerRows: 1,
                alignment: 'center',
                body: [
                  [
                    { text: `From Date`, style: 'dateHeader' },
                    { text: `To Date`, style: 'dateHeader' }
                  ],
                  [
                    { text: fdate, style: 'dateValue' },
                    { text: tdate, style: 'dateValue' }
                  ],
                ],
              },
            },
            {
              text: `
              Yash Electronics,
              Babosa Industrial Park, BLDG.NO-A4,
              1 st Floor Unit No-100-108 Saravali village,
              Near Vatika Hotel, Nashik Highway(NH-3),
              Bhiwandi – 4121302.`,
              style: 'originalRecipt',
            },
          ]
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
        },
        {
          canvas: // Free Line
            [
              { type: 'line', x1: 0, y1: 10, x2: 770 - 10, y2: 10, lineWidth: 0.5, color: '#145369', bold: true }
            ]
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
        },
        {
          text: reportname,
          style: 'SubTitleHeader'
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
        },
        {
          table: {
            headerRows: 1,
            widths: widths,
            body: [
              bodyColumns
              ,
              ...bodydata,
            ],
          },
        },

      ],
      // FOOTER
      footer: function (currentPage: { toString: () => string; }, pageCount: string) {
        return {
          columns: [
            'Generated on : ' + reportTime,
            {
              alignment: 'center',
              text: currentPage.toString() + ' of ' + pageCount,
            },
            {
              alignment: 'right',
              // text: '©Powered by : Yash Electronics Pvt Ltd.
              text: '©Powered by : IQ World India Ka IQ.'
            }
          ],
          fontSize: 8,
          margin: [60, 10, 60, 10]
        };
      },
      // DOWLOAD FILE TITLE
      info: {
        title: reportname,
        author: 'IQ World India Ka IQ.',
        subject: reportname,
        keywords: reportname,
      },

      // CSS
      styles: {
        texInvoice: {
          fontSize: 12,
          bold: true,
          // alignment: 'right',
          color: '#ff0066',
          margin: [490, 0, 0, 0],
          alignment: 'center',
        },

        originalRecipt: {
          fontSize: 10,
          margin: [220, 0, 0, 0],
          alignment: 'left',
        },

        headerRNet: {
          fontSize: 25,
          color: '#ff0000',
          bold: true,
          decoration: 'underline',
          margin: [0, 5, 0, 5],
        },
        dateHeader: {
          fontSize: 9,
          fillColor: '#1c5f8d',
          color: '#f0f0f0',
          alignment: 'center',
        },
        dateValue: {
          fontSize: 9,
          alignment: 'center',
        },

        SubTitleHeader: {
          color: '#1c5f8d',
          fontSize: 15,
          alignment: 'center',
          bold: true,
        },

        rowThree: {
          fontSize: 9,
          fillColor: '#f0f0f0',
          alignment: 'center',
        },

        rowThreeHeader: {
          color: '#fefefe',
          fillColor: '#1c5f8d',
          fontSize: 10,
          alignment: 'center',
          bold: true,
        },
      },
    };
    // if (action === 'download') {
    //   pdfMake.createPdf(docDefinition).download(reportname);
    // } else if (action === 'print') {
    //   pdfMake.createPdf(docDefinition).print();
    // } else {
    //   pdfMake.createPdf(docDefinition).open();
    // }

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getBase64(async (base64String: string) => {
      const pdfName = `Ridsys_schedule_details_${new Date().getTime()}.pdf`;
      try {
        // Write the PDF file
        const result = await Filesystem.writeFile({
          path: pdfName,
          data: base64String,
          directory: FilesystemDirectory.Documents
        });
    
        const filePath = result.uri;
        console.log('PDF file saved:', filePath);
    
        // Open the PDF after saving
        alert(`PDF saved at: ${filePath}`);
        openPDF(filePath);
      } catch (error) {
        console.error('Error saving PDF file:', error);
      }
    });
  }
  ctx: any;
  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        this.ctx = canvas.getContext("2d");
        this.ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
  widthsAuto: any = []
  pdfColumnWiths(data: any) {
    this.widthsAuto.length = 0;
    for (let i of data) {
      // widths.push('6.55%')
      this.widthsAuto.push('auto');
      // widths.push('100vw');
    }
    // console.log(this.widthsAuto);

    return this.widthsAuto;
  }
  pdfColumnWithsByNumber(data: any) {
    // console.log(data);
    this.widthsAuto.length = 0;
    for (let i of data) {
      // widths.push('6.55%')
      this.widthsAuto.push(i);
      // widths.push('100vw');
    }
    return this.widthsAuto;
  }
  pdfBodyColumns(data: any) {
    // console.log(data);
    let pdfBodyColumns: any[] = []
    for (let i of data) {
      let obj = { text: i, style: 'rowThreeHeader' }
      pdfBodyColumns.push(obj)
    }
    return pdfBodyColumns;
  }
  pdfData: any = [];
  pdfBodyHistory(data: any, type: any) {
    this.pdfData.length = 0;
    let pdf = data.map((user: any) => {
      let arr: any = [];
      for (let t of type) {
        let v = { text: user[t], style: 'rowThree' }
        arr.push(v);
      }
      this.pdfData.push(arr);
    });
    return this.pdfData;

  }

  getReportPrintTime() {
    var today = new Date();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var hours: any = today.getHours() > 12 ? today.getHours() - 12 : today.getHours();
    var am_pm = today.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    var seconds = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();


    if (month < 10 && day < 10) {
      var date = today.getFullYear() + '/' + "0" + month + '/' + "0" + today.getDate();
    }
    else if (month < 10 && day > 10) {
      var date = today.getFullYear() + '/' + "0" + month + '/' + today.getDate();
    } else if (month > 10 && day < 10) {
      var date = today.getFullYear() + '/' + month + '/' + "0" + today.getDate();
    }
    else {
      var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
    }
    var time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
    return date + ' ' + time;
  }
}
async function requestStoragePermission(): Promise<boolean> {
  if (Capacitor.getPlatform() === 'android') {
    const { Permissions } = Plugins;
    const result = await Permissions['request']({ name: 'storage' });
    return result.state === 'granted';
  } else if (Capacitor.getPlatform() === 'ios') {
    // iOS typically doesn't need explicit permission for file access in app's document directory
    return true;
  }
  return false;
}
async function openPDF(filePath: string) {
  try {
    const platform = Capacitor.getPlatform();

    if (platform === 'android' || platform === 'ios') {
      const hasPermission = await requestStoragePermission();

      if (!hasPermission) {
        throw new Error('Storage permission not granted');
      }

      console.log('Opening PDF at path:', filePath);

      // Since we have the file path, we can directly use it to open the file
      // alert(`Opening PDF at: ${filePath}`);
      
      await FileOpener.open(filePath, 'application/pdf');

      console.log('PDF opened successfully');
    } else {
      console.error('Unsupported platform:', platform);
    }
  } catch (error) {
    console.error('Error opening PDF:', error);
  }
}

