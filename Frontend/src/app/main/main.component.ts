import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import {MatDialog} from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { AppService } from '../app.service';
import * as io from 'socket.io-client';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  ngOnInit() {
    
  }

  
  sidenav_open = true;
  msg = '';
  hasText = false;
  sent = false;
  username;
  messages = [];
  currentMessages = [];
  users;
  selectedUser;

  constructor(private dialog: MatDialog, private app: AppService,private cd: ChangeDetectorRef) {

    
    if(!sessionStorage.getItem('username')){
      let dialogRef = this.dialog.open(LoginComponent, {
        width: '600px'
      });

      dialogRef.afterClosed().subscribe(result => { 
        // this.app.connected_users_list = (result);
        // this.users = this.app.connected_users_list;
        // this.users = this.users.filter(x => x[0].userName != this.username);
        // this.username = sessionStorage.getItem('username').toLowerCase();

        this.getUsers().subscribe(
          (users) => {
            this.username = sessionStorage.getItem('username').toLowerCase();
            console.log('observer created 3', users);
            this.app.connected_users_list = users;
            this.users = this.app.connected_users_list;
            console.log('x.userName', this.users);
            console.log('usernameeee', this.username)
            this.users = this.users.filter(x => x[0].userName.toLowerCase() != this.username);
  
            this.selectedUser = this.users[0][0];
            this.cd.detectChanges();
          }
        );
        this.getMessages().subscribe(
          (msg) => {
            if(msg['to'].toLowerCase() === this.username.toLowerCase() || msg['from'].toLowerCase() === this.username.toLowerCase() ){
              console.log('PUSHED');
              this.messages.push(msg);
            }
            console.log('PUSuuuuuuuuHED', this.currentMessages);
            this.currentMessages = this.messages.filter(x => x['to'].toLowerCase() == this.selectedUser['userName'].toLowerCase() || x['from'].toLowerCase() == this.selectedUser.toLowerCase());
            console.log('PUSuuu33333333333uuuuuHED', this.currentMessages);
          }
        );
      });
    } else {
      console.log('sessionStorage.getItem("userid")', sessionStorage.getItem('userid'));
      this.app.socket = io.connect(this.app.socket_url, { query: "id=" +  sessionStorage.getItem('userid')});
      this.getUsers().subscribe(
        (users) => {
          this.username = sessionStorage.getItem('username').toLowerCase();
          console.log('observer created 3', users);
          this.app.connected_users_list = users;
          this.users = this.app.connected_users_list;
          console.log('x.userName', this.users);
          console.log('usernameeee', this.username)
          this.users = this.users.filter(x => x[0].userName.toLowerCase() != this.username);

          this.selectedUser = this.users[0][0];
          this.cd.detectChanges();
        }
      );
      this.getMessages().subscribe(
        
        (msg) => {
          if(msg['to'].toLowerCase() === this.username.toLowerCase() || msg['from'].toLowerCase() === this.username.toLowerCase() ){
            console.log('PUSHED');
            this.messages.push(msg);
          }
          this.currentMessages = this.messages.filter(x => x['to'].toLowerCase() == this.selectedUser['userName'].toLowerCase() || x['from'].toLowerCase() == this.selectedUser['userName'].toLowerCase());

        }
      );
      console.log('SUBSCRIBED');
    }

   

  }


  getMessages(): Observable<String> {
    return Observable.create((observer) => {
      console.log('observer created');
      this.app.socket.on('broadcast', (message) => {
        console.log('message', message);
        observer.next(message);
      });
    });
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

  send(field){
    this.sent = true;
    let obj = {
      msg: this.msg,
      from: sessionStorage.getItem('username').toLowerCase(),
      to: this.selectedUser.userName
    }
    this.app.socket.emit('message', obj);
    // this.messages.push(obj);
    this.msg = '';
  }

  selectUser(user){
    this.selectedUser = user;
    this.currentMessages = this.messages.filter(x => x['to'].toLowerCase() == this.selectedUser['userName'].toLowerCase() || x['from'].toLowerCase() == this.selectedUser['userName'].toLowerCase());

  }

  isSelected(user){

    // console.log('TTEESSTT', user);
    // console.log('this.selectedUser', this.selectedUser);
    // console.log()
    
    if (this.selectedUser){
      if (user.userName.toLowerCase() == this.selectedUser['userName'].toLowerCase()){
        console.log('UUSSEERR', user);
        return true;
      }
    }
    
    return false;
  }

}
