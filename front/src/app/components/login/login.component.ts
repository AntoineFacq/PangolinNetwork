import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: String;
  password: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }
    dataRegister:any={}

  ngOnInit() {
  }

  onLoginSubmit() {
    const user = {
      login: this.login,
      password: this.password
    }

    this.authService.login(user).subscribe(data => {

      this.dataRegister = data.json();
        if(this.dataRegister.success) {
          this.authService.storeUserData(this.dataRegister.token, this.dataRegister.user);
          this.flashMessage.show('Vous êtes désormais connecté !', {cssClass: 'alert-success', timeout: 5000});
          this.router.navigate(['profile']);
        } else {
          this.flashMessage.show(this.dataRegister.msg, {cssClass: 'alert-danger', timeout: 5000});
          this.router.navigate(['login']);
        }
    });
  }

}
