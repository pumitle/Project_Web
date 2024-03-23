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
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,HttpClientModule,MatButtonModule,MatFormFieldModule,MatInputModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  uid: any;
  user : UserResponese | undefined;
  data: UploadRes[] = [];
  imageSrc: string | undefined;
  file? : File; 
  oldImageSrc: any;
  imguser: any;
  isEditing: boolean = false; // เพิ่มตัวแปรเพื่อติดตามว่ากำลังแก้ไขหรือไม่
  editedUser: any // เพิ่มตัวแปรสำหรับเก็บข้อมูลผู้ใช้ที่แก้ไข
  editName: any;
  editemail: any;
  editphone: any;
  editurl: any;
  oldpass: any;
  newpass: any;
  confirmpass: any;
  passuser: any;
  emailuser: any;
  showEditModal: any;
  selectedCarId: any;
  cars: UploadRes[] = [];
  datauser: UserResponese[] = [];
  imageCar: string | undefined;
  loading: boolean = false;
  car: UploadRes[] = [];
  upid: any;
  otheruser: UserResponese [] = [];


  constructor(private http :HttpClient,private activateRoute:ActivatedRoute,private mysqlService: MysqlService,private authService: AuthenticationService,private router:Router ) {}
  
 

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
      this.passuser = user.password;
      this.emailuser = user.email;
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
goListUsers(): void {
  this.router.navigate(['/listuser']);
}
goVote(): void {
  this.router.navigate(['/vote']);
}



async loadDataAsync() {
  const user = this.user;
  this.uid = this.activateRoute.snapshot.paramMap.get('uid') || '';
  console.log("ไอดีที่ส่งมา",this.uid);
  
  if(user){
  const userId = user.uid;
  this.data= await this.mysqlService.getProfilebyId(userId);
  console.log("data is ", this.data);
  }
  this.hideLoadingWindow();


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
  await new Promise(resolve => setTimeout(resolve, 500)); // รอให้อนิเมชันเสร็จสิ้น (300 มิลลิวินาที)
  modal.style.display = 'none'; // ซ่อนป๊อปอัพ
}

openPopupReset() {
  document.getElementById('reSetPass')!.classList.remove('hide');
  document.getElementById('reSetPass')!.classList.add('show');
  document.getElementById('reSetPass')!.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

async closePopupReset() {
  document.body.style.overflow = 'auto';
  const modal = document.getElementById('reSetPass')!;
  modal.classList.add('hide');
  await new Promise(resolve => setTimeout(resolve, 500));
  modal.style.display = 'none'; 
}

async openPopupEditcar(carId: number) {
  try {
    // เรียกใช้ API เพื่อดึงข้อมูลรถจากไอดีที่ระบุ
    const req: any = await this.mysqlService.getCarsbyId(carId);
    this.cars = req;
    console.log(this.cars);
  } catch(e) {
    console.log(e);
  }
  document.getElementById('editcar')!.classList.remove('hide');
  document.getElementById('editcar')!.classList.add('show');
  document.getElementById('editcar')!.style.display = 'block';
  document.body.style.overflow = 'hidden';
 
  this.showEditModal = true;
  this.selectedCarId = carId;
}

async closePopupEditcar() {
  document.body.style.overflow = 'auto';
  const modal = document.getElementById('editcar')!;
  modal.classList.add('hide');
  await new Promise(resolve => setTimeout(resolve, 500));
  modal.style.display = 'none'; 
  this.showEditModal = false;
}


previewImageCar(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    this.file = target.files[0];
    this.imageCar = URL.createObjectURL(this.file);
  }
}

async changeCar(namecar :any ,detail : any) {
  // ฟังก์ชันที่จะทำงานเมื่อกดปุ่ม "Change"
  console.log("Changing car with ID:", this.selectedCarId);

try {  
  const user = this.user;
  if(user){
    
    await this.mysqlService.deleteCars(this.selectedCarId);

    if(this.file){
      const formData = new FormData();
      formData.append('file', this.file);

      const Name =  namecar;
      const detii = detail;
      const userId = user.uid;

      console.log(Name);
      const url = 'https://adv-voote.onrender.com/upimg';
      const response: any = await this.http.post(url, formData).toPromise();
      console.log(response.file);

      const insertApi = 'https://adv-voote.onrender.com/voteapi/imgsert';
      const Allinsert : any = await this.http.post(insertApi,{img_car:response.file,name_img:Name,detail:detii, uid_user: userId }).toPromise();
      
      Swal.fire({
        icon: 'success',
        title: 'Upload Successful!',
        text: 'Thank you for Upload.',
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reload the page after a successful vote
      window.location.reload();
    }else {
      console.error('No file selected');
    }
  }
} catch (error) {
  console.error('Insert upload failed:', error);
}

}

async deleteCar() {
  // ฟังก์ชันที่จะทำงานเมื่อกดปุ่ม "Delete"
  console.log("Deleting car with ID:", this.selectedCarId);

  try {
    const user = this.user;
  if(user){
    await this.mysqlService.deleteCars(this.selectedCarId);
    
    Swal.fire({
      icon: 'success',
      title: 'Delete Successful!',
      text: 'Thank you for Delete.',
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reload the page after a successful vote
    window.location.reload();
  }
    
  } catch (error) {
    console.error('Insert Delete failed:', error);
  }

}

previewImage(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    this.file = target.files[0];
    this.imageSrc = URL.createObjectURL(this.file);
  }
}




async editprofile(username: any, email: any,mobile_number: any,url_user: any) {
  try {
    const user = this.user;
    if (user) { 
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);

      const Name =  username;
      const Email = email;
      const Phone =  mobile_number;
      const Url_user = url_user;

      const userId = user.uid;
      // console.log( Namecar);
      // console.log( detail);
      console.log("Nameee : ",Name);

      const url = 'https://adv-voote.onrender.com/upimg';
      const response: any = await this.http.post(url, formData).toPromise();

      // Assuming the response contains the file URL
      console.log(response.file);

      const insertApi = `https://adv-voote.onrender.com/user/edit/${userId}`;
      const Allinsert : any = await this.http.put(insertApi,{img_user:response.file,username:Name,email:Email,mobile_number:Phone,url_user:Url_user}).toPromise();
      
      Swal.fire({
        icon: 'success',
        title: 'Upload Successful!',
        text: 'Thank you for Upload.',
      });
      this.autoLogin(Email,this.passuser);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reload the page after a successful vote
      window.location.reload();
      
      // Do something with the file URL if needed
    } else {
     // ไม่มีไฟล์ที่เลือกใหม่ ใช้ URL ของรูปภาพที่มีอยู่แล้ว
    const Name  =  username;
    const Email =  email;
    const Phone =  mobile_number;
    const Url_user = url_user;
    const userId = user.uid;
    const insertApi = `https://adv-voote.onrender.com/user/edit/${userId}`;
    const result: any = await this.http.put(insertApi,{username:Name,email:Email,mobile_number:Phone,url_user:Url_user}).toPromise();

    Swal.fire({
      icon: 'success',
      title: 'Update Successful!',
      text: 'Your profile has been updated.',
    });
    this.autoLogin(Email,this.passuser);
    await new Promise(resolve => setTimeout(resolve, 2000));
    window.location.reload();
    }
  }
  } catch (error) {
    console.error('File upload failed:', error);
    // Handle the error, e.g., show an error message to the user
  }
}



async editpassword(password : any, oldpass : any) {
  try {
    const user = this.user;
    const oldPass = oldpass;
    const confirmPass = this.confirmpass;
    const newpass = password;
    if (oldPass && newpass && confirmPass && newpass === confirmPass) {
    if (user) { 
    
      const userId = user.uid;
         // เช็คว่ารหัสผ่านเดิมที่ผู้ใช้ใส่ตรงกับรหัสผ่านที่อยู่ในฐานข้อมูลหรือไม่
      if (this.passuser === oldPass) {
      // ทำการอัปเดตรหัสผ่านใหม่
       const upApi = `https://adv-voote.onrender.com/user/edit/${userId}`;
       const Allinsert: any = await this.http.put(upApi, { password: newpass }).toPromise();

          Swal.fire({
            icon: 'success',
            title: 'Password Updated!',
            text: 'Your password has been updated successfully.',
          });
            this.autoLogin(this.emailuser,newpass);
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // รีโหลดหน้าหลังจากการอัปเดตสำเร็จ
          window.location.reload();
        
        } else {
          // แจ้งเตือนให้ผู้ใช้ระบุรหัสผ่านเดิมให้ถูกต้อง
          Swal.fire({
            icon: 'error',
            title: 'Password Update Failed',
            text: 'The old password you entered is incorrect.',
          });
        }
    } else {
      console.error('User not found.');
    }
  }else {
    // แจ้งเตือนให้ผู้ใช้กรอกรหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ให้ตรงกัน
    Swal.fire({
      icon: 'error',
      title: 'Password Update Failed',
      text: 'Please make sure you enter the correct old password and the new password fields match.',
    });
  }
}
   catch (error) {
    console.error('File upload failed:', error);
    // Handle the error, e.g., show an error message to the user
  }
}

autoLogin(email: string, password: string) {
  // Perform login using the updated credentials
  this.authService.login(email, password)
    .then(user => {
      // Check if user authentication was successful
      if (user) {
        // Save the updated credentials to local storage
        localStorage.setItem('loggedInUser', JSON.stringify({ email, password }));
      } else {
        // Notify the user if authentication failed
        console.error('Authentication failed.');
      }
    })
    .catch(error => {
      // Handle authentication errors
      console.error('Authentication error:', error);
    });
}



}


