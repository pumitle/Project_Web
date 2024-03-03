import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MysqlService } from '../app/../../mysql.service'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { UserResponese } from '../../Modeldatabase/user_get';
import { lastValueFrom } from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {Router } from '@angular/router';
import { AuthenticationService } from '../../authen.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardActions } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,HttpClientModule,MatButtonModule,MatFormFieldModule,MatCardActions,FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  uid: any;
  user : UserResponese | undefined;
  carName: any;
  carDetails: any;
 
  
  constructor(private http :HttpClient,private activateRoute:ActivatedRoute,private mysqlService: MysqlService,private authService: AuthenticationService,private router:Router ) {}
  datauser: UserResponese[] = [];
   file? : File;
  
  async ngOnInit()  {
   
  this.authService.initializeAuthentication().then(user => {
    console.log('User data:', user);
    if (user) {
      console.log('User authenticated:', user);
      this.user = user;
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
    this.goToUpload();
  
  }
  if (selectedValue === 'profile') {
    this.goToProfile();
  }
}

logout(): void {
  this.authService.logout();
  this.router.navigate(['/login']);
}

onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    this.file = target.files![0];
  }
}

async goUpload(namecar: any, detailscar: any) {
  try {
    const user = this.user;
    if (user) { 
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);

      const Namecar =  namecar;
      const detail = detailscar;
      const userId = user.uid;
      // console.log( Namecar);
      // console.log( detail);

      const url = 'http://localhost:3000/upimg';
      const response: any = await this.http.post(url, formData).toPromise();

      // Assuming the response contains the file URL
      console.log(response.file);

      const insertApi = 'http://localhost:3000/voteapi/imgsert';
      const Allinsert : any = await this.http.post(insertApi,{img_car:response.file,name_img:Namecar,detail:detail, uid_user: userId }).toPromise();
      
      Swal.fire({
        icon: 'success',
        title: 'Upload Successful!',
        text: 'Thank you for Upload.',
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reload the page after a successful vote
      window.location.reload();
      
      // Do something with the file URL if needed
    } else {
      console.error('No file selected');
    }
  }
  } catch (error) {
    console.error('File upload failed:', error);
    // Handle the error, e.g., show an error message to the user
  }
}

goToUpload(): void {
  this.router.navigate(['/upload']);
}


goToProfile(): void {
  this.router.navigate(['/profile']);
}

}