import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HttpClientService {
  constructor(private http: HttpClient) { }

  //讀取
  getApi(url: string){
    return this.http.get(url);
  }

  postApi(url: string, postData: any) {
    return this.http.post(url, postData);
  }

  postApi2(url: string, postData: any) {
    return this.http.post(url, postData, {
      observe: 'response',
      withCredentials: true //  設定攜帶憑證（如 Cookies）
    });
  }

   // 獲取用戶圖片
   getImage(url: string, postData: any): Observable<HttpResponse<ArrayBuffer>> {
    return this.http.post(url, postData, {
      responseType: 'arraybuffer',  // 指定請求返回的數據格式為 arraybuffer，圖片二進位格式
      observe: 'response',  // 獲取完整的 HTTP 響應，包括 headers
      withCredentials: true // 設定攜帶憑證（如 Cookies）
    });
  }
}
