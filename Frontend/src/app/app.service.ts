import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class AppService {

   socket_url = 'http://localhost:4001';  
   socket;
   connected_users_list;


  url = 'http://localhost:4001/api/';

  constructor(private http: HttpClient) { }

  api_get(path){
    return this.http.get(this.url + path);
  }

  api_put(path, body){
    return this.http.put(this.url + path, body);
  }

  api_post(path, body){
    console.log(body)
    return this.http.post(this.url + path, body);
  }

  api_delete(path){
    return this.http.delete(this.url + path);
  }
}
