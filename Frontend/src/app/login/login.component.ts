import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';
import { RegisterComponent } from '../register/register.component';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email;
  password;

  constructor(private appService: AppService, private router: Router,
     private loginRef: MatDialogRef<LoginComponent>,
     private dialog: MatDialog, private app: AppService) { }

  ngOnInit() {
  }

  login(){
    const requestBody = {
      password: this.password,
      email: this.email
    }

    this.appService.api_post('login', requestBody)
      .subscribe(
        (data) => {
          sessionStorage.setItem('username', data['userName'].toLowerCase());
          sessionStorage.setItem('email', data['email']);
          sessionStorage.setItem('_id', data['_id']);
          
          this.app.socket = io.connect(this.app.socket_url, { query: `_id=${data['_id']}` });
          this.getUsers().subscribe(
            (users) => {
              this.appService.connected_users_list = users;
            }
          );
          
          this.loginRef.close();
        }
      );
      
  }

  getUsers(): Observable<String> {
    return Observable.create((observer) => {
      this.app.socket.on('get_connected_users', (users) => {
        observer.next(users);
      });
    });
  }

  register(){
    this.loginRef.close();
    this.dialog.open(RegisterComponent, {
        width: '600px'
    });
  }
}
