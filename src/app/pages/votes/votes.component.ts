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
import {  SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-votes',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,HttpClientModule,MatButtonModule,SlickCarouselModule],
  templateUrl: './votes.component.html',
  styleUrl: './votes.component.scss'
})
export class VotesComponent implements OnInit {

logout() {
throw new Error('Method not implemented.');
}
  user : UserResponese | undefined;
  selectedImage: any | null = null;
  hoveredImage: any | null = null;
  constructor(private http :HttpClient,private activateRoute:ActivatedRoute,private mysqlService: MysqlService,private authService: AuthenticationService,private router:Router ,private cdr: ChangeDetectorRef ){}
  
  ngOnInit(): void {
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


  selectImage(side: string): void {
    this.selectedImage = side;
  }
 

  vote(): void {
    if (this.selectedImage) {
      // ทำสิ่งที่คุณต้องการเมื่อผู้ใช้กด Vote ที่นี่
      console.log(`Voting for ${this.selectedImage} image.`);
      // Reset ค่าที่เลือกหลังจากกด Vote
      this.selectedImage = null;
    } else {
      // แสดงข้อความในกรณีที่ผู้ใช้ลืมเลือกรูป
      console.log('Please select an image before voting.');
    }
  }
  
}


