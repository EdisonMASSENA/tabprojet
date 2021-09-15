import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const url = environment.Url + 'api/file';


@Injectable({
  providedIn: 'root'
})


export class UploadService {

  constructor( private http: HttpClient) {}

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${url}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${url}/info`);
  }

  download(id): Observable<any> {
    return this.http.get(`${url}/${id}`);
  }

  delete(id): Observable<any> {
    return this.http.delete(`${url}/${id}`);
  }

}
