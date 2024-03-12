import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MysqlService } from '../app/../../mysql.service'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { UserResponese } from '../../Modeldatabase/user_get';
import {Router } from '@angular/router';
import { AuthenticationService } from '../../authen.service';
import { MatButtonModule } from '@angular/material/button';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-detailcar',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterLink,HttpClientModule,MatButtonModule],
  templateUrl: './detailcar.component.html',
  styleUrl: './detailcar.component.scss'
})
export class DetailcarComponent implements OnInit, AfterViewInit {
  uid: any;
  user : UserResponese | undefined;
  
  constructor(private http :HttpClient,private activateRoute:ActivatedRoute,private mysqlService: MysqlService,private authService: AuthenticationService,private router:Router ) {}
  datauser: UserResponese[] = [];

  @ViewChild('myChart') myChart!: ElementRef;
  
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
      this.goUpload();
    }
    if (selectedValue === 'profile') {
      this.goProfile();
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

  ngAfterViewInit() {
    const ctx = this.myChart.nativeElement.getContext('2d');
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['7 day ago','6 day ago', '5 day ago', '4 day ago', '3 day ago', '2 day ago', '1 day ago', 'today'],
        datasets: [{
          label: 'Statics for the past 7 days',
          data: [200,123,50, 89, 48, 12, 11, 54],
          borderWidth: 1,
          borderRadius: 50,
          backgroundColor: '#bb0102'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
}
