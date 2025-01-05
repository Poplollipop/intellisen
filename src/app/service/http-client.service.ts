import { provideHttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HttpClientService {
  constructor(private http: HttpClient) { }

  postApi(url: string, postData: any) {
    return this.http.post(url, postData);
  }

  postApi2(url: string, postData: any) {
    return this.http.post(url, postData, { observe: 'response' });
  }
}
