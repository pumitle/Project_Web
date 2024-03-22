import { Component, OnInit, ViewChild  ,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MysqlService } from '../app/../../mysql.service'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { UserResponese,UploadRes } from '../../Modeldatabase/user_get';
import {MatButtonModule} from '@angular/material/button';
import {Router } from '@angular/router';
import { AuthenticationService } from '../../authen.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-showprofile',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,HttpClientModule,MatButtonModule,MatFormFieldModule,MatInputModule],
  templateUrl: './showprofile.component.html',
  styleUrl: './showprofile.component.scss'
})
export class ShowprofileComponent {
  uid: any;
  user : UserResponese | undefined;
  data: UploadRes[] = [];
  loading: boolean = false;

  
  
  constructor(private http :HttpClient,private activateRoute:ActivatedRoute,private mysqlService: MysqlService,private authService: AuthenticationService,private router:Router ) {}
  datauser: UserResponese[] = [];
  
  @ViewChild('loadingWindow') loadingWindow!: ElementRef<any>;

   showLoadingWindow() {
    this.loading = true;
  }

  hideLoadingWindow() {
    this.loading = false;
  }

  
  async ngOnInit()  {   
    this.showLoadingWindow();
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
  if (selectedValue === 'toprank') {
    this.goToprank();
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
goToprank(): void {
  this.router.navigate(['/toprank']);
}
goMain(): void{
  this.router.navigate(['/']);
}



async loadDataAsync() {
  const user = this.user;
  if(user){
  const userId = user.uid;
  this.data = await this.mysqlService.getProfilebyId(userId);
  console.log("data is ", this.data);
  }
  this.hideLoadingWindow();


}
}
