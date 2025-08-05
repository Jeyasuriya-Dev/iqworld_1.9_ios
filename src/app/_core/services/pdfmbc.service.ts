import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfmbcService {
  url = "../assets/images/iq-world.png";
  constructor() {
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

}
