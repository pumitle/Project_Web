import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet,Router } from '@angular/router';
import { MysqlService } from '../app/../../mysql.service'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,MatIconModule,MatButtonModule,MatToolbarModule,MatInputModule,MatFormFieldModule, MatSelectModule,MatInputModule,MatButtonModule,MatIconModule,MatCardModule,FormsModule,ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  
  private apiUrl = 'http://localhost:3000/api/mysql-data'; // เปลี่ยนเป็น URL ของ API ของคุณ

  email:any;
  password: any;
  username: any;
  rememberMe: boolean = false;
  
  
  constructor(private http :HttpClient,private router:Router, private snackBar: MatSnackBar) {}
  datauser: UserResponese[] = [];
  
   ngOnInit() {
    
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');

    if (rememberedEmail && rememberedPassword) {
      this.email = rememberedEmail;
      this.password = rememberedPassword;
      this.rememberMe = true; // Set the checkbox state
    }
  }

  onSubmit(email: string, password: string) {
    // ตรวจสอบค่า email และ password ที่ได้จาก form
    console.log('Email:', email);
    console.log('Password:', password);
    const url = 'http://localhost:3000/api/login/';
  
    // ตรวจสอบ email และ password
    if (!email || !password) {
      console.error('Please provide both email and password');
      this.showSnackBar('Please provide both email and password');
      return;
    }
  
  
    // ส่งคำขอ HTTP โดยไม่ใช้ await
    this.http.post(url, { email, password }).subscribe(
      (data : any) => {
        console.log('Login successful:', data);
        this.router.navigate(['/']);
        // Redirect or perform further actions upon successful login
      },
      (error : any) => {
        console.error('Error during login:', error);
        this.showSnackBar('Invalid email or password');
        // Handle error, show message, etc.
      }
    );

    if (this.rememberMe) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberedPassword', password);
    }
  }
  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

 
    

}

