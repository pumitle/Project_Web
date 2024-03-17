
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
    topRank: UploadRes[] = [];
    topRankbefor: UploadRes[] = [];
    upid: any;
    currentDate: Date = new Date();
    isShowingYesterday: boolean = false;
    selectedData: UploadRes[] = [];
    yesterdayRank: number[] = [];
    todayRank: number[] = [];
    yesterdayRanks: number[] = [];

    rankChanges: any;
    
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
  
      this.topRank = await this.mysqlService.getranktoday();
      console.log("Rank today is ", this.topRank);
  
      this.topRankbefor = await this.mysqlService.getrankbefor();
      console.log("Rank befor is ", this.topRankbefor);

  
      const todayRanks = this.getRankData(this.topRank);
      const yesterdayRanks = this.getRankData(this.topRankbefor);

      const todayScores = this.getTotalScoreData(this.topRank);
      const yesterdayScores = this.getTotalScoreData(this.topRankbefor);

      const comparedRanks = this.compareRanks(todayRanks, yesterdayRanks);
      const comparedScores = this.compareScores(todayScores, yesterdayScores);
  
      if (comparedRanks) {
        let upCount = 0;
        let downCount = 0;
        comparedRanks.forEach(change => {
            if (change > 0) {
                upCount++;
            } else if (change < 0) {
                downCount++;
            }
        });
        console.log(`Report: ${upCount} ranks up, ${downCount} ranks down.`);
    }

    if (comparedScores) {
        let upScoreCount = 0;
        let downScoreCount = 0;
        comparedScores.forEach(change => {
            if (change > 0) {
                upScoreCount++;
            } else if (change < 0) {
                downScoreCount++;
            }
        });
        console.log(`Report: ${upScoreCount} scores up, ${downScoreCount} scores down.`);
    }

 

    if (todayRanks.length === yesterdayRanks.length) {
      for (let i = 0; i < todayRanks.length; i++) {
          const rankDifference = todayRanks[i] - yesterdayRanks[i];
          if (rankDifference > 0) {
              console.log(`Rank ${i + 1} has moved up by ${rankDifference} rank(s).`);
          } else if (rankDifference < 0) {
              console.log(`Rank ${i + 1} has moved down by ${Math.abs(rankDifference)} rank(s).`);
          } else {
              console.log(`Rank ${i + 1} remains unchanged.`);
          }
      }
  } else {
      console.error("Length of todayRanks and yesterdayRanks are not the same.");
  }

  }
  
  
// Compare ranks between today and yesterday
compareScores(todayScores: number[], yesterdayScores: number[]) {
  if (todayScores.length !== yesterdayScores.length) {
      console.error("Error: Length of todayScores and yesterdayScores are not the same.");
      return [];
  }

  const scoreChanges = todayScores.map((todayScore, index) => {
      return todayScore - yesterdayScores[index];
  });

  return scoreChanges;
}
compareRanks(todayRanks: number[], yesterdayRanks: number[]) {
  if (todayRanks.length !== yesterdayRanks.length) {
      console.error("Error: Length of todayRanks and yesterdayRanks are not the same.");
      return [];
  }

  const rankChanges = todayRanks.map((todayRank, index) => {
      return todayRank - yesterdayRanks[index];
  });

  return rankChanges;
}
// Get rank data
// ฟังก์ชันดึงข้อมูลลำดับ (rank)
getRankData(data: any[]) {
  // ใช้เมทอด map เพื่อวนลูปผ่านข้อมูลในอาร์เรย์แล้วดึงค่าลำดับออกมา
  return data.map(entry => entry.rank);
}

// ฟังก์ชันดึงข้อมูลคะแนนรวม (total_score)
getTotalScoreData(data: any[]) {
  // ใช้เมทอด map เพื่อวนลูปผ่านข้อมูลในอาร์เรย์แล้วดึงค่าคะแนนรวมออกมา
  return data.map(entry => entry.total_score);
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


