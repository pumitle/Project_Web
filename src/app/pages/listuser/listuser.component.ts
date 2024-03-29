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
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listuser',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,HttpClientModule,MatButtonModule,MatFormFieldModule,MatInputModule,MatIconModule,FormsModule],
  templateUrl: './listuser.component.html',
  styleUrl: './listuser.component.scss'
})
export class ListuserComponent {

  uid: any;
  user : UserResponese | undefined;
  data: UploadRes[] = [];
  loading: boolean = false;
  userall: UserResponese [] = [];
  searchTerm: any ; 
  Iduser: any;
  
  
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
  if (selectedValue === 'home') {
    this.goMain();
  }
  if (selectedValue === 'profile') {
    this.goProfile();
  }
  if (selectedValue === 'toprank') {
    this.goToprank();
  }
  if (selectedValue === 'listuser'){
    this.goListUsers();
  }
  if (selectedValue === 'vote') {
    this.goVote();
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
goShowProfile(id: any) {
  this.router.navigate(['/showprofile',id]);
}
goListUsers(): void {
  this.router.navigate(['/listuser']);
}
goVote(): void {
  this.router.navigate(['/vote']);
}



async loadDataAsync() {
  const user = this.user;
  if(user){
  this.userall = await this.mysqlService.getUser();
  console.log("dataUser is ",this.userall);
  }
  this.hideLoadingWindow();

}

async search() {
  if (this.searchTerm.trim() !== '') { // ตรวจสอบว่าคำค้นหาไม่เป็นค่าว่าง
    // เรียกเมธอด searchuser เพื่อค้นหาผู้ใช้
    this.userall = await this.mysqlService.searchuser(0, this.searchTerm);
  } else {
    // ถ้าคำค้นหาเป็นค่าว่าง ให้โหลดข้อมูลผู้ใช้ทั้งหมด
    this.loadDataAsync();
  }
}


async  updateUserType(iduser : any) {
  try {
    const user = this.user;
    if(user){
        this.Iduser = iduser;
        console.log( this.Iduser );
        
        const UpdateType = `https://adv-voote.onrender.com/user/type/${iduser}`;
        const Uptype : any = await this.http.put( UpdateType,{ type:"admin"}).toPromise();
        
        Swal.fire({
          icon: 'success',
          title: 'Update Successful!',
          text: 'Update Successful!',
        });

        
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
    }
  } catch (error) {
    console.log(error);
    
  }
  }
}
