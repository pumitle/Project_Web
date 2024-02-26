import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MysqlService } from '../app/../../mysql.service'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { UserResponese } from '../../Modeldatabase/user_get';
import { lastValueFrom } from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,HttpClientModule,MatButtonModule ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  private apiUrl = 'http://localhost:3000/api/mysql-data'; // เปลี่ยนเป็น URL ของ API ของคุณ
  
  constructor(private http :HttpClient) {}
  datauser: UserResponese[] = [];
  async ngOnInit() {
    const url = 'http://localhost:3000/api/mysql-data' ;
    let data = await lastValueFrom(this.http.get(url));
    this.datauser = data as UserResponese[];
    console.log(this.datauser[0].name);
    console.log('Call Completed');
  }

 

 



}
