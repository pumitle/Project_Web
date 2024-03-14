
import { CommonModule } from '@angular/common';
import { HttpClient ,HttpClientModule } from '@angular/common/http';
import { Component, Renderer2, ElementRef } from '@angular/core';
import { MysqlService } from '../app/../../mysql.service'; 
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../authen.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import {Router } from '@angular/router';
import { UserResponese,UploadRes } from '../../Modeldatabase/user_get';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-toprank',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,HttpClientModule,MatButtonModule,MatIconModule ],
  templateUrl: './toprank.component.html',
  styleUrl: './toprank.component.scss'
})
export class ToprankComponent {
  uid: any;
  user : UserResponese | undefined;
  data: UploadRes[] = [];
  befordata: UploadRes[] = [];
  upid: any;
  currentDate: Date = new Date();
  isShowingYesterday: boolean = false;
  selectedData: UploadRes[] = [];
  yesterdayRank: number[] = [];
  todayRank: number[] = [];
  yesterdayRanks: number[] = [];
  
  constructor(private http: HttpClient, private activateRoute: ActivatedRoute, private mysqlService: MysqlService, private authService: AuthenticationService,private router:Router,private renderer: Renderer2, private el: ElementRef) {}
  datauser: UserResponese[] = [];
  async ngOnInit()  {   
    this.authService.initializeAuthentication().then(user => {
      console.log('User data:', user);
      if (user) {
        console.log('User authenticated:', user);
        this.user = user;
        this.loadDataAsync();
      
        setInterval(() => {
          this.currentDate = new Date();
        }, 1000);
      
    
      } else {
        console.log('User not authenticated');
        this.loadDataAsync();
        setInterval(() => {
          this.currentDate = new Date();
        }, 1000);
      
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

  goDetailcar(carId: any) {
    this.router.navigate(['/detailcar',carId]);
    console.log("idcar :",carId);
  }
  goToprank(): void {
    this.router.navigate(['/toprank']);
  }
  goMain(): void{
    this.router.navigate(['/']);
  }


  async loadDataAsync() {
    this.data = await this.mysqlService.getdataAllupload();
    console.log("data is ", this.data);

    this.befordata = await this.mysqlService.getBefordataupload();
    console.log("Befor data is ", this.befordata);

    const yesterdayRankData = [5, 3, 2, 1, 6, 4, 7, 8, 9, 10]; // Example data for yesterday
    const todayRankData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Example data for today
    
    for (let i = 0; i < todayRankData.length; i++) {
      if (todayRankData[i] < yesterdayRankData[i]) {
        this.yesterdayRank.push(0); // 0 means down
        this.todayRank.push(1); // 1 means up
      } else if (todayRankData[i] > yesterdayRankData[i]) {
        this.yesterdayRank.push(1); // 1 means up
        this.todayRank.push(0); // 0 means down
      } else {
        this.yesterdayRank.push(0); // 0 means no change
        this.todayRank.push(0); // 0 means no change
      }
    }

 
  }

  today() {
    this.renderer.setStyle(this.el.nativeElement.querySelector('#btn'), 'left', '110px');
    this.selectedData = this.data;
  }

  before() {
    this.renderer.setStyle(this.el.nativeElement.querySelector('#btn'), 'left', '0');
    this.selectedData = this.befordata;
  }
 
 


}
