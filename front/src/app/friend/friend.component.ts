import {Component, Host, Input, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {ProfileComponent} from '../components/profile/profile.component';
import {log} from 'util';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {
  @Input() pangolin;
  @Input() isFriend: boolean;
  profile: ProfileComponent;

  constructor(@Host() profile: ProfileComponent, public authService:AuthService,) {
    this.profile = profile;
  }

  ngOnInit(): void {

  }


  addFriend(id: number) {
    console.log("Add");
    this.authService.addFriend(id).subscribe(
      (data) => {
        console.log(id);
        var d = data.json();
        this.profile.friends = d.friends;
        this.profile.otherPangos = d.otherPangos;
      });
  }

  removeFriend(id: number) {
    this.authService.removeFriend(id).subscribe(
      (data) => {
        var d = data.json();
        this.profile.friends = d.friends;
        this.profile.otherPangos = d.otherPangos;
      });
  }

}
