import {Component, Host, OnInit} from '@angular/core';
import {ValidateService} from '../services/validate.service';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import {ProfileComponent} from '../components/profile/profile.component';

@Component({
  selector: 'app-new-friend',
  templateUrl: './new-friend.component.html',
  styleUrls: ['./new-friend.component.css']
})
export class NewFriendComponent implements OnInit {
  login: String;
  age: String;
  food: String;
  family: String;
  race: String;
  password: String;
  profile: ProfileComponent;

  constructor(
    @Host() profile: ProfileComponent,
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) {
    this.profile = profile;
  }
  dataRegister: any={}

  ngOnInit() {
  }

  registerNewFriend() {
    const user = {
      login: this.login,
      age: this.age,
      family: this.family,
      race: this.race,
      food: this.food,
      password: this.password
    }

    if(!this.validateService.validateRegister(user)) {
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    this.authService.registerNewFriend(user).subscribe(data => {
      this.dataRegister = data.json();
      if(this.dataRegister.success) {
        this.flashMessage.show(this.login+' a bien été ajouté et est désormais votre ami!', {cssClass: 'alert-success', timeout: 3000});
        console.log(this.dataRegister);
        this.profile.friends = this.dataRegister.friends;
        this.profile.otherPangos = this.dataRegister.otherPangos;
      } else {
        this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
      }
    });
  }
}
