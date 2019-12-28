import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})

export class AppService {
  url:string = 'https://stuxnetapi.herokuapp.com'; 

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  

  constructor(
    private http: HttpClient,
    private router: Router,
    ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
}

  login(tc, pw) {
    console.log(tc, pw);
        return this.http.post<any>(this.url+'/login', { tc, pw })
            .pipe(map(user => {
                console.log(user);
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    localStorage.setItem("tc", tc);
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    const currentUser = this.currentUserValue;
                    this.getAccount(currentUser.token, tc);
                }
                return user;    
            }));
            
  }

  getAccount(token, tc) {
    var config = {
      headers:{'token': "" + token}
    }
    var bodyParameters = {
      tc: parseInt(tc),
    }

    axios.post(this.url+'/api/account',
      bodyParameters,
      config
    ).then((response) => {
      localStorage.setItem('accNo', response.data[0].accNo);
      console.log("account_> ", localStorage.getItem('accNo'));
    }).catch((error) => {
      console.log(error)
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('accNo');
    this.currentUserSubject.next(null);
    console.log("logout!");
  }
}
