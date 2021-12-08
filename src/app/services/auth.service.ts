import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const url = environment.Url + 'api/auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor (private http: HttpClient) { }

  login(credentials): Observable<any> {
    return this.http.post(url + '/signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  user(): Observable<any>{
    return this.http.get(url + '/user');
  }

  admin(): Observable<any>{
    return this.http.get(url + '/admin');
  }
  
  create(user): Observable<any>{
    return this.http.post(url + '/user', user);
  }

  delete(id): Observable<any> {
    return this.http.delete(`${url}/user/${id}`);
  }
  
}
