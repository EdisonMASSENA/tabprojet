import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';


const url = environment.Url + 'tableau';

@Injectable({
  providedIn: 'root'
})

export class TableauService {

  
  constructor(private http: HttpClient) { }

  
  getAll(): Observable<any> {
    return this.http.get(`${url}`);
  }

  create(data): Observable<any> {
    return this.http.post(`${url}`, data);
  }

  update(id, data): Observable<any> {
    return this.http.put(`${url}/${id}`, data);
  }

  delete(id): Observable<any> {
    return this.http.delete(`${url}/${id}`);
  }


}