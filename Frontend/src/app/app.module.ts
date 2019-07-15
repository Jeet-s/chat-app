import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MainComponent } from './main/main.component';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatFormFieldModule, MatDialogModule, MatInputModule, MatButtonModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

const config: SocketIoConfig = { url: 'http://localhost:4001', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent, RegisterComponent]
})
export class AppModule { }
