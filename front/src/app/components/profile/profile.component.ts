import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  pangolin:Object;
  friends:Object[];
  otherPangos:Object[];
  server = 'http://localhost:3000/';


  constructor(private authService:AuthService, private router:Router,
              private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
        console.log(profile);
      this.pangolin = profile.json().pangolin;
      this.friends = profile.json().friends;
      this.otherPangos = profile.json().otherPangos;
    },
     err => {
       console.log(err);
       return false;
     });
  }

  addFriend(id: number) {
    console.log("Add");
    this.authService.addFriend(id).subscribe(
      (data) => {
        var d = data.json();
        this.friends = d.friends;
        this.otherPangos = d.otherPangos;
      });
  }

  removeFriend(id: number) {
    this.authService.removeFriend(id).subscribe(
      (data) => {
        var d = data.json();
        this.friends = d.friends;
        this.otherPangos = d.otherPangos;
      });
  }

  onModifSubmit() {
    this.authService.updatePangolin(this.pangolin).subscribe(
      (data) => {
        this.flashMessage.show('Profil mis à jour !', {cssClass: 'alert-success', timeout: 5000});
      });
  }
}