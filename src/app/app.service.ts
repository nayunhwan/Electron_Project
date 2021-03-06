import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Injectable()
export class AppService {

  constructor(private http: Http) {

  }

  postRequest(url: string, apiKey, img) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/octet-stream');
    // headers.append('Ocp-Apim-Subscription-Key', 'c8a88151c9c84934aef42a17c161eb5f');
    headers.append('Ocp-Apim-Subscription-Key', apiKey);
    return this.http.post(url, img, {headers: headers});
  }

  // emotionRequest(url: string, img) {
  //   const headers = new Headers();
  //   headers.append('Content-Type', 'application/octet-stream');
  //   headers.append('Ocp-Apim-Subscription-Key', 'c73ae0c7b3054f2e9578c20630e76ef3');
  //   return this.http.post(url, img, {headers: headers});
  // }

}
