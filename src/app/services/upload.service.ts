import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const url = environment.Url + 'api/file';


@Injectable({
  providedIn: 'root'
})


export class UploadService {

  constructor(private http: HttpClient) {}

  upload(file: File, id): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('tabId', id);
    
    const req = new HttpRequest('POST', `${url}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(id): Observable<any> {
    return this.http.get(`${url}/${id}`);
  }

  delete(id): Observable<any> {
    return this.http.delete(`${url}/${id}`);
  }

}
