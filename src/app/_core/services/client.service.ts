import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { clienturl } from 'src/app/api-base';
import { StorageService } from './storage.service';
const BASE_API = clienturl.BASE_URL();
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

declare var google: any;
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  User: any;
  userIp: any;
  private geocoder: any;
  constructor(private http: HttpClient, private storageService: StorageService) {
    let v: any = this.getCurrentAddress();
    // this.ifscBankDetails("HDFC0009159");
    this.getIPAddress().subscribe((res: any) => {
      // console.log(res);

      this.getUserIp().subscribe((res1: any) => {
        this.userIp = res.ipString + "/" + res1.userip;
        // console.log(this.userIp);
      })
    })
    this.User = storageService.getUser();
  }
  ifscBankDetails(ifsc: any) {
    // return this.http.get("https://ifsc.razorpay.com/"+ifsc);
    fetch("https://ifsc.razorpay.com/" + ifsc)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }
  getUserIp() {
    return this.http.get(BASE_API + "/none-auth/useripAddress");

  }
  async logMovies(url: any) {
    const response = await fetch(url);
    const movies = await response.json();
    // console.log(movies);
  }
  createClient(payload: any): Observable<any> {
    // console.log(payload);

    return this.http.post(BASE_API + "/client/create", payload);
  }
  updateClient(payload: any): Observable<any> {
    // console.log(payload);
    return this.http.post(BASE_API + "/client/updateclient", payload);
  }
  getAllClientList() {
    return this.http.get(BASE_API + "/client/all");
  }

  getClientListByDistributorId(id: any) {
    return this.http.get(BASE_API + "/client/getclientlistbydistributorid?distributorid=" + id);
  }
  getAllStateList() {
    return this.http.get(BASE_API + "/none-auth/state/all");
  }
  getStateListWithoutAll() {
    return this.http.get(BASE_API + "/none-auth/getAllState");
  }
  getStateListBycountryIdOrcountry(countryname: any, countryid: any) {
    return this.http.get(BASE_API + "/none-auth/getstatebycountry?countryid=" + countryid + "&countryname=" + countryname);
  }
  getCityListByStateId(stateid: any) {
    return this.http.get(BASE_API + "/none-auth/city?stateid=" + stateid);
  }
  getCityListByStateIdOrState(stateid: any, statename: any) {
    return this.http.get(BASE_API + "/none-auth/getcitybystate?stateid=" + stateid + "&statename=" + statename);
  }
  // getCurrentAddress(): any {
  //   const successCallback = async (position: any) => {
  //     // console.log(position.coords);
  //     let v = await this.getAddressBylt(position.coords.latitude, position.coords.longitude);
  //     console.log(v);


  //   };
  //   const errorCallback = (error: any) => {
  //     console.log(error);
  //   };
  //   navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  // }
  getCurrentAddress(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const successCallback = async (position: any) => {
        try {
          const address = await this.getAddressBylt(position.coords.latitude, position.coords.longitude);
          // console.log(address);
          resolve(address); // Resolve the promise with the address
        } catch (error) {
          console.error(error);
          reject(error); // Reject the promise if there's an error
        }
      };

      const errorCallback = (error: any) => {
        // console.log(error);
        reject(error); // Reject the promise on error
      };

      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    });
  }

  async getAddressBylt(lat: any, lon: any) {
    var requestOptions = {
      method: 'GET',
    };
    var Res: any;
    await fetch("https://api.geoapify.com/v1/geocode/reverse?lat=" + lat + "&lon=" + lon + "&apiKey=3e0f8d22bbbe467f8e584f7040592da1", requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log(result);
        Res = result;
      })
      .catch(error => console.log('error', error));

    // console.log(Res);
    return Res;
  }
  createPlaylist(payload: any, stateListIds: any) {
    // console.log(this.userIp);

    // playlistname;
    // username;
    //  userip;
    // stateid;
    //  city;
    //  clientname;
    // displaytype;
    // statelist;
    let fd = {
      "playlistname": payload.filename,
      "username": payload.username,
      "userip": this.userIp,
      "stateid": payload.state,
      "district": payload.district,
      "city": payload.city,
      "clientname": payload.clientname,
      "displaytype": payload.displaytype,
      "statelist": stateListIds,
      "mediatype": payload.mediatype,
      "location": payload.location
    }
    // console.log(fd);


    // console.log(this.userIp);
    return this.http.post(BASE_API + "/playlist/create", fd);
    // return this.http.post(BASE_API + "/playlist/create?playlistname=" + payload.filename + "&username=" + payload.username + "&city=" + payload.city + "&state=" + payload.state + "&userip=" + this.userIp + "&displaytype=" + payload.displaytype + "&clientname=" + payload.clientname + "&mediatype=" + payload.mediatype, {});
  }
  getDefaultAllPlaylistByClient(clientname: any, isvertical: any) {
    return this.http.get(BASE_API + "/playlist/getplaylistdefault?clientname=" + clientname + "&vertical=" + isvertical);
  }

  getAllPlaylistByClient(clientname: any, isvertical: any) {
    return this.http.get(BASE_API + "/playlist/byclient?clientname=" + clientname + "&vertical=" + isvertical);
  }

  getAllMediaInfoByPlaylistId(playlistId: any) {
    return this.http.get(BASE_API + "/playlist/getplaylistfiles?playlist_id=" + playlistId);
  }
  getmediafilesByPlaylistNdOrientation(playlistId: any, isvertical: any) {
    return this.http.get(BASE_API + "/playlist/getplaylistfilesbyplaylistidandorientation?playlist_id=" + playlistId + "&vertical=" + isvertical);
  }
  public getIPAddress() {
    return this.http.get('https://api-bdc.net/data/client-ip');
  }

  getAllDevicesList() {
    return this.http.get(BASE_API + "/device/all");
  }
  // gettotaldevicesbydistributorid
  getTotalDevicesByDistributorId(id: any) {
    return this.http.get(BASE_API + "/device/gettotaldevicesbydistributorid?distributorid=" + id);
  }
  getDevicesByusername(username: any) {
    return this.http.get(BASE_API + "/complaint/getByDeviceUsername?username=" + username);
    // http://localhost:8082/api/v1/complaint/getByDeviceUsername?username=IQW0000011
  }
  uploadFiles(fd: FormData) {
    return this.http.post(BASE_API + "/playlist/uploadfile", fd);
  }
  // http://192.168.1.105:8082/api/v1/none-auth/saveimageforeditor
  // uploadEditorFiles(fd: any) {
  //   return this.http.post(BASE_API + "/none-auth/saveimageforeditor", fd);
  // }
  uploadEditorFiles(fd: any) {
    return this.http.post(BASE_API + "/editorfiles/saveimageforeditor", fd);
  }
  // uploadImages(fd: any) {
  //   console.log(fd);
  //   return this.http.post(BASE_API + "/playlist/uploadfile", fd);
  // }
  mediaFilebyClientAndDate(payload: any) {
    // console.log(payload);
    return this.http.get(BASE_API + "/playlist/playlistbyclient?clientname=" + payload.clientname + "&state_id=" + payload.state + "&city_id=" + payload.city + "&mediatype=" + payload.mediatype + "&vertical=" + payload.vertical + "&location_id=" + payload.location_id + "&district_id=" + payload.district_id);
  }

  getAllPlaylistByClientUsername(clientname: any) {
    return this.http.get(BASE_API + "/playlist/getallplaylist?clientname=" + clientname);
  }
  setScheduleForPlaylist(playlist_id: any, startTime: any, endTime: any, scheduledby: any) {
    return this.http.get(BASE_API + "/playlist/setScheduleForPlaylist?playlist_id=" + playlist_id + "&start_time=" + startTime + "&end_time=" + endTime + "&scheduledby=" + scheduledby);
  }
  setScheduleForOta(otaid: any, startTime: any, endTime: any, otalist: any) {
    return this.http.get(BASE_API + "/none-auth/setscheduleforota?id=" + otaid + "&stattime=" + startTime + "&endtime=" + endTime + "&otalist=" + otalist + "&createdby=" + this.User?.username);
  }
  stopOtaScheduleCustomer(otaid: any, isautoupgrade: any, is_ota_active: any) {
    return this.http.get(BASE_API + "/none-auth/stopotaschedule?id=" + otaid + "&is_ota_active=" + is_ota_active + "&isautoupgrade=" + isautoupgrade + "&createdby=" + this.User?.username);
  }

  // stopOTASchedule

  disableOtaSchedule(otaid: any) {
    return this.http.get(BASE_API + "/none-auth/disableotaschedule?id=" + otaid + "&createdby=" + this.User?.username);
  }

  getplaylistByplaylistIdNdclientUsername(playlist_id: any, clientname: any) {
    // console.log(playlist_id);
    // console.log(clientname);
    return this.http.get(BASE_API + "/playlist/getplaylistByplaylistIdNdclientname?playlist_id=" + playlist_id + "&clientname=" + clientname);
  }

  getdeviceListbyclientusername(clientname: any) {
    return this.http.get(BASE_API + "/device/getdevicebyclient?clientname=" + clientname);
  }

  getdeviceListbyclientusernameMultiple(payload: any) {
    return this.http.post(BASE_API + "/device/getdevicebyclientlist", payload);
  }
  deleteMediafile(id: any) {
    return this.http.delete(BASE_API + "/playlist/deletemediafile?id=" + id + "&createdby=" + this.User?.username);
  }
  deletePlaylist(id: any) {
    return this.http.delete(BASE_API + "/playlist/deleteplaylist?id=" + id + "&createdby=" + this.User?.username);
  }
  editPlaylistStateList(payload: any) {
    return this.http.post(BASE_API + "/playlist/addtoallstate", payload);
  }

  editPlaylistStateLists(payload: any) {
    return this.http.post(BASE_API + "/playlist/editplaylist", payload);
  }

  stopPlaylistSchedule(playlist_id: any, scheduledby: any) {
    return this.http.get(BASE_API + "/playlist/stopplaylistschedule?id=" + playlist_id + "&scheduledby=" + scheduledby);
  }
  cancelPlaylistSchedule(playlist_id: any, scheduledby: any) {
    return this.http.get(BASE_API + "/playlist/cancelplaylistschedule?id=" + playlist_id + "&scheduledby=" + scheduledby);
  }
  stopOtaSchedule(id: any) {
    return this.http.get(BASE_API + "/none-auth/stopotaschedule?id=" + id + "&createdby=" + this.User?.username);
  }
  checkPlaylist() {
    return this.http.get(BASE_API + "/playlist/checkplaylist?playlist_id=21&updation_date=2023-08-03T15:19:39");
  }

  getDeviceStatusByClient(clientname: any) {

    return this.http.get(BASE_API + "/device/getdevicecountsbyclient?clientname=" + clientname);
  }
  getDistibutorDashboardData(id: any) {
    return this.http.get(BASE_API + "/distibutor/dashboarddetails?distributorid=" + id);
  }
  getAllDeviceStatus() {

    return this.http.get(BASE_API + "/device/getdevicestatusall");
  }
  getDeviceCountOfAllStates(clientname: any) {
    return this.http.get(BASE_API + "/device/getdevicecountofallstates?clientname=" + clientname);
  }
  sendOtp(clientname: any) {
    return this.http.get(BASE_API + "/none-auth/sendotp?clientname=" + clientname);
  }
  sendOtpForDeviceActivation(clientname: any, activationby: any) {
    return this.http.get(BASE_API + "/none-auth/sendotpactivation?clientname=" + clientname + "&activationby=" + activationby);
  }
  // sendResetOtp(clientname: any) {
  //   return this.http.get(BASE_API + "/none-auth/sendresetotp?clientname=" + clientname);
  // }

  // /none-auth/sendresetotp?clientname

  sendForgotRequest(clientname: any) {
    return this.http.get(BASE_API + "/none-auth/sendmailforresetpassword?email=" + clientname);
  }

  verifyOtp(otp: any, clientname: any) {
    return this.http.get(BASE_API + "/none-auth/verifyotp?otp=" + otp + "&clientname=" + clientname);
  }


  getClientcountByWeekorMonth(type: any) {
    return this.http.get(BASE_API + "/client/getclientcountbyweekormonth?type=" + type);
  }
  getDeviceDetailsByState(clientUsername: any) {
    return this.http.get(BASE_API + "/device/getdevicedetails?clientname=" + clientUsername);
  }
  // /getstoragedetails
  getStorageDetailsByClient(clientname: any) {
    return this.http.get(BASE_API + "/playlist/getstoragedetails?clientname=" + clientname);
  }
  getStorageDetailsByAdmin() {
    return this.http.get(BASE_API + "/playlist/gettotalstoragedetails");
  }
  changePasswordByUsername(clientname: any, newpass: any, code: any) {
    return this.http.get(BASE_API + "/none-auth/changepassword?clientname=" + clientname + "&newpass=" + newpass + '&code=' + code);
  }

  getDeviceCountByState(clientname: any, statename: any) {
    return this.http.get(BASE_API + "/device/getdevicecountbystate?clientname=" + clientname + "&statename=" + statename);
  }
  createScroller(payload: any) {
    return this.http.post(BASE_API + "/scroller/create", payload);
  }
  // getScrollerByClientname(clientname: any, playlistid: any) {
  //   return this.http.get(BASE_API + "/scroller/getbyclientname?clientname=" + clientname + "&playlistid=" + playlistid);
  // }


  getScrollerLogoByClient(clinetname: any) {
    return this.http.get(BASE_API + "/scroller/getscrollerlogobyclient?clinetname=" + clinetname);
  }
  getScrollerByClientnameNdPlaylistid(clientname: any, playlistid: any) {
    return this.http.get(BASE_API + "/scroller/getscrollerbyplaylistandclient?clientname=" + clientname + "&playlistid=" + playlistid);
  }
  getScrollerType() {
    return this.http.get(BASE_API + "/scroller/getscrolltype");
  }

  updateScrollerByClientnameAndId(payload: any) {
    return this.http.post(BASE_API + "/scroller/update", payload);
  }
  uploadFontFile(payload: any) {

    return this.http.post(BASE_API + "/scroller/scrollerfontupload", payload);
  }
  addScrollerToPlaylist(payload: any) {
    return this.http.post(BASE_API + "/scroller/addscrolllisttoplaylist", payload);
  }
  changeScrollerPosition(playlist_id: any, type_id: any, createdby: any) {
    return this.http.get(BASE_API + "/scroller/updateplaylistscrolltype?playlist_id=" + playlist_id + "&type_id=" + type_id + "&createdby=" + createdby);
  }
  deletScrollerById(id: any, createdby: any) {
    return this.http.delete(BASE_API + "/scroller/delete?id=" + id + "&createdby=" + createdby);
  }
  enablesScroller(playlistid: any, isscroller: any, createdby: any) {
    return this.http.get(BASE_API + "/scroller/enablesScroller?playlistid=" + playlistid + "&isscroller=" + isscroller + "&createdby=" + createdby);
  }

  getScheduleHistoryByFilter(clientname: any, start: any, end: any, playlist_id: any) {
    return this.http.get(BASE_API + "/playlist/getplaylisthistorybyclient?clientname=" + clientname + "&fromdate=" + start + "&todate=" + end + "&playlist_id=" + playlist_id);
  }

  updateSplitview(playlist_id: any, splitview: any) {
    return this.http.get(BASE_API + "/playlist/updatesplitview?splitview=" + splitview + "&playlist_id=" + playlist_id);
  }
  uploadApkFile(payload: FormData) {

    // console.log(payload.getAll);

    return this.http.post(BASE_API + "/none-auth/uploadapkfile", payload);
  }

  getOtalistAll() {
    return this.http.get(BASE_API + "/none-auth/getotalist/all");
  }


  updateOtaStatus(id: any, status: any) {
    return this.http.get(BASE_API + "/none-auth/updateotastatus?id=" + id + "&status=" + status + "&createdby=" + this.User?.username);
  }


  getClientByUsername(clientname: any) {
    return this.http.get(BASE_API + "/client/getclientbyusername?clientname=" + clientname);
  }
  getStoreByUsername(username: any) {
    return this.http.get(BASE_API + "/store/getstore?username=" + username);
  }

  getSuserByUsername(username: any) {
    return this.http.get(BASE_API + "/storeuser/getbyusername?username=" + username);
  }

  getOtaForClient(clientid: any) {
    return this.http.get(BASE_API + "/none-auth/getotalistforclient?id=" + clientid);
  }
  getNotificationForOtaUpgrade(clientname: any) {
    return this.http.get(BASE_API + "/none-auth/getnotificationforotaupgrade?clientname=" + clientname);
  }

  createComplaint(sub: any, desc: any, clientname: any, file: File) {
    return this.http.post(BASE_API + "/complaint/create?clientname=" + clientname + "&subject=" + sub + "&description=" + desc, {});
  }
  createComplaint1(sub: any, desc: any, clientname: any, file: File) {
    // console.log(file);
    let fd = new FormData();
    fd.set("clientname", clientname);
    fd.set("subject", sub);
    fd.set("description", desc);
    fd.set("file", file);
    // console.log(fd);

    return this.http.post(BASE_API + "/complaint/createcomplaint", fd);
  }
  getComplaintList() {
    return this.http.get(BASE_API + "/complaint/getcomplaintdetails");
  }
  getComplaintListbyView() {
    return this.http.get(BASE_API + "/complaint/getAllComplaintsByView");
  }
  updateIsViewed(id: any) {
    return this.http.get(BASE_API + "/complaint/upadateview?id=" + id);
  }
  updateIsActive(id: any) {
    return this.http.get(BASE_API + "/complaint/upadateactive?id=" + id);
  }
  getComplaintDetailsByView() {
    return this.http.get(BASE_API + "/complaint/getcomplaintdetailsbyview");
  }

  getComplaintDetailsByViewDistributor(username: any) {
    return this.http.get(BASE_API + "/complaint/getComplaintsByDistributorAndview?username=" + username);
  }

  getComplaintCountByDistributorOrAdmin(username: any) {
    return this.http.get(BASE_API + "/complaint/getactivecomplaintcount?username=" + username);
  }
  getComplaintListByDistributor(username: any) {
    return this.http.get(BASE_API + "/complaint/getComplaintlistByDistributor?username=" + username);
  }

  getComplaintListByDistributorOrAdmin(username: any) {
    return this.http.get(BASE_API + "/complaint/getcomplaintlist?username=" + username);
  }


  getActivateListByDistributorOrAdmin(username: any) {
    return this.http.get(BASE_API + "/complaint/getactivaterequest?username=" + username);
  }


  // getActiveAndDeactiveRequest(username: any, isactive: any) {
  //   return this.http.get(BASE_API + "/complaint/getactiveanddeactiverequest?username=" + username + "&isactive=" + isactive);
  // }
  getActiveAndDeactiveRequest(clientname: any, username: any, isactive: any) {
    return this.http.get(BASE_API + "/complaint/getpendingrequestlist?clientname=" + clientname + "&distributor=" + username + "&isactive=" + isactive);
  }
  getPaymentHistoryByMode(mode: any, clientname: any, role: any) {
    return this.http.get(BASE_API + "/paymenthistory/getpaymenthistorybymode?mode=" + mode + "&role=" + role + "&clientname=" + clientname);
  }

  getComplaintDetailsAllByClientname(clientname: any, type: any) {
    return this.http.get(BASE_API + "/complaint/getcomplaintdetailsbyclientname?clientname=" + clientname + "&type=" + type);
  }

  createDistibutor(payload: any) {
    return this.http.post(BASE_API + "/distibutor/create", payload);
  }
  // updatecomplaintfordistributorcreationvialink
  submitDistibutor(payload: any) {
    return this.http.post(BASE_API + "/complaint/updatecomplaintfordistributorcreationvialink", payload);
  }
  updateDistibutor(payload: any) {
    return this.http.post(BASE_API + "/distibutor/update", payload);
  }

  getDistibutor() {
    return this.http.get(BASE_API + "/distibutor/getdistributorall");
  }
  getOtaGroupInfo() {
    return this.http.get(BASE_API + "/none-auth/getotagroupinfo");
  }
  getDistibutorForClientFilter() {
    return this.http.get(BASE_API + "/distibutor/getdistributorbyclient");
  }
  getDistributorById(id: any) {
    return this.http.get(BASE_API + "/distibutor/getdistributorById?id=" + id);
  }

  getdistributorByUsername(username: any) {
    return this.http.get(BASE_API + "/distibutor/getdistributorbyusername?username=" + username);
  }
  activateClient(clientname: any, status: any, versionId: any) {
    return this.http.get(BASE_API + "/client/activateclient?clientname=" + clientname + "&status=" + status + "&versionid=" + versionId);
  }
  updateDeviceModelname(username: any, modelname: any) {
    return this.http.get(BASE_API + "/device/updatedevicemodelname?username=" + username + "&modelname=" + modelname);
  }
  activateDevice(clientname: any, username: any, status: any, versionId: any) {
    return this.http.get(BASE_API + "/device/activatedevice?clientname=" + clientname + "&username=" + username + "&status=" + status + "&versionid=" + versionId);
  }
  getAllDeviceModel() {
    return this.http.get(BASE_API + "/none-auth/getdeviecemodels");
  }
  convertDataToVideo(list: any) {
    return this.http.post(BASE_API + "/playlist/convertdata", list);
  }
  registorDevice(payload: any) {
    //   {
    //     "landmark": "busstand",
    //     "count": "1",
    //     "city": "GUNTUR",
    //     "state": "2",
    //     "area": "vinukonda",
    //     "height_width": "9:16",
    //     "acceptTerms": true,
    //     "modelname": "CAN3201",
    //     "clientid": 1
    // }

    const options = {
      params: new HttpParams({
        fromString: "country=" + payload.country + '&count=' + payload.count + '&landmark=' + payload.landmark + '&android_id=' + payload.android_id + '&city=' + payload.city + '&state=' + payload.state + '&location=' + payload.area + '&height_width=' + payload.height_width + '&modelname=' + payload.modelname + '&client_id=' + payload.clientid + '&createdby=' + "user",
      }),
    };
    return this.http.post(BASE_API + "/none-auth/device/create1", options.params);
  }
  registorDevice2(payload: any) {
    // console.log(payload);
    return this.http.post(BASE_API + "/none-auth/device/create2", payload);
  }
  updateDevice(payload: any) {

    const options = {
      params: new HttpParams({
        fromString: "versionid=" + payload.versionid + "&username=" + payload.username + "&country=" + payload.country + "&district=" + payload.district + '&landmark=' + payload.landmark + '&city=' + payload.city + '&state=' + payload.state + '&location=' + payload.location + '&height_width=' + payload.height_width + '&modelname=' + payload.modelname + "&createdby=" + this.User?.username
      }),
    };
    return this.http.post(BASE_API + "/none-auth/device/update", options.params);
  }

  getLocationListByCity(cityname: any) {
    return this.http.get(BASE_API + "/none-auth/getlocationbycity?cityname=" + cityname);
  }
  getLocationListByCity1(cityname: any) {
    return this.http.get(BASE_API + "/none-auth/getdevicelocationbycity?cityname=" + cityname);
  }
  getLocationListByCityId(cityname: any) {
    return this.http.get(BASE_API + "/none-auth/getlocationbycityid?cityname=" + cityname);
  }
  setPlaylistAsDefault(clientname: any, isactive: any, state_id: any, playlist_id: any, vertical: any, scheduleby: any) {
    return this.http.get(BASE_API + "/playlist/setplaylistasdefault?clientname=" + clientname + "&state_id=" + state_id + "&playlist_id=" + playlist_id + "&isactive=" + isactive + "&vertical=" + vertical + "&scheduledby=" + scheduleby);
  }

  getCustomerVersion() {
    return this.http.get(BASE_API + "/versionmaster/all");
  }
  // http://localhost:8082/api/v1/none-auth/getstatebyclientlist
  // getStatelistByClient
  // getCitybyStatelist(state_list: string[]) {

  //   return this.http.get(BASE_API + "/none-auth/getcitybystatelist?state_list=" + state_list);
  // }
  getCitybyStatelist(state_list: any) {

    return this.http.post(BASE_API + "/none-auth/getcitybystatelist", state_list);
  }
  // sudo lsof -t -i tcp:4200 | xargs kill -9


  getStatelistByClient(client_list: string[]) {
    // console.log(client_list);

    return this.http.get(BASE_API + "/none-auth/getstatebyclientlist?clientlist=" + client_list);
  }
  // getLocationByStateAndCity(city_list: any) {
  //   return this.http.get(BASE_API + "/none-auth/getlocationbystateandcity?city_list=" + city_list);
  // }
  getLocationByStateAndCity(city_list: any) {
    return this.http.post(BASE_API + "/none-auth/getlocationbystateandcity", city_list);
  }
  getDeviceByLocation(payload: any) {
    return this.http.post(BASE_API + "/none-auth/getdevicebylocationandclient", payload);
  }
  getDeviceByLocationFilter(payload: any) {
    return this.http.post(BASE_API + "/none-auth/getdeviceforplaylist", payload);
  }
  getDeviceByLocationAndClientByPlanAndVertical(payload: any) {
    return this.http.post(BASE_API + "/none-auth/getdevicebylocationandclientForOta", payload);
  }
  upgradeClientVersion(clientid: any, version: any, isalldevice: any) {
    // console.log(clientid);
    // console.log(version);
    return this.http.get(BASE_API + "/client/versionupdaterequest?clientid=" + clientid + "&version=" + version + "&isalldevice=" + isalldevice + "&createdby=" + this.User?.username);
  }
  updateComplaint(complaint_id: any) {
    return this.http.get(BASE_API + "/complaint/updatecomplaint?complaint_id=" + complaint_id + "&createdby=" + this.User?.username);
  }

  updateComplaint1(complaint_id: any, file: File, comments: any) {
    // console.log(complaint_id);
    let fd = new FormData();
    fd.set('complaint_id', complaint_id)
    fd.set("file", file)
    fd.set('comments', comments)
    fd.set('createdby', this.User?.username)
    return this.http.post(BASE_API + "/complaint/updateclientcomplaint", fd);
  }
  updateComplaint2(complaint_id: any, comments: any) {
    // console.log(complaint_id);
    let fd = new FormData();
    fd.set('complaint_id', complaint_id)
    // fd.set("file", file)
    fd.set('comments', comments)
    return this.http.get(BASE_API + "/complaint/updateclientcomplaint1?complaint_id=" + complaint_id + "&comments=" + comments + "&createdby=" + this.User?.username);
  }
  getStateListbyClientdeviceLocation(clientname: any) {

    return this.http.get(BASE_API + "/none-auth/getstatebydevice?clientname=" + clientname);
  }
  getOtaGroupMasterByOtaId(id: any) {
    return this.http.get(BASE_API + "/none-auth/getotagroupdetailsbyid?ota_id=" + id);
  }
  logOutDevice(username: any) {
    return this.http.get(BASE_API + "/device/logout?deviceid=" + username);
  }
  getAllCountryList() {
    return this.http.get(BASE_API + "/none-auth/getcountrylist/all");
  }
  getStateListByCountrynameOrId(countryname: any, countryid: any) {
    return this.http.get(BASE_API + "/none-auth/getstatebycountry?countryname=" + countryname + "&countryid=" + countryid);
  }
  getDistrictListByStatenameOrId(statename: any, stateid: any) {
    return this.http.get(BASE_API + "/none-auth/getdistrictbystate?statename=" + statename + "&stateid=" + stateid);
  }

  getDistrictListByStateIdList(payload: any) {
    return this.http.post(BASE_API + "/none-auth/getdistrictbystatellist", payload);
  }
  getCityListByDistrictnameOrId(districtname: any, districtid: any) {
    return this.http.get(BASE_API + "/none-auth/getcitybydistrict?districtname=" + districtname + "&districtid=" + districtid);
  }
  getStateListByDistributorid(districtid: any) {
    return this.http.get(BASE_API + "/client/getclientstatebydistributor?distributor_id=" + districtid);
  }

  getDistrictListByStateAndDistributorid(districtid: any, state_id: any) {
    return this.http.get(BASE_API + "/client/getclientdistrictbydistributor?distributor_id=" + districtid + "&state_id=" + state_id);
  }

  getCityListByDistricteAndDistributorid(districtid: any, district_id: any) {
    return this.http.get(BASE_API + "/client/getclientcitybydistributor?distributor_id=" + districtid + "&district_id=" + district_id);
  }
  getLocationListByCityAndDistributorid(districtid: any, city_id: any) {
    return this.http.get(BASE_API + "/client/getclientlocationbydistributor?distributor_id=" + districtid + "&city_id=" + city_id);
  }


  getCityListByDistrictList(payload: any) {
    return this.http.post(BASE_API + "/none-auth/getcitybydistrictlist", payload);
  }

  filterClientList(payload: any) {
    return this.http.get(BASE_API + "/client/getallclientlist?distributorid=" + payload.distributorid + "&stateid=" + payload.stateid + "&districtid=" + payload.districtid + "&cityid=" + payload.cityid + "&locationid=" + payload.locationid + "&planid=" + payload.planid + "&fromdate=" + payload.fromdate + "&todate=" + payload.todate);
  }
  filterClientListByMultiple(payload: any) {
    return this.http.post(BASE_API + "/client/getallclientinfo", payload);
  }
  filterDeviceList(payload: any) {
    return this.http.get(BASE_API + "/device/getalldeviceinfo?distributorid=" + payload.distributorid + "&stateid=" + payload.stateid + "&districtid=" + payload.districtid + "&cityid=" + payload.cityid + "&locationid=" + payload.locationid + "&versionid=" + payload.versionid + "&fromdate=" + payload.fromdate + "&todate=" + payload.todate + "&height_width=" + payload.height_width + "&isonline=" + payload.isonline + "&clientname=" + payload.clientname + "&isactive=" + payload.isactive);
  }
  // device/getalldeviceinfolist

  filterDeviceListByMultiple(payload: any) {
    return this.http.post(BASE_API + "/device/getalldeviceinfolist", payload)
  }
  getClientListByDistributorList(payload: any) {
    return this.http.post(BASE_API + "/client/clientbydistributorlist", payload)
  }

  freezeScroller(isfreeze: any, playlist_id: any) {
    return this.http.get(BASE_API + "/playlist/setisfreezeforplaylist?playlist_id=" + playlist_id + "&isfreeze=" + isfreeze);
  }

  filterLog(clientname: any, username: any, fromdate: any, todate: any) {
    return this.http.get(BASE_API + "/device/getdevicelog?username=" + username + "&clientname=" + clientname + "&fromdate=" + fromdate + "&todate=" + todate);
  }
  filterDeviceLog(payload: any) {

    return this.http.post(BASE_API + "/device/getdeviceloglist", payload);
  }
  getStateForDistributor() {
    return this.http.get(BASE_API + "/distibutor/getstatelistfordistributor");
  }
  getDistrictbyStateForDistributor(stateid: any) {
    return this.http.get(BASE_API + "/distibutor/getdistrictlistbystatefordistributor?stateid=" + stateid);
  }

  getCitybyDistrictForDistibutor(districtid: any) {
    return this.http.get(BASE_API + "/distibutor/getcitylistbydistrictfordistributor?districtid=" + districtid);
  }

  getLocationbyCityForDistibutor(cityid: any) {
    return this.http.get(BASE_API + "/distibutor/getlocationlistbycityfordistributor?cityid=" + cityid);
  }

  getAllDistributorList(payload: any) {
    return this.http.get(BASE_API + "/distibutor/getalldistributorlist?stateid=" + payload.stateid + "&districtid=" + payload.districtid + "&cityid=" + payload.cityid + "&locationid=" + payload.locationid + "&fromdate=" + payload.fromdate + "&todate=" + payload.todate);
  }
  getAllDistributorListByList(payload: any) {
    return this.http.post(BASE_API + "/distibutor/getalldistributorlist1", payload);
  }

  getCurrentTimeByTimeApi() {


    return this.http.get("https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata");;
  }

  getDevieceBymodelwise() {
    return this.http.get(BASE_API + "/none-auth/getdeviecebymodelwise");
  }
  filterOta(payload: any) {
    return this.http.get(BASE_API + "/none-auth/getotabyplan?planid=" + payload?.planid)
  }
  editClientBySelf(payload: any) {
    return this.http.get(BASE_API + "/client/editclientdetails?email=" + payload?.email + "&phone=" + payload?.phone + "&username=" + payload?.username + "&createdby=" + this.User?.username)
  }



  getAllDistrictByStateListByMultipleForDestributor(payload: any) {
    return this.http.post(BASE_API + "/distibutor/getdistrictlistbystatelistfordistributor", payload);
  }

  getAllCityByDestrictListByMultipleForDestributor(payload: any) {
    return this.http.post(BASE_API + "/distibutor/getcitylistbydistrictlistfordistributor", payload);
  }

  getAllLocationByCityListByMultipleForDestributor(payload: any) {
    return this.http.post(BASE_API + "/distibutor/getlocationlistbycitylistfordistributor", payload);
  }

  getClientDistrictbyDistributorAndStateList(payload: any) {
    return this.http.post(BASE_API + "/client/getclientdistrictbydistributorandstate", payload);
  }

  getClientCitybyDistributorAndDistrictList(payload: any) {
    return this.http.post(BASE_API + "/client/getclientcitybydistributoranddistrict", payload);
  }

  getClientLocationListbyDistributorAndCityList(payload: any) {
    return this.http.post(BASE_API + "/client/getclientlocationbydistributorandcity", payload);
  }

  getClientStateListbyDistributor(payload: any) {
    return this.http.post(BASE_API + "/client/getclientstatebydistributorlist", payload);
  }

  getFontList() {
    return this.http.get(BASE_API + "/scroller/getscrollerfont")
  }

  getFontDataUri(fontUrl: string): any {
    return this.http.get(fontUrl, { responseType: 'blob' }).pipe(
      map((blob: Blob) => {
        return this.blobToBase64(blob);
      })
    );
  }
  convertUrlToDataUri(fontFileUrl: string): any {
    // console.log(fontFileUrl);

    return new Observable<string>((observer) => {
      this.http.get(fontFileUrl, { responseType: 'arraybuffer' })
        .subscribe(
          (fontDataArrayBuffer: ArrayBuffer) => {
            const fontDataBlob = new Blob([fontDataArrayBuffer]);
            const fontDataUri = URL.createObjectURL(fontDataBlob);
            observer.next(fontDataUri);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }
  private blobToBase64(blob: Blob): any {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader!.result!.toString().split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  getCustomerLastDevice(clientid: any) {

    return this.http.get(BASE_API + "/device/getlastdevicebyclient?clientid=" + clientid)
  }

  saveSplitScreenZone(payload: any) {
    return this.http.post(BASE_API + "/split/createzone", payload)
  }


  editSplitScreenZone(payload: any) {
    // console.log(payload);
    return this.http.post(BASE_API + "/split/zoneedit", payload)
  }
  saveLayout(payload: any) {
    // console.log(payload);
    return this.http.post(BASE_API + "/split/createlayout", payload)
  }
  // saveSplitScreen(layout: any, zonelist: any) {
  //   // /split/create
  //   // return this.http.get(BASE_API + "/playlist/splitcreate", payload)
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   return this.http.get(BASE_API + "/split/create?SplitObj=" + layout + "&ZoneObj=" + zonelist)
  // }

  editMediaFilesOrder(payload: any) {
    return this.http.post(BASE_API + "/playlist/editorderid", payload)
  }


  // editLayoutOrder(payload: any) {
  //   return this.http.post(BASE_API + "/split/editorderid?layoutlist", payload)
  // }


  editLayoutOrder(payload: any) {
    const params = new HttpParams()
      .set('layoutlist', payload)
      .set('createdby', this.User?.username || '');

    return this.http.post(BASE_API + "/split/editorderid", payload, { params });
  }


  getSplitLayoutsByPlaylistId(playlistid: any, isvertical: any) {
    return this.http.get(BASE_API + "/split/getsplitbyplaylist?playlistid=" + playlistid + "&isvertical=" + isvertical)
  }

  deleteSplitLayout(layoutid: any) {
    return this.http.get(BASE_API + "/split/delete?layoutid=" + layoutid + "&createdby=" + this.User?.username)
  }
  deleteZoneFiles(zoneid: any, fileid: any) {
    return this.http.get(BASE_API + "/split/deletefilefromlayout?zoneid=" + zoneid + "&fileid=" + fileid + "&createdby=" + this.User?.username)
  }
  getDefaultLayOutByOrientation(isvertical: any) {
    return this.http.get(BASE_API + "/split/getdefaultlayout?isvertical=" + isvertical)
  }
  rotateFile(payload: any) {
    return this.http.post(BASE_API + "/playlist/rotate", payload);
  }
  getDeviceStatusAnalysisreport(clientname: any, type: any) {
    return this.http.get(BASE_API + "/none-auth/devicestatusreport?clientname=" + clientname + "&type=" + type);
  }

  getDistrictListByState(statename: any, id: any) {
    return this.http.get(BASE_API + "/none-auth/getdistrictbystatenameandid?statename=" + statename + "&id=" + id);
  }

  getCityListByDistrictNdState(name: any, districtid: any, stateid: any) {
    return this.http.get(BASE_API + "/none-auth/getcitybydistrictnameandid?districtname=" + name + "&districtid=" + districtid + "&stateid=" + stateid);
  }

  getLocationListByDistrictNdCityNdState(name: any, districtid: any, stateid: any, cityid: any) {
    return this.http.get(BASE_API + "/none-auth/getlocationbycitynameandid?cityname=" + name + "&districtid=" + districtid + "&stateid=" + stateid + "&cityid=" + cityid);
  }

  // getEditorUploadFiles(clientname: any) {
  //   return this.http.get(BASE_API + "/none-auth/geteditorimagebyclient?clientname=" + clientname)
  // }
   getEditorUploadFiles(clientname: any) {
    return this.http.get(BASE_API + "/editorfiles/geteditorimagebyclient?clientname=" + clientname)
   }
  activateClientByAdmin(clientname: any, isdelete: any) {
    return this.http.get(BASE_API + "/client/deactivateclient?clientlist=" + clientname + "&isdelete=" + isdelete + "&createdby=" + this.User?.username)
  }
  activateDistributorByAdmin(distributor: any, isdelete: any) {
    return this.http.get(BASE_API + "/distibutor/deactivatedistributor?username=" + distributor + "&isdelete=" + isdelete + "&createdby=" + this.User?.username)
  }
  swapClient(distributor: any, clientlist: any) {
    return this.http.get(BASE_API + "/client/clientswap?distributor=" + distributor + "&clientlist=" + clientlist + "&createdby=" + this.User?.username)
  }
  activateLayout(layoutlist: any, playlistid: any) {
    return this.http.get(BASE_API + "/split/activatelayout?layoutlist=" + layoutlist + "&playlistid=" + playlistid + "&createdby=" + this.User?.username)
  }
  deactivateLayout(layoutid: any, playlistid: any) {
    return this.http.get(BASE_API + "/split/deactivatelayout?layoutid=" + layoutid + "&playlistid=" + playlistid + "&createdby=" + this.User?.username)
  }
  getStateListForPlaylist(countryname: any, id: any, clientname: any) {
    return this.http.get(BASE_API + "/none-auth/getstatebycountrynameandidforplaylist?countryname=" + countryname + "&id=" + id + "&clientname=" + clientname);
  }
  getDistrictListByStateForPlaylist(statename: any, id: any, clientname: any) {
    return this.http.get(BASE_API + "/none-auth/getdistrictbystatenameandidforplaylist?statename=" + statename + "&id=" + id + "&clientname=" + clientname);
  }

  getCityListByDistrictNdStateForPlaylist(name: any, districtid: any, stateid: any, clientname: any) {
    return this.http.get(BASE_API + "/none-auth/getcitybydistrictnameandidforplaylist?districtname=" + name + "&districtid=" + districtid + "&stateid=" + stateid + "&clientname=" + clientname);
  }
  getLocationListByDistrictNdCityNdStateForPlaylist(name: any, districtid: any, stateid: any, cityid: any, clientname: any) {
    return this.http.get(BASE_API + "/none-auth/getlocationbycitynameandidforplaylist?cityname=" + name + "&districtid=" + districtid + "&stateid=" + stateid + "&cityid=" + cityid + "&clientname=" + clientname);
  }
  getComplaintDetailsById(complaintid: any) {
    return this.http.get(BASE_API + "/complaint/getcomplaintdetailsbyid?complaintid=" + complaintid)
  }


  updateComplaintforClientNdDeviceCreation(payload: any) {
    return this.http.post(BASE_API + "/complaint/updatecomplaintforclientanddevicecreation", payload)

  }

  getClientStorageDetails(clientname: any) {
    return this.http.get(BASE_API + "/client/getclientstoragedetails?clientname=" + clientname)
  }

  updateZoneMuteStatus(zoneid: any, ismute: any) {
    return this.http.get(BASE_API + "/split/setmuteforzone?zoneid=" + zoneid + '&ismute=' + ismute + "&createdby=" + this.User?.username)
  }

  getRegistrationFormExpirycode() {
    return this.http.get(BASE_API + "/none-auth/getregistrationformcode")
  }

  checkRegistrationFormStatusByCode(code: any) {
    return this.http.get(BASE_API + "/none-auth/checkregistrationformstatus?code=" + code)
  }
  deleteOrRotateFilesBytype(payload: any) {
    return this.http.post(BASE_API + "/playlist/deleteandrotatefilesbytype", payload)
  }
  getplaylistdetailsbyclientforeditor(clientname: any) {
    return this.http.get(BASE_API + "/playlist/getplaylistdetailsbyclientforeditor?clientname=" + clientname)
  }

  updatePlaylistName(payload: any) {
    return this.http.get(BASE_API + "/playlist/changeplaylistname?name=" + payload.name + '&playlist_id=' + payload.playlist_id + "&createdby=" + this.User?.username)
  }
  getTemplateByMediaId(payload: any) {
    return this.http.get(BASE_API + "/editorfiles/gettemplatebyid?mediafile=" + payload.mediafile + '&template=' + payload.template)
  }

  getAllTemplates() {
    return this.http.get(BASE_API + "/editorfiles/getalltemplate")
  }

  searchTemplatesByNameNdClientName(payload: any) {
    return this.http.get(BASE_API + "/editorfiles/gettemplatelistbyname?templatename=" + payload.templatename + '&clientname=' + payload.clientname)
  }
  // activateOrDeactivatedevice(payload: any) {
  //   console.log(payload);
  //   let status = payload.isdelete ? 0 : 1;
  //   return this.http.get(BASE_API + "/device/deviceactivationbyadmin?username=" + payload.username + "&status=" + status)
  // }
  activateOrDeactivatedevice(devicelist: any, status: any) {
    console.log(status);
    return this.http.get(BASE_API + "/device/deviceactivationbyadmin?devicelist=" + devicelist + "&status=" + status + "&createdby=" + this.User?.username)
  }

  setIsViewForClient(clientname: any) {
    return this.http.get(BASE_API + "/client/setisviewforclient?clientname=" + clientname)
  }

  getDistributorForByComplaintid(complaintid: any) {
    return this.http.get(BASE_API + "/complaint/getcomplaintdetailsfordistributorbyid?complaintid=" + complaintid)
  }
  changeOtaStatusForDevice(devicelist: any, status: any) {
    // console.log(status);
    return this.http.get(BASE_API + "/device/changeotastatusfordevice?devicelist=" + devicelist + "&status=" + status + "&createdby=" + this.User?.username)
  }
  getDomainDetails() {
    return this.http.get(BASE_API + "/none-auth/getdomaindetails")
  }

  changeOtaStatusForClient(clientlist: any, status: any) {
    return this.http.get(BASE_API + "/client/changeotastatusforclient?clientlist=" + clientlist + "&status=" + status + "&createdby=" + this.User?.username)
  }

  registorStore(value: any) {
    return this.http.post(BASE_API + "/store/create", value)
  }
  createCategory(value: any) {
    return this.http.post(BASE_API + "/category/create", value)
  }
  editCategory(name: any, categoryid: any, createdby: any) {
    return this.http.get(BASE_API + "/category/update?name=" + name + "&categoryid=" + categoryid + "&createdby=" + createdby)
  }
  getStoreListByClientId(clientid: any) {
    return this.http.get(BASE_API + "/store/getbyclient?clientid=" + clientid)
  }
  getCategoryListByClientId(clientid: any) {
    return this.http.get(BASE_API + "/category/getbyclient?clientid=" + clientid)
  }
  getCategoryListByStoreId(storeid: any) {
    return this.http.get(BASE_API + "/category/getbystore?storelist=" + storeid)
  }
  getMasterSettings(clientid: any) {
    return this.http.get(BASE_API + "/client/getmastersettings?clientid=" + clientid)
  }
  editMasterSettings(value: any) {
    return this.http.post(BASE_API + "/client/editmastersettings", value)
  }

  getDeviceListByStoreId(storeid: any) {
    return this.http.get(BASE_API + "/device/getdevicebystore?storeid=" + storeid)
  }

  allocateDeviceForStore(storeid: any, devicelist: any) {
    return this.http.get(BASE_API + "/store/allocatedeviceforstore?storeid=" + storeid + '&devicelist=' + devicelist + "&createdby=" + this.User?.username)
  }
  allocateDeviceForCategory(catrgoryid: any, devicelist: any) {
    return this.http.get(BASE_API + "/category/allocatedeviceforcategory?catrgoryid=" + catrgoryid + '&devicelist=' + devicelist + "&createdby=" + this.User?.username)
  }

  userCreationByStore(value: any) {
    return this.http.post(BASE_API + "/storeuser/create", value)
  }
  getStoreUserByStoreid(storeid: any) {
    return this.http.get(BASE_API + "/storeuser/getallusersbystore?storeid=" + storeid)
  }

  createPlaylistMBC(fd: any) {
    return this.http.post(BASE_API + "/playlist/create", fd);
  }
  getPlaylistByStoreId(storeid: any, mediatype: any) {
    http://192.168.1.105:8082/api/v1/playlist/getplaylistbystore?storeid=1
    return this.http.get(BASE_API + "/playlist/getplaylistbystore?storeid=" + storeid + "&mediatype=" + mediatype)
  }

  getDeviceListByCategoryListNdStatus(categoryid: any, status: any) {
    return this.http.get(BASE_API + "/device/getdevicelistbycategory?categorylist=" + categoryid + "&status=" + status)
  }

  getAllContentTags() {
    return this.http.get(BASE_API + "/none-auth/getalltag")
  }
  getBrandList() {
    return this.http.get(BASE_API + "/none-auth/getallbrand")
  }
  getPlaylistScheduleSetailsByStoreId(storeid: any) {
    return this.http.get(BASE_API + "/playlist/getplaylistscheduledetailsbystore?storeid=" + storeid)
  }
  getPlaylistScheduleDetailsByClient(clientid: any) {
    return this.http.get(BASE_API + "/playlist/getplaylistscheduledetailsbyclient?clientid=" + clientid)
  }
  // getplaylistscheduledetails
  getPlaylistScheduleDetailsByPlaylistId(playlistid: any) {
    return this.http.get(BASE_API + "/playlist/getplaylistscheduledetails?playlistid=" + playlistid)
  }
  approvePlaylistSchedule(payload: any) {
    return this.http.post(BASE_API + "/playlist/approveplaylistschedule", payload);
  }
  getPlaylistForClientbyStoreAndCategory(playload: any) {
    return this.http.get(BASE_API + "/playlist/getplaylistforclientbystoreandcategory?clientname=" + playload?.clientname + "&mediatype=" + playload?.mediatype + "&categorylist=" + playload?.categorylist + "&storelist=" + playload?.storelist)
  }
  getCategoryListByStoreList(storelist: any) {
    return this.http.get(BASE_API + "/category/getbystore?storelist=" + storelist)
  }
  getPlaylistScheduleHistoryByStoreId(storeid: any) {
    return this.http.get(BASE_API + "/playlist/getplaylistschedulehistorybystore?storeid=" + storeid)
  }
  getStoreStorageInfoByStoreId(storeid: any) {
    return this.http.get(BASE_API + "/device/getdashboarddetailsbystore?storeid=" + storeid)
  }


  getPlaylistFilesForGallery(payload: any) {
    return this.http.post(BASE_API + "/playlist/getplaylistfilesforgallery", payload)
  }


  downloadFile(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  getNotificationCountForScheduleApproval(id: any) {
    return this.http.get(BASE_API + "/playlist/getnotificationcountforscheduleapproval?storeid=" + id)
  }
  // http://192.168.1.105:8082/api/v1/store/update?name=store&Storeid=1
  editStore(name: any, storeid: any, createdby: any) {
    return this.http.get(BASE_API + "/store/update?name=" + name + "&Storeid=" + storeid + "&createdby=" + createdby)
  }

  // http://192.168.1.105:8083/api/v1/store/getmastersettings?storeid=1

  getMasterSettingsByStoreId(storeid: any) {
    return this.http.get(BASE_API + "/store/getmastersettings?storeid=" + storeid)
  }
  // http://192.168.1.105:8083/api/v1/store/editmastersettings

  editStoreMasterSettings(payload: any) {
    return this.http.post(BASE_API + "/store/editmastersettings", payload)
  }
  getLandmarkByLocationAndClientname(city_list: any) {
    return this.http.post(BASE_API + "/none-auth/getlandmarkbylocation", city_list);
  }
  duplicateMediaFiles(payload: any) {
    return this.http.get(BASE_API + "/playlist/setcountformediafile?mediafileid=" + payload.mediafileid + "&count=" + payload?.count + "&createdby=" + payload?.createdby)
  }
  getScreenShotsByDeviceUsername(username: any) {
    return this.http.get(BASE_API + "/device/getDeviceScreenShots?username=" + username)
  }
  addClientToOtaGroup(groupname: any, clientlist: any) {
    return this.http.get(BASE_API + "/none-auth/addclienttootagroup?groupname=" + groupname + "&clientlist=" + clientlist)
  }

  getComplaintTypes() {
    return this.http.get(BASE_API + "/complaint/getcomplainttypes")
  }
  changeDistributorPermission(payload: any) {
    return this.http.get(BASE_API + "/distibutor/changedistributorpermission?username=" + payload?.username + "&permission=" + payload?.permission)
  }

  // http://192.168.1.105:8082/api/v1/playlist/updatemediafileduartion?medialist=49,50,51,52&duration=00:00:10

  updateMediafileDuartion(medialist: any, duration: any) {
    return this.http.get(BASE_API + "/playlist/updatemediafileduartion?medialist=" + medialist + "&duration=" + duration)
  }
  getAllowedUploadMediaFiles() {
    return this.http.get(BASE_API + "/none-auth/getfiletypes")
  }
  getLocationByPincode(pin: any) {
    return this.http.get(BASE_API + "/none-auth/getbypincode?pincode=" + pin)
  }
  // http://192.168.1.105:8083/api/v1/none-auth/statebyclient?username=
  getAllStateListByClient(clientUsername: any) {
    return this.http.get(BASE_API + "/none-auth/statebyclient?username=" + clientUsername);
  }

  getGatewayDetails() {
    return this.http.get(BASE_API + "/paymentgateway/gatewaydetails");
  }

  getCustomerPlanPrices(clientid: any) {

    return this.http.get(BASE_API + "/client/planinfo?clientid=" + clientid);
  }
  initiateEasebuzz(payload: any) {
    return this.http.post(BASE_API + "/paymentgateway/eazepayment/intiatepayment", payload);
  }

  onSucessSendEaseBuzzResponse(payload: any) {
    return this.http.post(BASE_API + "/paymentgateway/eazepayment/success", payload);
  }
  getEasebuzzPaymentStatus(txnid: any) {
    return this.http.get(BASE_API + "/paymentgateway/eazepayment/refresh?txnid=" + txnid);
  }

  onFailedSendEaseBuzzResponse(payload: any) {
    return this.http.post(BASE_API + "/paymentgateway/eazepayment/failed", payload);
  }

  updateDevicePwronoff(devicelist:any,pwroff:any,pwron:any){
    return this.http.get(BASE_API + "/device/updatedevicepwronoff?devicelist=" + devicelist+"&pwroff="+pwroff+"&pwron="+pwron);
  }
}




