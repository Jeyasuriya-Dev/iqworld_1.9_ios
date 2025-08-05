import { Injectable } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

//android
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Filesystem, FilesystemDirectory, FilesystemEncoding,Directory ,Encoding} from '@capacitor/filesystem';
import { Capacitor,Plugins } from '@capacitor/core';
const { Intent } = Plugins;
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file/ngx';
const { Device, Permissions } = Plugins;
import { Browser } from '@capacitor/browser';
//android
let docDefinition: any;
// (pdfMake as any).vfs = (pdfFonts as any).vfs;

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  url = "../assets/images/iq-world.png";
  // url = "http://192.168.70.100/IQWORLD/assets/images/iq-world.png";
  constructor() {
     (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs; 
        //  (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

// (pdfMake as any).vfs = (pdfFonts as any).vfs;
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    }

  async generateCustomerPDF(data: any) {
    // console.log("history");
    // console.log(data);

    let widths = this.pdfColumnWiths(data.columns);
    // console.log(widths);
    let bodyColumns = this.pdfBodyColumns(data.columns);
    // console.log(bodyColumns);
    let bodydata = this.pdfBodyHistory(data?.history, data?.columnsdataFields);
    // console.log(bodydata);

    let reportTime = this.getReportPrintTime();
    // console.log(reportTime);

    docDefinition = {
      pageSize: 'A2',
      pageOrientation: 'landscape',
      pageMargins: [40, 60, 40, 60],
      content:
       [
        {
          columns: [
            {
              margin: [0, -50, 0, 0],
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
                    { text: data?.filterList?.fromdate == 'null' ? "N/A" : data?.filterList?.fromdate, style: 'dateValue' },
                    { text: data?.filterList?.todate == 'null' ? "N/A" : data?.filterList?.todate, style: 'dateValue' }
                  ],
                ],
              },
            }
          ]
        },

        {

          columns: [
            {
              image: await this.getBase64ImageFromURL(this.url),
              width: 80,
              alignment: 'left',
            },
            {
              margin: [250, 0, -60, 0],
              text: data.reportname,
              alignment: 'right',
              fontSize: 18,
              bold: true,
            },
            {
              text: 'IQ-WORLD',
              alignment: 'right',
              fontSize: 10,
              margin: [250, 0, 0, 0],
            },
          ]
        },
        {
          canvas: // Free Line
            [
              // { type: 'line', x1: 0, y1: 2, x2: 1556 - 10, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
              { type: 'line', x1: 0, y1: 2, x2: 1604, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
            ]
        },

        {
          columns: [
            {
              margin: [0, 10, 50, 0],
              stack: [

                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "Distributor"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.distributor
                    }
                  ]
                },
                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "State"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.state
                    }
                  ]
                },
                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "District"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.district
                    }
                  ]
                },
                {
                  margin: [0, 0, 0, 10],
                  columns: [

                    {
                      width: 50,
                      style: "strong",
                      text: "City"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.city
                    }
                  ]
                },

                // {
                //   columns: [
                //     {
                //       width: 50,
                //       style: "strong",
                //       text: "Location"
                //     },
                //     {
                //       width: "auto",
                //       margin: [0, 0, 5, 0],
                //       text: ":"
                //     },
                //     {
                //       width: "*",
                //       text: data?.filterList?.location
                //     }
                //   ]
                // }
              ]
            }
          ],
          style: "filter"
        },
        {
          columns: [
            {
              margin: [0, -90, 50, 0],
              stack: [

                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "Location"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.location
                    }
                  ]
                },
                // {
                //   margin: [0, 0, 0, 10],
                //   columns: [
                //     {
                //       width: 45,
                //       style: "strong",
                //       text: "Fromdate"
                //     },
                //     {
                //       width: "auto",
                //       margin: [0, 0, 5, 0],
                //       text: ":"
                //     },
                //     {
                //       width: "*",
                //       text: data?.filterList?.fromdate == 'null' ? "" : data?.filterList?.fromdate
                //     }
                //   ]
                // },
                // {
                //   margin: [0, 0, 0, 10],
                //   columns: [
                //     {
                //       width: 45,
                //       style: "strong",
                //       text: "Todate"
                //     },
                //     {
                //       width: "auto",
                //       margin: [0, 0, 5, 0],
                //       text: ":"
                //     },
                //     {
                //       width: "*",
                //       text: data?.filterList?.todate == 'null' ? "" : data?.filterList?.todate
                //     }
                //   ]
                // },
                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    {
                      width: 45,
                      style: "strong",
                      text: "Status"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.isactive
                    }
                  ]
                },
                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    {
                      width: 45,
                      style: "strong",
                      text: "Plan Type"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.plan
                    }
                  ]
                },

              ]
            }
          ],
          style: "filter1"
        },
        // {
        //   columns: [

        //     {
        //       margin: [0, 10, 50, 0],

        //       stack: [

        //         {
        //           margin: [0, 0, 0, 10],
        //           columns: [
        //             {
        //               width: 45,
        //               style: "strong",
        //               text: "Bill to"
        //             },
        //             {
        //               width: "auto",
        //               margin: [0, 0, 5, 0],
        //               text: ":"
        //             },
        //             {
        //               width: "*",
        //               text: 'this.cap(this.trimmer(this.api.billToAddress))'
        //             }
        //           ]
        //         },
        //         {
        //           margin: [0, 0, 0, 10],
        //           columns: [
        //             {
        //               width: 45,
        //               style: "strong",
        //               text: "Ship to"
        //             },
        //             {
        //               width: "auto",
        //               margin: [0, 0, 5, 0],
        //               text: ":"
        //             },
        //             {
        //               width: "*",
        //               text: 'this.cap(this.trimmer(this.api.shippingAddress))'
        //             }
        //           ]
        //         },
        //         {
        //           margin: [0, 0, 0, 10],
        //           columns: [
        //             {
        //               width: 45,
        //               style: "strong",
        //               text: "Email"
        //             },
        //             {
        //               width: "auto",
        //               margin: [0, 0, 5, 0],
        //               text: ":"
        //             },
        //             {
        //               width: "*",
        //               text: 'this.api.orderEmail'
        //             }
        //           ]
        //         },
        //         {
        //           columns: [
        //             {
        //               width: 45,
        //               style: "strong",
        //               text: "Phone"
        //             },
        //             {
        //               width: "auto",
        //               margin: [0, 0, 5, 0],
        //               text: ":"
        //             },
        //             {
        //               width: "*",
        //               text: 'this.api.phoneNumber'
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   ],

        //   style: "filter"
        // },
        // {
        //   text: '',
        //   margin: [0, 0, 0, 3],
        // },
        {
          columns: [{
            // margin: [540, -100, 0, 0],
            text: ` ADDRESS`,
            style: 'texInvoice',
          }]
        },
        {
          columns: [

            {
              text: data?.address,
              style: 'originalRecipt',
            },
          ],
          // style: "filter2"
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
        },
        {
          canvas: // Free Line
            [
              // { type: 'line', x1: 0, y1: 10, x2: 770 - 10, y2: 10, lineWidth: 0.5, color: '#145369', bold: false }

              { type: 'line', x1: 0, y1: 2, x2: 1604, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
            ]
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
        },
        {
          text: data.reportname,
          style: 'SubTitleHeader'
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
        },
        {
          table: {
            textTransform: 'capitalize',
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
              // text: '©Powered by : Yash Electronics Pvt Ltd.'
              text: '©Powered by : IQ World India Ka IQ.'
            }
          ],
          fontSize: 8,
          margin: [60, 10, 60, 10]
        };
      },
      // DOWLOAD FILE TITLE
      info: {
        title: data.reportname,
        author: 'IQ World India Ka IQ.',
        subject: data.reportname,
        keywords: data.reportname,
      },

      // CSS
      styles: {
        filter1: {
          fontSize: 10,
          bold: false,
          alignment: 'left',
          // color: '#ff0066',
          margin: [340, 0, 0, 0],
          // alignment: 'center',
        },
        filter2: {
          fontSize: 10,
          bold: false,
          alignment: 'left',
          // color: '#ff0066',
          margin: [200, 0, 0, 0],
          // alignment: 'center',
        },
        strong: {
          bold: true,
          color: "#145369"
        },
        filter: {
          fontSize: 10,
        },
        texInvoice: {
          fontSize: 12,
          bold: true,
          // alignment: 'right',
          color: '#ff0066',
          // margin: [490, -100, 0, 0],
          margin: [1380, -92, 0, 0],
          alignment: 'left',
        },
        tableF: {
          borderWidth: '0px',
          margin: [0, 5, 0, 15],
        },
        originalRecipt: {
          fontSize: 10,
          margin: [1380, -88, 0, 0],
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
    // if (data.action === 'download') {
    //   pdfMake.createPdf(docDefinition).download(data.reportname);
    // } else if (data.action === 'print') {
    //   pdfMake.createPdf(docDefinition).print();
    // } else {
    //   pdfMake.createPdf(docDefinition).open();
    // }
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getBase64(async (base64String: string) => {
      const pdfName = `Customer_Information_${new Date().getTime()}.pdf`;
      // const pdfName = `Customer Information_.pdf`;
    
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
  //devicepdf
  async generateDevicePDF(data: any) {
    // console.log("history");
    // console.log(data);

    let widths = this.pdfColumnWiths(data.columns);
    // console.log(widths);
    let bodyColumns = this.pdfBodyColumns(data.columns);
    // console.log(bodyColumns);
    let bodydata = this.pdfBodyHistory(data?.history, data?.columnsdataFields);
    // console.log(bodydata);

    let reportTime = this.getReportPrintTime();
    // console.log(reportTime);

    docDefinition = {
      pageSize: 'A2',
      pageOrientation: 'landscape',
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          columns: [
            {
              margin: [0, -50, 0, 0],
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
                    { text: data?.filterList?.fromdate == 'null' ? "N/A" : data?.filterList?.fromdate, style: 'dateValue' },
                    { text: data?.filterList?.todate == 'null' ? "N/A" : data?.filterList?.todate, style: 'dateValue' }
                  ],
                ],
              },
            }
          ]
        },
        {
          columns: [
            {
              image: await this.getBase64ImageFromURL(this.url),
              width: 80,
              alignment: 'left',
            },
            {
              margin: [250, 0, -60, 0],
              text: data.reportname,
              alignment: 'right',
              fontSize: 18,
              bold: true,
            },
            {
              text: 'IQ-WORLD',
              alignment: 'right',
              fontSize: 10,
              margin: [250, 0, 0, 0],
            },
          ]
        },
        {
          canvas: // Free Line
            [
              // { type: 'line', x1: 0, y1: 2, x2: 770 - 10, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
              { type: 'line', x1: 0, y1: 2, x2: 1604, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
            ]
        },

        {
          columns: [
            {
              margin: [0, 10, 50, 0],
              stack: [

                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "Distributor"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.distributor
                    }
                  ]
                },
                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "Client"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "220",
                      text: data?.filterList?.client
                    }
                  ]
                },
                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "State"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.state
                    }
                  ]
                },
                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "District"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.district
                    }
                  ]
                },
                // {
                //   margin: [0, 0, 0, 10],
                //   columns: [

                //     {
                //       width: 50,
                //       style: "strong",
                //       text: "City"
                //     },
                //     {
                //       width: "auto",
                //       margin: [0, 0, 5, 0],
                //       text: ":"
                //     },
                //     {
                //       width: "*",
                //       text: data?.filterList?.city
                //     }
                //   ]
                // }
              ]
            }
          ],
          style: "filter"
        },

        {
          columns: [
            {
              margin: [0, -95, 50, 0],
              stack: [
                {
                  margin: [0, 10, 0, 0],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "Activity"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.isactive
                    }
                  ]
                },
                {
                  margin: [0, 10, 0, 0],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "orientation"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.orientation
                    }
                  ]
                },
                {
                  margin: [0, 10, 0, 0],
                  columns: [
                    {
                      width: 45,
                      style: "strong",
                      text: "Plan Type"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.plan
                    }
                  ]
                },
                // {
                //   margin: [0, 10, 0, 10],
                //   columns: [
                //     {
                //       width: 45,
                //       style: "strong",
                //       text: "Fromdate"
                //     },
                //     {
                //       width: "auto",
                //       margin: [0, 0, 5, 0],
                //       text: ":"
                //     },
                //     {
                //       width: "*",
                //       text: data?.filterList?.fromdate
                //     }
                //   ]
                // },
                // {
                //   margin: [0, 0, 0, 10],
                //   columns: [
                //     {
                //       width: 45,
                //       style: "strong",
                //       text: "Todate"
                //     },
                //     {
                //       width: "auto",
                //       margin: [0, 0, 5, 0],
                //       text: ":"
                //     },
                //     {
                //       width: "*",
                //       text: data?.filterList?.todate
                //     }
                //   ]
                // }
              ]
            }
          ],
          style: "filter1"
        },
        {
          columns: [
            {
              margin: [285, -95, 50, 0],
              stack: [

                {
                  margin: [0, 10, 0, 0],
                  columns: [

                    {
                      width: 50,
                      style: "strong",
                      text: "City"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.city
                    }
                  ]
                },
                {
                  margin: [0, 10, 0, 10],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "Location"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.location
                    }
                  ]
                },
                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "Status"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.isonline
                    }
                  ]
                },
                // {
                //   margin: [0, 0, 0, 10],
                //   columns: [
                //     {
                //       width: 50,
                //       style: "strong",
                //       text: "Activity"
                //     },
                //     {
                //       width: "auto",
                //       margin: [0, 0, 5, 0],
                //       text: ":"
                //     },
                //     {
                //       width: "*",
                //       text: data?.filterList?.isactive
                //     }
                //   ]
                // },
                // {
                //   margin: [0, 0, 0, 10],
                //   columns: [
                //     {
                //       width: 50,
                //       style: "strong",
                //       text: "orientation"
                //     },
                //     {
                //       width: "auto",
                //       margin: [0, 0, 5, 0],
                //       text: ":"
                //     },
                //     {
                //       width: "*",
                //       text: data?.filterList?.orientation
                //     }
                //   ]
                // }

              ]
            }
          ],
          style: "filter2"
        },

        {
          columns: [
            {
              text: ` ADDRESS`,
              style: 'texInvoice',
            }
          ]
        },

        {
          columns: [
            {
              text: data?.address,
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
              // { type: 'line', x1: 0, y1: 10, x2: 770 - 10, y2: 10, lineWidth: 0.5, color: '#145369', bold: false }
              { type: 'line', x1: 0, y1: 2, x2: 1604, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
              // { type: 'line', x1: 0, y1: 2, x2: 770 - 10, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
            ]
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
        },
        {
          text: data.reportname,
          style: 'SubTitleHeader'
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
        },
        {
          table: {
            textTransform: 'capitalize',
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
              // text: '©Powered by : Yash Electronics Pvt Ltd.'
               text: '©Powered by : IQ World India Ka IQ.'
              
            }
          ],
          fontSize: 8,
          margin: [60, 10, 60, 10]
        };
      },
      // DOWLOAD FILE TITLE
      info: {
        title: data.reportname,
        author: 'IQ World India Ka IQ.',
        subject: data.reportname,
        keywords: data.reportname,
      },

      // CSS
      styles: {
        filter1: {
          fontSize: 10,
          bold: false,
          alignment: 'left',
          // color: '#ff0066',
          margin: [590, 0, 0, 0],
          // alignment: 'center',
        },
        filter2: {
          fontSize: 10,
          bold: false,
          alignment: 'left',
          // color: '#ff0066',
          margin: [0, 0, 0, 0],
          // alignment: 'center',
        },
        strong: {
          bold: true,
          color: "#145369"
        },
        filter: {
          fontSize: 10,
        },
        // texInvoice: {
        //   fontSize: 12,
        //   bold: true,
        //   // alignment: 'right',
        //   color: '#ff0066',
        //   margin: [490, 0, 0, 0],
        //   alignment: 'center',
        // },
        texInvoice: {
          fontSize: 12,
          bold: true,
          // alignment: 'right',
          color: '#ff0066',
          // margin: [490, -100, 0, 0],
          margin: [1380, -83, 0, 0],
          alignment: 'left',
        },
        tableF: {
          borderWidth: '0px',
          margin: [0, 5, 0, 15],
        },
        // originalRecipt: {
        //   fontSize: 10,
        //   margin: [220, 0, 0, 0],
        //   alignment: 'left',
        // },
        originalRecipt: {
          fontSize: 10,
          margin: [1380, -80, 0, 0],
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
    // if (data.action === 'download') {
    //   pdfMake.createPdf(docDefinition).download(data.reportname);
    // } else if (data.action === 'print') {
    //   pdfMake.createPdf(docDefinition).print();
    // } else {
    //   pdfMake.createPdf(docDefinition).open();
    // }
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getBase64(async (base64String: string) => {
      const pdfName = `Device_Information_${new Date().getTime()}.pdf`;
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
  async generateDeviceLogsPDF(data: any) {
    // console.log("history");
    // console.log(data);

    let widths = this.pdfColumnWiths(data.columns);
    // console.log(widths);
    let bodyColumns = this.pdfBodyColumns(data.columns);
    // console.log(bodyColumns);
    let bodydata = this.pdfBodyHistory(data?.history, data?.columnsdataFields);
    // console.log(bodydata);

    let reportTime = this.getReportPrintTime();
    // console.log(reportTime);

    docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
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
              margin: [180, 0, 0, 0],
              text: data.reportname,
              alignment: 'right',
              fontSize: 18,
              width: 375,
              bold: true,
            },
            {
              text: 'IQ-WORLD',
              alignment: 'center',
              fontSize: 10,
              margin: [230, 0, 0, 0],
            },
          ]
        },
        {
          canvas: // Free Line
            [
              { type: 'line', x1: 0, y1: 2, x2: 770 - 10, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
            ]
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
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
                    { text: data?.fdate == "null" ? "N/A" : data?.fdate, style: 'dateValue' },
                    { text: data?.tdate == "null" ? "N/A" : data?.tdate, style: 'dateValue' }
                  ],
                ],
              },
            },
            {
              text: data?.address,
              style: 'originalRecipt',
            },
          ]
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
        },
        {
          text: data.reportname,
          style: 'SubTitleHeader'
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
        },
        {
          table: {
            textTransform: 'capitalize',
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
              text: '©Powered by : Yash Electronics Pvt Ltd.'
            }
          ],
          fontSize: 8,
          margin: [60, 10, 60, 10]
        };
      },
      // DOWLOAD FILE TITLE
      info: {
        title: data.reportname,
        author: 'Yash Electronics Pvt Ltd.',
        subject: data.reportname,
        keywords: data.reportname,
      },

      // CSS
      styles: {
        filter1: {
          fontSize: 10,
          bold: false,
          alignment: 'left',
          // color: '#ff0066',
          margin: [590, 0, 0, 0],
          // alignment: 'center',
        },
        filter2: {
          fontSize: 10,
          bold: false,
          alignment: 'left',
          // color: '#ff0066',
          margin: [0, 0, 0, 0],
          // alignment: 'center',
        },
        strong: {
          bold: true,
          color: "#145369"
        },
        filter: {
          fontSize: 10,
        },
        texInvoice: {
          fontSize: 12,
          bold: true,
          // alignment: 'right',
          color: '#ff0066',
          margin: [390, 0, 0, 0],
          alignment: 'center',
        },
        tableF: {
          borderWidth: '0px',
          margin: [0, 5, 0, 15],
        },
        originalRecipt: {
          fontSize: 10,
          margin: [200, -10, 0, 0],
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
    // if (data.action === 'download') {
    //   pdfMake.createPdf(docDefinition).download(data.reportname);
    // } else if (data.action === 'print') {
    //   pdfMake.createPdf(docDefinition).print();
    // } else {
    //   pdfMake.createPdf(docDefinition).open();
    // }
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getBase64(async (base64String: string) => {
      const pdfName = `Device_Logs_Info_${new Date().getTime()}.pdf`;

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

  async generateDestributorPDF(data: any) {
    // console.log("history");
    // console.log(data);

    let widths = this.pdfColumnWiths(data.columns);
    // console.log(widths);
    let bodyColumns = this.pdfBodyColumns(data.columns);
    // console.log(bodyColumns);
    let bodydata = this.pdfBodyHistory(data?.history, data?.columnsdataFields);
    // console.log(bodydata);

    let reportTime = this.getReportPrintTime();
    // console.log(reportTime);

    docDefinition = {
      pageSize: 'A2',
      pageOrientation: 'landscape',
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          columns: [
            {
              margin: [0, -50, 0, 0],
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
                    { text: data?.filterList?.fromdate == 'null' ? "N/A" : data?.filterList?.fromdate, style: 'dateValue' },
                    { text: data?.filterList?.todate == 'null' ? "N/A" : data?.filterList?.todate, style: 'dateValue' }
                  ],
                ],
              },
            }
          ]
        },

        {

          columns: [
            {
              image: await this.getBase64ImageFromURL(this.url),
              width: 80,
              alignment: 'left',
            },
            {
              margin: [250, 0, -60, 0],
              text: data.reportname,
              alignment: 'right',
              fontSize: 18,
              bold: true,
            },
            {
              text: 'IQ-WORLD',
              alignment: 'right',
              fontSize: 10,
              margin: [250, 0, 0, 0],
            },
          ]
        },
        {
          canvas: // Free Line
            [
              { type: 'line', x1: 0, y1: 2, x2: 1604, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }
            ]
        },

        {
          columns: [
            {
              margin: [0, 10, 50, 0],
              stack: [

                // {
                //   margin: [0, 0, 0, 10],
                //   columns: [
                //     {
                //       width: 50,
                //       style: "strong",
                //       text: "Distributor"
                //     },
                //     {
                //       width: "auto",
                //       margin: [0, 0, 5, 0],
                //       text: ":"
                //     },
                //     {
                //       width: "*",
                //       text: data?.filterList?.distributor
                //     }
                //   ]
                // },
                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "State"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.state
                    }
                  ]
                },
                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "District"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.district
                    }
                  ]
                }
                ,
                // {
                //   margin: [0, 0, 0, 10],
                //   columns: [

                //     {
                //       width: 50,
                //       style: "strong",
                //       text: "City"
                //     },
                //     {
                //       width: "auto",
                //       margin: [0, 0, 5, 0],
                //       text: ":"
                //     },
                //     {
                //       width: "*",
                //       text: data?.filterList?.city
                //     }
                //   ]
                // }
              ]
            }
          ],
          style: "filter"
        },
        {
          columns: [
            {
              margin: [0, -43, 50, 0],
              stack: [

                {
                  margin: [0, 0, 0, 10],
                  columns: [

                    {
                      width: 50,
                      style: "strong",
                      text: "City"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.city
                    }
                  ]
                },
                {
                  columns: [
                    {
                      width: 50,
                      style: "strong",
                      text: "Location"
                    },
                    {
                      width: "auto",
                      margin: [0, 0, 5, 0],
                      text: ":"
                    },
                    {
                      width: "*",
                      text: data?.filterList?.location
                    }
                  ]
                },
                // {
                //   margin: [0, 10, 0, 10],
                //   columns: [
                //     {
                //       width: 45,
                //       style: "strong",
                //       text: "Fromdate"
                //     },
                //     {
                //       width: "auto",
                //       margin: [0, 0, 5, 0],
                //       text: ":"
                //     },
                //     {
                //       width: "*",
                //       text: data?.filterList?.fromdate
                //     }
                //   ]
                // },
                // {
                //   margin: [0, 0, 0, 10],
                //   columns: [
                //     {
                //       width: 45,
                //       style: "strong",
                //       text: "Todate"
                //     },
                //     {
                //       width: "auto",
                //       margin: [0, 0, 5, 0],
                //       text: ":"
                //     },
                //     {
                //       width: "*",
                //       text: data?.filterList?.todate
                //     }
                //   ]
                // }
              ]
            }
          ],
          style: "filter1"
        },
        // {
        //   columns: [

        //     {
        //       margin: [0, 10, 50, 0],

        //       stack: [

        //         {
        //           margin: [0, 0, 0, 10],
        //           columns: [
        //             {
        //               width: 45,
        //               style: "strong",
        //               text: "Bill to"
        //             },
        //             {
        //               width: "auto",
        //               margin: [0, 0, 5, 0],
        //               text: ":"
        //             },
        //             {
        //               width: "*",
        //               text: 'this.cap(this.trimmer(this.api.billToAddress))'
        //             }
        //           ]
        //         },
        //         {
        //           margin: [0, 0, 0, 10],
        //           columns: [
        //             {
        //               width: 45,
        //               style: "strong",
        //               text: "Ship to"
        //             },
        //             {
        //               width: "auto",
        //               margin: [0, 0, 5, 0],
        //               text: ":"
        //             },
        //             {
        //               width: "*",
        //               text: 'this.cap(this.trimmer(this.api.shippingAddress))'
        //             }
        //           ]
        //         },
        //         {
        //           margin: [0, 0, 0, 10],
        //           columns: [
        //             {
        //               width: 45,
        //               style: "strong",
        //               text: "Email"
        //             },
        //             {
        //               width: "auto",
        //               margin: [0, 0, 5, 0],
        //               text: ":"
        //             },
        //             {
        //               width: "*",
        //               text: 'this.api.orderEmail'
        //             }
        //           ]
        //         },
        //         {
        //           columns: [
        //             {
        //               width: 45,
        //               style: "strong",
        //               text: "Phone"
        //             },
        //             {
        //               width: "auto",
        //               margin: [0, 0, 5, 0],
        //               text: ":"
        //             },
        //             {
        //               width: "*",
        //               text: 'this.api.phoneNumber'
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   ],

        //   style: "filter"
        // },
        // {
        //   text: '',
        //   margin: [0, 0, 0, 3],
        // },
        {
          columns: [{
            // margin: [540, -100, 0, 0],
            text: ` ADDRESS`,
            style: 'texInvoice',
          }]
        },
        {
          columns: [

            {
              text: `
              Yash Electronics,
              Babosa Industrial Park, BLDG.NO-A2,
              1 st Floor Unit No-100-108 Saravali village,
              Near Vatika Hotel, Nashik Highway(NH-3),
              Bhiwandi – 4121302.`,
              style: 'originalRecipt',
            },
          ],
          // style: "filter2"
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
        },
        {
          canvas: // Free Line
            [
              // { type: 'line', x1: 0, y1: 10, x2: 770 - 10, y2: 10, lineWidth: 0.5, color: '#145369', bold: false }
              { type: 'line', x1: 0, y1: 2, x2: 1604, y2: 2, lineWidth: 0.1, color: '#145369', bold: false }

            ]
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
        },
        {
          text: data.reportname,
          style: 'SubTitleHeader'
        },
        {
          text: ' ',
          margin: [0, 0, 0, 5],
        },
        {
          table: {
            textTransform: 'capitalize',
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
              text: '©Powered by : Yash Electronics Pvt Ltd.'
            }
          ],
          fontSize: 8,
          margin: [60, 10, 60, 10]
        };
      },
      // DOWLOAD FILE TITLE
      info: {
        title: data.reportname,
        author: 'Yash Electronics Pvt Ltd.',
        subject: data.reportname,
        keywords: data.reportname,
      },

      // CSS
      styles: {
        filter1: {
          fontSize: 10,
          bold: false,
          alignment: 'left',
          // color: '#ff0066',
          margin: [300, 0, 0, 0],
          // alignment: 'center',
        },
        strong: {
          bold: true,
          color: "#145369"
        },
        filter: {
          fontSize: 10,
        }, texInvoice: {
          fontSize: 12,
          bold: true,
          // alignment: 'right',
          color: '#ff0066',
          // margin: [490, -100, 0, 0],
          margin: [1380, -50, 0, 0],
          alignment: 'left',
        },
        // texInvoice: {
        //   fontSize: 12,
        //   bold: true,
        //   // alignment: 'right',
        //   color: '#ff0066',
        //   margin: [490, 0, 0, 0],
        //   alignment: 'center',
        // },
        tableF: {
          borderWidth: '0px',
          margin: [0, 5, 0, 15],
        },
        // originalRecipt: {
        //   fontSize: 10,
        //   margin: [220, 0, 0, 0],
        //   alignment: 'left',
        // },
        originalRecipt: {
          fontSize: 10,
          margin: [1380, -48, 0, 0],
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
    // if (data.action === 'download') {
    //   pdfMake.createPdf(docDefinition).download(data.reportname);
    // } else if (data.action === 'print') {
    //   pdfMake.createPdf(docDefinition).print();
    // } else {
    //   pdfMake.createPdf(docDefinition).open();
    // }
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getBase64(async (base64String: string) => {
      const pdfName = `Distributor_Information_${new Date().getTime()}.pdf`;

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
    // console.log(data);

    for (let i of data) {

      this.widthsAuto.push((100 / data.length) + "%");

      // this.widthsAuto.push('auto');
      // this.widthsAuto.push('100vw');
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