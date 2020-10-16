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
  _id;

  constructor(private dialog: MatDialog, private app: AppService,private cd: ChangeDetectorRef) {

    
    if(!sessionStorage.getItem('username')){
      let dialogRef = this.dialog.open(LoginComponent, {
        width: '600px'
      });

      dialogRef.afterClosed().subscribe(result => {

        this.getUsers().subscribe(
          (users) => {
            this.username = sessionStorage.getItem('username').toLowerCase();
            this._id = sessionStorage.getItem('_id');
            this.app.connected_users_list = users;
            this.users = this.app.connected_users_list;
            this.users = this.users.filter(x => x[0]._id != this._id);
  
            this.selectedUser = this.users[0][0];
            this.cd.detectChanges();
          }
        );
        this.getMessages().subscribe(
          (msg) => {
            if(msg['to'] === this._id || msg['from'] === this._id ){
              this.messages.push(msg);
            }
            this.currentMessages = this.messages.filter(x => x['to'] == this.selectedUser['_id'] || x['from'] == this.selectedUser['_id']);
          }
        );
      });
    } else {
      this._id = sessionStorage.getItem('_id');
      this.app.socket = io.connect(this.app.socket_url, { query: `_id=${this._id}`});
      this.getUsers().subscribe(
        (users) => {
          this.username = sessionStorage.getItem('username').toLowerCase();
          this.app.connected_users_list = users;
          this.users = this.app.connected_users_list;
          this.users = this.users.filter(x => x[0]._id != this._id);

          if (this.users.length > 0)
            this.selectedUser = this.users[0][0];
          this.cd.detectChanges();
        }
      );
      this.getMessages().subscribe(
        
        (msg) => {
          if(msg['to'] === this._id || msg['from'] === this._id ){
            this.messages.push(msg);
          }
          this.currentMessages = this.messages.filter(x => x['to'] == this.selectedUser['_id'] || x['from'] == this.selectedUser['_id']);

        }
      );
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

  shareLocation(){
    if (!navigator.geolocation){
      return alert('Your browser does not support geolocation');
    }
    console.log()
    let obj = {
      msg: null,
      from: sessionStorage.getItem('username').toLowerCase(),
      to: this.selectedUser.userName
    }

    navigator.geolocation.getCurrentPosition((position) => {
      obj.msg = `<a href="http://google.com/maps/?q=${position.coords.latitude},${position.coords.longitude}" about="_blank">http://google.com/maps/?q=${position.coords.latitude},${position.coords.longitude}</a>`
      this.app.socket.emit('message', obj);
    });
  }

}
