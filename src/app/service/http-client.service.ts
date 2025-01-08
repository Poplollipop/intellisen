import { provideHttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HttpClientService {
  constructor(private http: HttpClient) { }

  postApi(url: string, postData: any) {
    return this.http.post(url, postData);
  }

  postApi2(url: string, postData: any) {
    return this.http.post(url, postData, {
      observe: 'response',
      withCredentials: true //  設定攜帶憑證（如 Cookies）
    });
  }
}
