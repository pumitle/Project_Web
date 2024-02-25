import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet,Router } from '@angular/router';
import { MysqlService } from '../app/../../mysql.service'; 
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http'; 
import { UserResponese } from '../../Modeldatabase/user_get';
import { lastValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,MatIconModule,MatButtonModule,MatToolbarModule,MatInputModule,MatFormFieldModule, MatSelectModule,MatInputModule,MatButtonModule,MatIconModule,MatCardModule,FormsModule,ReactiveFormsModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {


    
private apiUrl = 'http://localhost:3000/api/mysql-data'; // เปลี่ยนเป็น URL ของ API ของคุณ

  email:any;
  password: any;
username: any;
confirmPassword: any;
  
  
  constructor(private http :HttpClient,private router:Router, private snackBar: MatSnackBar) {}
  datauser: UserResponese[] = [];

  ngOnInit(): void {
    
  }

  onSubmit(username: string, password: string, email: string) {
    // ตรวจสอบค่า email และ password ที่ได้จาก form
    console.log('User:', username);
    console.log('email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', this.confirmPassword);
    const url = 'http://localhost:3000/api/register'; // เปลี่ยนเป็น URL ของ API สำหรับการลงทะเบียน
  
  
    // ตรวจสอบ email และ password
    if (!username || !password ||  !email || !this.confirmPassword) {
      console.error('Please provide both email and password ');
      this.showSnackBar('Please provide both email and password ');
      return;
    }

    // ตรวจสอบว่ารหัสผ่านและรหัสผ่านที่ยืนยันตรงกัน
  if (password !== this.confirmPassword) {
    console.error('Password and Confirm Password do not match');
    this.showSnackBar('Password and Confirm Password do not match');
    return;
  }

  
   // ส่งคำขอ HTTP โดยไม่ใช้ await
   this.http.post(url, { username, password,email  }).subscribe(
    (data: any) => {
      console.log('Registration successful:', data);
      this.showSnackBar('Registration successful');
      this.router.navigate(['/login']);
      // Redirect or perform further actions upon successful registration
    },
    (error: any) => {
      console.error('Error during registration:', error);
      this.showSnackBar('Error during registration');
      // Handle error, show message, etc.
    }
  );
  }
  
  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

}
