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
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-showprofile',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,HttpClientModule,MatButtonModule,MatFormFieldModule,MatInputModule,MatIconModule],
  templateUrl: './showprofile.component.html',
  styleUrl: './showprofile.component.scss'
})
export class ShowprofileComponent {
  uid: any;
  user : UserResponese | undefined;
  data: UploadRes[] = [];
  loading: boolean = false;
  usercom: UserResponese [] = [];
  userId: any;
  topRankbefor: UploadRes[] = [];
  yesterdayRank: number[] = [];
  todayRank: number[] = [];
  yesterdayRanks: number[] = [];
  rankChanges: any;
  rankChangesCount: any;
  topRank: UploadRes[] = [];
  
  constructor(private http :HttpClient,private activateRoute:ActivatedRoute,private mysqlService: MysqlService,private authService: AuthenticationService,private router:Router ) {}
  datauser: UserResponese[] = [];
  
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
      this.userId = user.uid;
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

goDetailcar(carId: any) {
  this.router.navigate(['/detailcar',carId]);
  console.log("idcar :",carId);
}


async loadDataAsync() {
  const user = this.user;
  this.uid = this.activateRoute.snapshot.paramMap.get('uid') || '';
  console.log("ไอดีที่ส่งมา",this.uid);
  const uid = this.uid;
  if(user){
       this.usercom = await this.mysqlService.getById(this.uid);
      this.data = await this.mysqlService.getProfilebyId(this.uid);
      console.log("data is ", this.data);
  }
  this.hideLoadingWindow();

  this.topRank = await this.mysqlService.getranktoday();
  console.log("Rank today is ", this.topRank);

  this.topRankbefor = await this.mysqlService.getrankbefor();
  console.log("Rank befor is ", this.topRankbefor);

  await this.compareRanks();

  }



  
getRankByCarId(carId: any): number {
  const rankInfo = this.topRank.find(item => item.upid === carId);
  return rankInfo ? rankInfo.rank : 0; // ถ้าไม่พบข้อมูล rank ให้ส่งค่า 0 กลับ
}

getRankbeforByCarId(carId: any): number {
  const rankInfo = this.topRankbefor.find(item => item.upid === carId);
  return rankInfo ? rankInfo.rank : 0; // ถ้าไม่พบข้อมูล rank ให้ส่งค่า 0 กลับ
}


async compareRanks() {
  // ดึงข้อมูลลำดับของวันนี้
  this.topRank = await this.mysqlService.getranktoday();

  // ดึงข้อมูลลำดับของเมื่อวาน
  this.topRankbefor = await this.mysqlService.getrankbefor();

  // ตรวจสอบว่าข้อมูลเรียงลำดับของวันนี้และเมื่อวานมีขนาดเท่ากันหรือไม่
  if (this.topRank.length !== this.topRankbefor.length && this.topRank.length === this.topRankbefor.length) {
      console.error("Error: Length of today's rank and yesterday's rank are not the same.");
      return;
  }

  // สร้าง Map เพื่อเก็บข้อมูลรถแต่ละคันในวันนี้โดยใช้ upid เป็น key และ rank เป็น value
  const carsTodayMap = new Map<number, number>();
  this.topRank.forEach(car => {
      carsTodayMap.set(car.upid, car.rank);
  });

  // เช็คว่ารถแต่ละคันมีการเปลี่ยนแปลง rank หรือไม่
  this.topRankbefor.forEach(car => {
      const rankToday = carsTodayMap.get(car.upid);
      if (rankToday !== undefined && rankToday !== car.rank) {
          console.log(`รถที่มีไอดี ${car.upid} มีการเปลี่ยนแปลง rank จาก ${car.rank} เป็น ${rankToday}`);
      }
      const carIndex = this.data.findIndex(item => item.upid === car.upid);
      if (carIndex !== -1) {
        this.data[carIndex].rank = car.rank;
      }
  });


  // เช็คว่ารถแต่ละคันมีการเปลี่ยนแปลง rank หรือไม่

  this.rankChanges = this.topRankbefor.map(car => {
    // หาค่า rank ในวันนี้ของรถคันนี้
    const rankToday = carsTodayMap.get(car.upid);
    // ถ้า rank วันนี้ไม่เท่ากับ undefined และไม่เท่ากับ rank เมื่อวาน
    // หมายถึงมีการเปลี่ยนแปลงลำดับ
    if (rankToday !== undefined && rankToday !== car.rank) {
        // หาว่าการเปลี่ยนแปลงลำดับเป็นการลดหรือเพิ่ม
        return rankToday > car.rank ? 1 : -1;
      
    } else {
        // ถ้าไม่มีการเปลี่ยนแปลงลำดับให้เป็น 0
        return 0;
    }
});

// แสดงผลลัพธ์การเปรียบเทียบ
console.log("Rank changes:", this.rankChanges);

// สร้างตัวแปรเพื่อเก็บผลการเปรียบเทียบการเปลี่ยนแปลง rank
const rankChangesCount: { [carId: number]: number } = {};

// นับจำนวนการเพิ่มลำดับ (ตัวเลขบวก) และลดลำดับ (ตัวเลขลบ) ในอาร์เรย์ rankChanges


// วนลูปเช็ครถแต่ละคัน
this.topRankbefor.forEach(car => {
    const rankToday = carsTodayMap.get(car.upid);
    if (rankToday !== undefined && rankToday !== car.rank) {
        // หาความต่างของ rank เมื่อวันนี้กับเมื่อวาน
        const rankDifference =  car.rank-rankToday ;
        // ตรวจสอบว่า rank เพิ่มหรือลด
        if (rankDifference !== 0) {
            // ตรวจสอบว่ารถคันนี้มีการเปลี่ยนแปลง rank กี่อันดับ
            if (rankChangesCount[car.upid] === undefined) {
                rankChangesCount[car.upid] = rankDifference;
            } else {
                rankChangesCount[car.upid] += rankDifference;
            }
            // แสดงผลลัพธ์การเปลี่ยนแปลง rank
            if (rankDifference > 0) {
                console.log(`รถที่มีไอดี ${car.upid} มีการเพิ่ม rank จำนวน +${Math.abs(rankDifference)}  อันดับ`);
            } else {
                console.log(`รถที่มีไอดี ${car.upid} มีการลด rank จำนวน -${Math.abs(rankDifference)} อันดับ`);
            }
        }
    }
});

// แสดงผลลัพธ์การเปลี่ยนแปลง rank ทั้งหมด
console.log(rankChangesCount);
this.rankChangesCount = rankChangesCount;




}


getRankChange(upid: number): any{
  // ตรวจสอบว่าอ็อบเจกต์ rankChangesCount มีค่าหรือไม่
  if (this.rankChangesCount && this.rankChangesCount[upid] !== undefined) {
    // คืนค่า rankChangesCount สำหรับคีย์ที่กำหนด
    // return this.rankChangesCount[upid];
    return this.rankChangesCount[upid] > 0 ? `+${this.rankChangesCount[upid]}` : this.rankChangesCount[upid].toString();
  } else {
    // คืนค่าเป็น 0 หรือค่าที่คุณต้องการเมื่อไม่พบคีย์
    return '';
  }
}

}
