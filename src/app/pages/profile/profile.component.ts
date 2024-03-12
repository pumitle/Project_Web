import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MysqlService } from '../app/../../mysql.service'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { UserResponese,UploadRes } from '../../Modeldatabase/user_get';
import { lastValueFrom } from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {Router } from '@angular/router';
import { AuthenticationService } from '../../authen.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,HttpClientModule,MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  uid: any;
  user : UserResponese | undefined;
  data: UploadRes[] = [];

  
  constructor(private http :HttpClient,private activateRoute:ActivatedRoute,private mysqlService: MysqlService,private authService: AuthenticationService,private router:Router ) {}
  datauser: UserResponese[] = [];
  
  
  async ngOnInit()  {   
  this.authService.initializeAuthentication().then(user => {
    console.log('User data:', user);
    if (user) {
      console.log('User authenticated:', user);
      this.user = user;
      this.loadDataAsync();
    } else {
      console.log('User not authenticated');
     
    }
  });
}
onSelectChange(event: any) {
  const selectedValue = event.target.value;
  if (selectedValue === 'logout') {
    this.logout();
  }
  if (selectedValue === 'upload') {
    this.goUpload();
  }
  if (selectedValue === 'profile') {
    this.goProfile();
  }
}

logout(): void {
  this.authService.logout();
  this.router.navigate(['/login']);
}

goUpload(): void {
  this.router.navigate(['/upload']);
}

goProfile(): void {
  this.router.navigate(['/profile']);
}



async loadDataAsync() {
  const user = this.user;
  if(user){
  const userId = user.uid;
  this.data = await this.mysqlService.getProfilebyId(userId);
  console.log("data is ", this.data);
  }

}
}
