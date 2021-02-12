import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {log} from 'util';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  server = 'http://localhost:3000/';

  constructor(
    private http: Http,
    private jwtHelpService: JwtHelperService) {
  }

  register(user) {
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.server + 'pangolins/register', user, {headers: headers});
  }

  login(user) {
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.server + 'pangolins/login', user, {headers: headers});
  }

  getProfile() {
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.server + 'pangolins/profile', {headers: headers});
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }


  loggedIn() {
    return !this.jwtHelpService.isTokenExpired(localStorage.getItem('id_token'));
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  removeFriend(id: number) {
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.server + 'pangolins/removeFriend', {id:id}, {headers: headers});
  }

  addFriend(id: number) {
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.server + 'pangolins/addFriend', {id:id}, {headers: headers});
    // return this.http.post(this.server + 'pangolins/addFriend', {id:id}, {headers: headers});
  }

  updatePangolin(newPang) {
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.server + 'pangolins/updatePangolin', {pangolin: newPang}, {headers: headers});
  }
}
