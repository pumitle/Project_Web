import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MysqlService } from '../app/../../mysql.service'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { UserResponese,UploadRes } from '../../Modeldatabase/user_get';
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
  data: UploadRes[] = [];
  dataOfday: UploadRes[] = [];
  upid: any;

  
  constructor(private http :HttpClient,private activateRoute:ActivatedRoute,private mysqlService: MysqlService,private authService: AuthenticationService,private router:Router ) {}
  datauser: UserResponese[] = [];

  @ViewChild('myChart') myChart!: ElementRef;
  
  async ngOnInit()  {
    this.upid = this.activateRoute.snapshot.paramMap.get('upid') || '';
    this.authService.initializeAuthentication().then(user => {
      console.log('User data:', user);
      if (user) {
        console.log('User authenticated:', user);
        this.user = user;
       
       console.log("dataofday is ", this.dataOfday);
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
    this.upid = this.activateRoute.snapshot.paramMap.get('upid') || '';
    try{
      const req : any = await this.mysqlService.getCarsbyId(this.upid);
        this.data = req;
        console.log(this.data);
     
    }catch(e){
      console.log(e);
    }
  
    this.dataOfday = await this.mysqlService.getdataCarsbyId(this.upid);
    console.log("dataofday is ", this.dataOfday);
    
 
  }


  // ngAfterViewInit() {
  //   const ctx = this.myChart.nativeElement.getContext('2d');
    
  //   new Chart(ctx, {
  //     type: 'line',
  //     data: {
  //       labels: ['7 day ago','6 day ago', '5 day ago', '4 day ago', '3 day ago', '2 day ago', '1 day ago', 'today'],
  //       datasets: [{
  //         label: 'Statics for the past 7 days',
  //         data: [200,123,50, 89, 48, 12, 11, 54],
  //         borderWidth: 2, // กำหนดความหนาของเส้น
  //         borderColor: '#bb0102', // กำหนดสีของเส้น
  //         fill: false // ไม่เติมสีเข้าไปในพื้นที่ใต้เส้น
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     }
  //   });
  // }

  ngAfterViewInit() {
    const ctx = this.myChart.nativeElement.getContext('2d');
    const data: any[] = [];
    const upid = this.upid;
    console.log("idddd", upid );
    this.mysqlService.getdataCarsbyId(upid)
        .then((dataOfday) => {
            this.dataOfday = dataOfday;
            console.log("dataofday is ", this.dataOfday);
            // วนลูปผ่านทุกๆ ออบเจ็กต์ในอาร์เรย์ dataOfday
            this.dataOfday.forEach((item) => {
                data.push(item.total_score); // เพิ่มคะแนนทั้งหมดในวันนั้นลงใน data
            });
            const sortedData = data.slice().reverse(); 
            console.log("asdasdad", sortedData);
            const sortedLabels = ['7 day ago', '6 day ago', '5 day ago', '4 day ago', '3 day ago', '2 day ago', '1 day ago', 'today'];
            if (sortedData.length < sortedLabels.length) {
              const diff = sortedLabels.length - sortedData.length;
              for (let i = 0; i < diff; i++) {
                  sortedData.unshift(0); // เพิ่มค่า 0 ในข้อมูลที่ขาดหายไป
              }
          }
          const todayScore = sortedData[sortedData.length - 1]; // คะแนนวันนี้
          const last7Days = sortedData.slice(-8, -1); // คะแนน 7 วันที่ผ่านมา
          console.log("Today's Score: ", todayScore);
          console.log("Last 7 days scores: ", last7Days);
            
            new Chart(ctx, {
                type: 'line',
                data: {
                  labels: sortedLabels, // ใช้ labels ที่สร้างไว้
                  datasets: [
                    {
                        label: 'Last 7 Days Score',
                        data: [...last7Days, todayScore], // เพิ่มคะแนนวันนี้ลงในช่วงข้อมูลสุดท้ายของ last7Days
                        borderWidth: 2,
                        borderColor: '#bb0102',
                        fill: false
                    }
                ]
            },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching data", error);
        });
}

  
  
}
