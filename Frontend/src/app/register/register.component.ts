import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  username;
  password;
  email;

  constructor(private router:Router, private appService: AppService,private registerRef: MatDialogRef<RegisterComponent>,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  register(){
    const requestBody = {
      userName: this.username,
      password: this.password,
      email: this.email
    }

    this.appService.api_post('register', requestBody)
      .subscribe(
        (data) => {
          console.log(data);
          this.registerRef.close();
          this.dialog.open(LoginComponent, {
            width: '600px'
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  login(){
    this.registerRef.close();
          this.dialog.open(LoginComponent, {
            width: '600px'
          });
  }

}
