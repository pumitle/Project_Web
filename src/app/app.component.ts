import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { MysqlService } from '../app/mysql.service'; 
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './pages/register/register.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,MainComponent,LoginComponent, HttpClientModule,RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pj_votecar';

}
