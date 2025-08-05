import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '../loader/loader.component';
import { AlertService } from './alert.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GooglePickerService {
  constructor(private dialogRef: MatDialog) {


  }
  private readonly SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
  private readonly CLIENT_ID = '1052528723000-gj4jnqtu30cggec50bokprcg967v1bq0.apps.googleusercontent.com';
  private readonly API_KEY = 'AIzaSyCtZLOft_AN_syCvuvlQT9t_mRofFdSFVM';
  // private readonly CLIENT_ID = '1006156049770-tjsdor2lehl4m8fa6uhcdcolbdpu0l72.apps.googleusercontent.com';
  // private readonly API_KEY = 'AIzaSyDSiRcYCmlWaiKjAOAMnrOdf4msv7Bve5U';

  private gapiToken: string | any = null;
  private pickerInited = false;
  private gisInited = false;
  tokenClient: any;
  FileList: any[] = [];
  loadScripts(): void {
    // Load Google API script with API_KEY
    const apiScript = document.createElement('script');
    apiScript.src = `https://apis.google.com/js/api.js?key=${this.API_KEY}`;
    apiScript.async = true;
    apiScript.defer = true;
    apiScript.onload = () => this.gapiLoaded();
    document.body.appendChild(apiScript);
    // Load Google Identity Services script
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.async = true;
    gisScript.defer = true;
    gisScript.onload = () => this.gisLoaded();
    document.body.appendChild(gisScript);
  }

  private gapiLoaded(): void {
    (window as any).gapi.load('client:picker', () => this.initializePicker());
  }

  private async initializePicker(): Promise<void> {
    try {
      await (window as any).gapi.client.init({
        apiKey: this.API_KEY,
        clientId: this.CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: this.SCOPES
      });
      this.pickerInited = true;
    } catch (error) {
      console.error('Error initializing Picker:', error);
    }
  }

  private gisLoaded(): void {
    this.tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: (response: any) => this.handleAuthResponse(response),
    });
    this.gisInited = true;

    // Check for existing access token
    this.gapiToken = localStorage.getItem('gapiToken');
    if (this.gapiToken) {
      this.createPicker();
    }
  }

  private handleAuthResponse(response: any): void {
    if (response.error) {
      console.error('Authentication error:', response.error);
      return;
    }
    this.gapiToken = response.access_token;
    localStorage.setItem('gapiToken', this.gapiToken); // Store token in local storage
    this.createPicker();
  }

  handleAuthClick(): void {
    this.tokenClient.requestAccessToken({ prompt: this.gapiToken ? '' : 'consent' });
  }

  handleSignoutClick(): void {
    if (this.gapiToken) {
      (window as any).google.accounts.oauth2.revoke(this.gapiToken);
      localStorage.removeItem('gapiToken'); // Remove token from local storage
      this.gapiToken = null;
      // Notify any observers or handle UI updates here
    }
  }

  private createPicker(): void {
    const recentlyPickedView = new (window as any).google.picker.View((window as any).google.picker.ViewId.RECENTLY_PICKED);
    const docsView = new (window as any).google.picker.View((window as any).google.picker.ViewId.DOCS);
    const sharedDocsView = new (window as any).google.picker.View((window as any).google.picker.ViewId.SHARED_DOCS);
    const sharedWithMeDocsView = new (window as any).google.picker.View((window as any).google.picker.ViewId.SHARED_WITH_ME);
    // 'application/pdf,' + 'image/jpeg,' + 'image/png,' + 'image/gif,' + 'image/bmp,' + 'image/webp,' +
    //         'video/mp4,' + 'video/x-m4v,' + 'video/quicktime,' + 'video/x-msvideo,' + 'video/x-ms-wmv'
    const picker = new (window as any).google.picker.PickerBuilder()
      .setOrigin(window.location.protocol + '//' + window.location.host)
      .enableFeature((window as any).google.picker.Feature.SUPPORT_DRIVES)
      .enableFeature((window as any).google.picker.Feature.MULTISELECT_ENABLED)
      .setSelectableMimeTypes(
        'image/jpeg,' + 'image/png,' + 'image/gif,' + 'image/bmp,' + 'image/webp,' + 'application/pdf,' +
        'video/mp4,' + 'video/x-m4v,' + 'video/quicktime,' + 'video/x-msvideo,' + 'video/x-ms-wmv'
      )
      .addView(recentlyPickedView)
      .addView((window as any).google.picker.ViewId.PDFS)
      .addView((window as any).google.picker.ViewId.DOCUMENTS)
      .addView(docsView)
      .addView(sharedDocsView)
      .addView(sharedWithMeDocsView)
      .setOAuthToken(this.gapiToken)
      .setCallback((data: any) => this.pickerCallback(data))
      .build();

    picker.setVisible(true);
  }

  private async pickerCallback(data: any): Promise<void> {
    if (data[(window as any).google.picker.Response.ACTION] === (window as any).google.picker.Action.PICKED) {
      const documents = data[(window as any).google.picker.Response.DOCUMENTS];
      try {
        this.FileList = [];
        this.dialogRef.open(LoaderComponent, {
          panelClass: 'loader-upload'
        })
        await Promise.all(documents.map(async (document: any) => {
          console.log(document);
          const fileId = document[(window as any).google.picker.Document.ID];
          const fileName = document[(window as any).google.picker.Document.NAME];
          const mimeType = document[(window as any).google.picker.Document.MIME_TYPE];
          const dataUrl = await fetchFileData(fileId, this.gapiToken, fileName, mimeType);
          let v = {
            url: dataUrl.dataUrl,
            type: mimeType,
            name: fileName,
            file: dataUrl.file
          }
          this.FileList.push(v);
          await this.handleSelectedFile(fileId, fileName, mimeType);
        }));
        this.dialogRef.closeAll();
      } catch (error) {
        this.dialogRef.closeAll();
        console.error('Error processing selected files:', error);
      }
    }
  }

  private async handleSelectedFile(fileId: string, fileName: string, mimeType: string): Promise<void> {
    try {
      const file = await (window as any).gapi.client.drive.files.get({
        'fileId': fileId,
        'fields': 'name, mimeType, webContentLink'
      });
      const downloadUrl = file.result.webContentLink;

      // await this.downloadFile(downloadUrl, fileName);
    } catch (error) {
      console.error('Error handling selected file:', error);
      this.dialogRef.closeAll();
    }
  }

  private async downloadFile(url: string, fileName: string): Promise<void> {
    try {
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }
}

function removeQueryParameters(url: any,) {
  const index = url.indexOf('?');
  return index !== -1 ? url.substring(0, index) : url;
}


async function fetchFileData(fileId: string, accessToken: string, fileName: string, mimeType: string): Promise<{ file: File, dataUrl: string }> {
  try {
    // Fetch the file as a Blob
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Network response was not ok: ${response.statusText}`,
        showConfirmButton: false,
        timer: 1500
      });
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    // Convert the response to a Blob
    const blob = await response.blob();

    // Convert Blob to Data URL
    const dataUrl = await convertBlobToDataUrl(blob);

    // Convert Blob to File
    const file = new File([blob], fileName, { type: mimeType });

    return { file, dataUrl };
  } catch (error) {
    console.error('Error fetching file data:', error);
    throw error;
  }
}

function convertBlobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(new Error('Error reading blob as data URL'));
    };

    reader.readAsDataURL(blob);
  });
}
