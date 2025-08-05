import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
declare var pdfjsLib: any;
@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit, OnDestroy {
  @ViewChild('pdfCanvas', { static: true }) pdfCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() url!: string;
  @Input() customWidth?: number
  @Input() customHeight?: number
  pdfDoc: any = null;
  pageNum: number = 1;
  pageIsRendering: boolean = false;
  pageNumIsPending: number | null = null;
  pageCount: number = 0;
  scale: number = 1.5;
  ctx!: CanvasRenderingContext2D;
  autoSlideInterval: any;

  ngOnInit(): void {
    this.ctx = this.pdfCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    if (this.url) {
      this.loadPdf(this.url);
    } else {
      console.error('No PDF URL provided.');
    }

    // Start auto sliding pages
    // this.autoSlideInterval = setInterval(() => this.showNextPage(), 5000); // Change page every 5 seconds

  }

  ngOnDestroy(): void {
    clearInterval(this.autoSlideInterval); // Clear the interval when component is destroyed
  }

  loadPdf(url: string) {
    pdfjsLib.getDocument(url).promise.then((pdfDoc_: any) => {
      this.pdfDoc = pdfDoc_;
      this.pageCount = pdfDoc_.numPages;
      this.renderPage(this.pageNum);
    }).catch((error: any) => {
      console.error('Error loading PDF:', error);
    });
  }

  renderPage1(num: number) {
    this.pageIsRendering = true;
    this.pdfDoc.getPage(num).then((page: any) => {
      const viewport = page.getViewport({ scale: this.scale });
      this.pdfCanvas.nativeElement.height = viewport.height;
      this.pdfCanvas.nativeElement.width = viewport.width;

      const renderCtx = {
        canvasContext: this.ctx,
        viewport: viewport
      };

      page.render(renderCtx).promise.then(() => {
        this.pageIsRendering = false;

        if (this.pageNumIsPending !== null) {
          this.renderPage(this.pageNumIsPending);
          this.pageNumIsPending = null;
        }
      });

      this.pageNum = num;
    });
  }
  renderPage(num: number) {
    this.pageIsRendering = true;
    this.pdfDoc.getPage(num).then((page: any) => {
      const viewport = page.getViewport({ scale: this.scale });

      // Use custom dimensions if provided; otherwise, use viewport dimensions
      const width = this.customWidth || viewport.width;
      const height = this.customHeight || viewport.height;

      this.pdfCanvas.nativeElement.height = height;
      this.pdfCanvas.nativeElement.width = width;

      const renderCtx = {
        canvasContext: this.ctx,
        viewport: viewport
      };

      page.render(renderCtx).promise.then(() => {
        this.pageIsRendering = false;

        if (this.pageNumIsPending !== null) {
          this.renderPage(this.pageNumIsPending);
          this.pageNumIsPending = null;
        }
      });

      this.pageNum = num;
    });
  }
  queueRenderPage(num: number) {
    if (this.pageIsRendering) {
      this.pageNumIsPending = num;
    } else {
      this.renderPage(num);
    }
  }

  showPrevPage() {
    if (this.pageNum <= 1) {
      return;
    }
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  }

  showNextPage() {
    if (this.pageNum >= this.pdfDoc.numPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }

  openPdf() {
    if (this.url) {
      const newWindow = window.open('', '_blank', 'fullscreen=yes');
      if (newWindow) {
        newWindow.document.write('<iframe width="100%" height="100%" src="' + this.url + '"></iframe>');
      } else {
        console.error('Failed to open new window');
      }
    } else {
      console.error('PDF URL is not available');
    }
  }
}