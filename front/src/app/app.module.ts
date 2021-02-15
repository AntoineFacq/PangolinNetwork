import { BrowserModule } from '@angular/platform-browser';
import {Injectable, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import {JWT_OPTIONS, JwtHelperService, JwtModule, JwtModuleOptions} from '@auth0/angular-jwt';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import { FriendComponent } from './friend/friend.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewFriendComponent } from './new-friend/new-friend.component';

const appRoutes: Routes =  [
  {path:'', component: HomeComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path:'profile', component: ProfileComponent, canActivate:[AuthGuard]}
]

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem("id_token");

    if (idToken) {

      const cloned = req.clone({
        headers: req.headers.set("Authorization",
          "JWT " + idToken)
      });

      return next.handle(cloned);

    } else {
      return next.handle(req);
    }

  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    FriendComponent,
    NewFriendComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
          return     localStorage.getItem('id_token');},
        allowedDomains: ['localhost:3000'],
        disallowedRoutes: ['http://localhost:3000/pangolins/login']
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [

// {provide: HTTP_INTERCEPTORS,
//   useClass: AuthInterceptor,
//   multi: true},
    ValidateService, AuthService, AuthGuard,
    JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
