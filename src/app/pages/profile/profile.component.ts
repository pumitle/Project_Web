import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,HttpClientModule,MatButtonModule,MatFormFieldModule,MatInputModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
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

}

openPopup() {
  document.getElementById('myModal')!.classList.remove('hide');
  document.getElementById('myModal')!.classList.add('show');
  document.getElementById('myModal')!.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

async closePopup() {
  document.body.style.overflow = 'auto'; // อนิเมชันเสร็จสิ้น ปรับ overflow เพื่อเปลี่ยนเป็น auto
  const modal = document.getElementById('myModal')!;
  modal.classList.add('hide'); // เพิ่มคลาส "hide" เพื่อเล่นอนิเมชัน fadeOut
  await new Promise(resolve => setTimeout(resolve, 1000)); // รอให้อนิเมชันเสร็จสิ้น (300 มิลลิวินาที)
  modal.style.display = 'none'; // ซ่อนป๊อปอัพ
}

imageSrc: string | undefined;
file? : File;
previewImage(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    this.file = target.files[0];
    this.imageSrc = URL.createObjectURL(this.file);
  }
}
}
