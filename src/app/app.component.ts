import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { MysqlService } from '../app/mysql.service'; 
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './pages/register/register.component';
import { AuthenticationService } from '../../src/app/authen.service';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,MainComponent,LoginComponent, HttpClientModule,RegisterComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  title = 'pj_votecar';
 
  constructor(private authService: AuthenticationService ,private router : Router ) {}

  ngOnInit(): void {
    // Initialize authentication during app initialization
    this.authService.initializeAuthentication().then(user => {
      console.log('User data:', user);
      if (user) {
        console.log('User authenticated:', user);
      } else {
        console.log('User not authenticated');
        this.router.navigate(['/login']);
      }
    });
  }

}
