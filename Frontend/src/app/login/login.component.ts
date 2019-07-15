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
          console.log(data);
          sessionStorage.setItem('username', data["data"][0].userName.toLowerCase());
          sessionStorage.setItem('email', data["data"][0].email);
          sessionStorage.setItem('userid', data["data"][0].userId);
          
          this.app.socket = io.connect(this.app.socket_url, { query: "id=0" });
          this.getUsers().subscribe(
            (users) => {
              console.log('observer created 3');
              this.appService.connected_users_list = users;
            }
          );
          
          this.loginRef.close();
        },
        (error) => {
          console.log(error);
        }
      );
      
  }

  getUsers(): Observable<String> {
    return Observable.create((observer) => {
      console.log('observer created');
      this.app.socket.on('get_connected_users', (users) => {
        observer.next(users);
        console.log('observer created 2');
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
