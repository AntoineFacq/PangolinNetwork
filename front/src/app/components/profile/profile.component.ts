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
      this.pangolin = profile.json().pangolin;
      this.friends = profile.json().friends;
      this.otherPangos = profile.json().otherPangos;
    },
     err => {
       this.router.navigate(['/login']);

       return false;
     });
  }

  onModifSubmit() {
    this.authService.updatePangolin(this.pangolin).subscribe(
      (data) => {
        this.flashMessage.show('Profil mis à jour !', {cssClass: 'alert-success', timeout: 5000});
      });
  }
}
