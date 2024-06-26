  import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
  import { MysqlService } from '../app/../../mysql.service';
  import { HttpClient, HttpClientModule } from '@angular/common/http';
  import { UserResponese, UploadRes,ValueX } from '../../Modeldatabase/user_get';
  import { lastValueFrom } from 'rxjs';
  import { MatButtonModule } from '@angular/material/button';
  import { Router } from '@angular/router';
  import { AuthenticationService } from '../../authen.service';
  import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
  import { ChangeDetectorRef } from '@angular/core';
  import Swal from 'sweetalert2';
  import { utcToZonedTime, format } from 'date-fns-tz';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatSelectModule } from '@angular/material/select';
  import { FormsModule } from '@angular/forms';
  import {MatDialogModule} from '@angular/material/dialog';
  import { MatIconModule } from '@angular/material/icon';
  @Component({
    selector: 'app-votes',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, HttpClientModule, MatButtonModule, SlickCarouselModule,MatFormFieldModule,MatSelectModule,FormsModule,MatDialogModule,MatIconModule ],
    templateUrl: './votes.component.html',
    styleUrl: './votes.component.scss'
  })
  export class VotesComponent implements OnInit {
  winscore: any;
  losescore: any;
    WinnerImg: any;
    LOserImg: any;
    K: any;
    WinnerNewScore: any;
    LoserNewScore: any;
  
    logout(): void {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
    user: UserResponese | undefined;
    data: UploadRes[] = [];
    uid: any;

    selectedImage: any | null = null;
    selectImageId: any;
    imageId: any;
    images: any;
    selectScore:any;
    unselect: any;
    UnselectScore: any;

    winnerNewScore :number | undefined;
    loserNewScore :number | undefined;
    winnerScore:number | undefined;
    loserScore: number | undefined;
    totalScores: { [key: number]: number } = {}; 
    newtotalScores: { [key: number]: number } = {}; 
    displayedTotalScores: { [key: number]: number } = {}; 
    winnerScoreIncrease: number | undefined;
    loserScoreDecrease:number | undefined;
    winnerExpectedScore:any;
    loserExpectedScore: any;

    loading: boolean = false;
    originalData: UploadRes[] = [];
    Xvalue: ValueX[] = [];

    minutes: string[] = [];
    seconds: string[] = [];

    selectedMinute: any;
    selectedSecond: any;
    showEloChecked: boolean = false;

    constructor(private http: HttpClient, private activateRoute: ActivatedRoute, private mysqlService: MysqlService, private authService: AuthenticationService,private router:Router) { 

      // Populate minutes
      for (let i = 0; i < 60; i++) {
        this.minutes.push(this.pad(i));
      }

      // Populate seconds
      for (let i = 0; i < 60; i++) {
        this.seconds.push(this.pad(i));
      }
    }
    
    pad(num: number): string {
      return num < 10 ? '0' + num : num.toString();
    }

    @ViewChild('loadingWindow') loadingWindow!: ElementRef<any>;

    showLoadingWindow() {
    this.loading = true;
  }

  hideLoadingWindow() {
    this.loading = false;
  }

    ngOnInit(): void {
      this.showLoadingWindow();
      this.authService.initializeAuthentication().then(user => {
        console.log('User data:', user);
        if (user) {
          console.log('User authenticated:', user);
          this.user = user;
          this.loadDataAsync();
  
        }
        else {
          console.log('User not authenticated');
          this.loadDataAsync();
        
  
        }
      });
    }

    onSelectChange(event: any) {
      const selectedValue = event.target.value;
    
      if (selectedValue === 'logout') {
        this.logout();
      }
      if (selectedValue === 'upload') {
        this.goToUpload();
      
      }
      if (selectedValue === 'profile') {
        this.goToProfile();
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
    goToUpload(): void {
      this.router.navigate(['/upload']);
    }
    goToProfile(): void {
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



    toggleCheckbox() {
      const checkbox = document.getElementById('showElo') as HTMLInputElement;
      checkbox.checked = !checkbox.checked;
      this.showEloChecked = checkbox.checked;
      localStorage.setItem('showEloChecked', checkbox.checked.toString());
    }
    
    showEloFromLocalStorage() {
      const checkbox = document.getElementById('showElo') as HTMLInputElement;
      const showEloChecked = localStorage.getItem('showEloChecked');
      if (showEloChecked === 'true') {
          checkbox.checked = true;
      } else {
          checkbox.checked = false;
      }
      this.showEloChecked = checkbox.checked;
    }
    
  // เพิ่มเมื่อมีการเปลี่ยนสถานะของ checkbox
  onChangeCheckbox(checked: boolean) {
    localStorage.setItem('showEloChecked', checked.toString());
  }


  openPopup() {
    document.getElementById('myModal')!.classList.remove('hide');
    document.getElementById('myModal')!.classList.add('show');
    document.getElementById('myModal')!.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

    async closePopup() {
      document.body.style.overflow = 'auto'; // อนิเมชันเสร็จสิ้น ปรับ overflow เพื่อเปลี่ยนเป็น auto
      const modal = document.getElementById('myModal')!;
      modal.classList.add('hide'); // เพิ่มคลาส "hide" เพื่อเล่นอนิเมชัน fadeOut
      await new Promise(resolve => setTimeout(resolve, 1000)); // รอให้อนิเมชันเสร็จสิ้น (300 มิลลิวินาที)
      modal.style.display = 'none'; // ซ่อนป๊อปอัพ
      // รีโหลดหน้าเว็บหลังจากที่แสดงข้อมูลเสร็จสิ้น
      window.location.reload();
        
    }

  

    async loadDataAsync() {
      this.data = await this.mysqlService.getdataupload();
      // this.shuffleImages(this.data);
      // console.log("Shuffled Data:", this.data);  
      console.log("data is ", this.data);
      
    // เช็คว่าภาพยังไม่ถูกสลับ และเรียกใช้ shuffleImages() เพื่อสลับภาพ
    if (this.data.some(item => !this.originalData.some(originalItem => originalItem.upid === item.upid))) {
      this.shuffleImages(this.data);
    }
    console.log("Shuffled Data:", this.data);  
      this.calculateTotalScores();
      console.log("Total Scores:", this.totalScores);
      this.hideLoadingWindow();
      this.showEloFromLocalStorage();
      this.getTime();
    }





    async shuffleImages(images: any[]) {
      const uniqueIds = new Set<number>();
      const votedPairs = new Set<string>();
      const getPairKey = (index1: number, index2: number) => `${images[index1].upid}-${images[index2].upid}`;
    
      for (let i = images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [images[i], images[j]] = [images[j], images[i]];
      }
    
      for (let i = 0; i < images.length - 1; i += 2) {
        let swapped = false;
    
        do {
          if (images[i].upid !== images[i + 1].upid && !uniqueIds.has(images[i].upid) && !uniqueIds.has(images[i + 1].upid)) {
            const pairKey = getPairKey(i, i + 1);
            if (!votedPairs.has(pairKey)) {
              swapped = true;
              votedPairs.add(pairKey);
              uniqueIds.add(images[i].upid);
              uniqueIds.add(images[i + 1].upid);
            } else {
              const j = (i + 2) % images.length;
              [images[i + 1], images[j]] = [images[j], images[i + 1]];
              await this.delay(0); // Introduce a delay to allow the UI to update
            }
          } else {
            const j = (i + 2) % images.length;
            [images[i + 1], images[j]] = [images[j], images[i + 1]];
            await this.delay(0); // Introduce a delay to allow the UI to update
          }
        } while (!swapped);
      }
    }

    delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async selectImage(side: string, item: any, index: number, imageId: any, score: number, Unselectscore: number,unselectedImage: any,imgwinner:any): Promise<void> {
    // ตรวจสอบว่ายังไม่ถึงเวลา cooldown หรือไม่
    if (!(await this.canVote(imageId))) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Vote Yet',
        text: `Please wait ${this.selectedMinute} min.${this.selectedSecond} sec. before voting again for image ID: ${imageId}`,
      });
      setTimeout(() => {
        // รีโหลดหน้าเว็บหลังจากที่แสดงข้อมูลเสร็จสิ้น
        window.location.reload();
      }, 3000);

      return; // หากยังไม่ถึงเวลา cooldown ให้ย้อนกลับและไม่ทำการโหวต
    }

      this.selectedImage = side;
      this.selectImageId = imageId;
      this.selectScore = score;
      this.UnselectScore = Unselectscore;
      this.unselect = unselectedImage;
      this.WinnerImg = imgwinner;
   
      this.voteForImage(this.selectImageId);
      console.log("cowdoen ID ",this.selectImageId);

      // เรียกใช้ calvote และส่ง imageId ไป
      this.calvote( imageId,unselectedImage,score,Unselectscore).then(({ winnerScoreIncrease, loserScoreDecrease }) => {
        // เรียกใช้ getScores เพื่อนำค่า winnerScoreIncrease และ loserScoreDecrease ไปแสดงทันที
        this.getScores(winnerScoreIncrease, loserScoreDecrease);
       

      // ตรวจสอบ checkbox ว่าถูกเลือกหรือไม่
      if (this.showEloChecked) {
        // เรียกใช้ฟังก์ชันแสดง popup
        this.openPopup();
      }else{
      // รอสักครู่ก่อนที่จะรีโหลดหน้าเว็บ
      setTimeout(() => {
        // รีโหลดหน้าเว็บหลังจากที่แสดงข้อมูลเสร็จสิ้น
         window.location.reload();
        }, 2000);
      }

      });

      console.log("Unimgid", unselectedImage);
      console.log("selectid",imageId);
      console.log("score", score);
      console.log("Unselectscore",  Unselectscore);

    }

      async insertvote(selectImageId: any,UnselectImageId: any ,winscore : number,losescore : number) {
        // Assuming you have an API endpoint for voting
        const voteApiUrl = 'https://adv-voote.onrender.com/voteapi/vote';

        try {
          // Assuming you have the user object available after authentication
          const user = this.user;
        
          if (!user) {

              let userId = null; // Send a vote request to the server
              const now = new Date();
              const timeZone = 'Asia/Bangkok';  // Set to Thailand's time zone
              const zonedTime = utcToZonedTime(now, timeZone);
              const isoString = format(zonedTime, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
              
            const responseWin  = await this.http.post(voteApiUrl, { user_fk_id: userId, up_fk_id: selectImageId, whowon: 1, score: winscore, vote_date:isoString}).toPromise();
            const responseLoser  = await this.http.post(voteApiUrl, {user_fk_id: userId,up_fk_id: UnselectImageId, whowon: 0, score: losescore,vote_date:isoString}).toPromise();

        Swal.fire({
          icon: 'success',
          title: 'Vote Successful!',
          text: 'Thank you for voting.',
        });
        
          } 

        if (user) { 

          const userId = user.uid;
          
          // Send a vote request to the server
          const now = new Date();
          const timeZone = 'Asia/Bangkok';  // Set to Thailand's time zone
          const zonedTime = utcToZonedTime(now, timeZone);
          const isoString = format(zonedTime, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
          
        const responseWin  = await this.http.post(voteApiUrl, { user_fk_id: userId, up_fk_id: selectImageId, whowon: 1, score: winscore, vote_date:isoString}).toPromise();
  
        // Insert data for the non-selected image
        const responseLoser  = await this.http.post(voteApiUrl, {user_fk_id: userId,up_fk_id: UnselectImageId, whowon: 0, score: losescore,vote_date:isoString}).toPromise();

          Swal.fire({
            icon: 'success',
            title: 'Vote Successful!',
            text: 'Thank you for voting.',
          });
        } 


      } catch (error) {
        // Handle error if the vote request fails
        console.error('Vote failed:', error);
        Swal.fire({
          icon: 'error',
          title: 'Vote Failed',
          text: 'Please try again later.',
        });
      }
    }

    calculateEloRating(winnerScore: number, loserScore: number): { winnerNewScore: number, loserNewScore: number } {
      const k = 32;
      this.K = k;
      const winnerExpectedScore = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
      const loserExpectedScore = 1 / (1 + Math.pow(10, (winnerScore - loserScore) / 400));
      
      console.log(" winnerExpectedScore:",  winnerExpectedScore);
      console.log("loserExpectedScore:",  loserExpectedScore);
      this.winnerExpectedScore = winnerExpectedScore;
      this.loserExpectedScore = loserExpectedScore;
      
      const winnerNewScore = winnerScore + k * (1 - winnerExpectedScore);
      const loserNewScore = loserScore + k * (0 - loserExpectedScore);

      console.log("New winner score:", winnerNewScore);
      console.log("New loser score:", loserNewScore);

      return { winnerNewScore, loserNewScore };
  }

  async calvote(winnerId: number, loserId: number, winscore: number, losescore: number): Promise<{ winnerScoreIncrease: number, loserScoreDecrease: number }>{
    console.log("Winner Score before Elo calculation:", winscore);
    console.log("Loser Score before Elo calculation:", losescore);
    
    // Calculate Elo rating
    const { winnerNewScore, loserNewScore } = this.calculateEloRating(winscore, losescore);
    this.WinnerNewScore = winnerNewScore;
    this.LoserNewScore = loserNewScore;
    
    const winnerScoreIncrease = winnerNewScore - winscore;
    const loserScoreDecrease = loserNewScore-losescore;

    if (winscore === 100) {
      await this.insertvote(winnerId, loserId,winnerNewScore,loserScoreDecrease);
    }else if(losescore === 100){
      await this.insertvote(winnerId, loserId,winnerScoreIncrease,loserNewScore);
    }else{
        // Insert vote
    await this.insertvote(winnerId, loserId,winnerScoreIncrease,loserScoreDecrease);
    }
    // Calculate changes in scores
  
    // Output the changes in scores
    console.log("Winner Score Increase:", winnerScoreIncrease);
    console.log("Loser Score Decrease:", loserScoreDecrease);

    // Calculate new total scores
    this.newcalculateTotalScores(winnerId, loserId, winnerScoreIncrease, loserScoreDecrease);
  
    // Output the new calculated scores
    console.log("Calculated winner score:", winnerNewScore);
    console.log("Calculated loser score:", loserNewScore);
    return { winnerScoreIncrease, loserScoreDecrease };
  }

    calculateTotalScores() {
      // Reset total scores
      this.totalScores = {};

      // Recalculate total scores based on ID
      this.data.forEach((item) => {
        this.totalScores[item.upid] = (this.totalScores[item.upid] || 0) + item.score;
      });
    }
    
    newcalculateTotalScores(winnerId: number, loserId: number, winscore: number, losescore: number): void {
      this.newtotalScores = {};
    
      // Calculate new total scores by adding the existing score and the winscore/losescore
      this.data.forEach((item) => {
        this.newtotalScores[item.upid] = (this.newtotalScores[item.upid] || 0) + item.score;
    
        // Add winscore to the winner ID and losescore to the loser ID
        if (item.upid === winnerId) {
          this.newtotalScores[item.upid] += winscore ;
        } else if (item.upid === loserId) {
          this.newtotalScores[item.upid] += losescore ;
        }
      });
    
      // Update the 'score' property in this.data with the newly calculated total scores
      this.data.forEach((item) => {
        item.score = this.newtotalScores[item.upid];
      });
    
      // Log and display the new total scores and updated data
      console.log('New Total Scores:', this.newtotalScores);

    
      // Display the new total scores in the UI (assuming you have a property to bind)
      this.displayedTotalScores = this.newtotalScores;
      console.log('Updated Data:',this.displayedTotalScores);
      // Object.assign(this.totalScores, tempTotalScores);
    }
    
    getScores(winnerIncrease: number, loserDecrease: number): void {
      // กำหนดค่าให้กับตัวแปรในคลาส
      this.winnerScoreIncrease = winnerIncrease;
      this.loserScoreDecrease = loserDecrease;
      console.log("Winner Score Increase:", this.winnerScoreIncrease);
      console.log("Loser Score Decrease:", this.loserScoreDecrease);
    }

    async setTime(){
      let valueX: number;
      if (this.selectedMinute && this.selectedSecond) {
      valueX = (parseInt(this.selectedMinute) * 60 + parseInt(this.selectedSecond)) * 1000;
    
      }else if(this.selectedMinute){
      valueX =parseInt(this.selectedMinute) * 60 * 1000;
    
      }else{
      valueX =parseInt(this.selectedSecond) * 1000;
      }
        // this.voteForImage(this.valueX);
        const insertApi = `https://adv-voote.onrender.com/user/numberx/${1}`;
        const Allinsert : any = await this.http.put(insertApi,{X:valueX}).toPromise();
        Swal.fire({
          icon: 'success',
          title: 'Set CooldownTime Success ',
          text: 'Thank you ' ,
        });
        console.log("Time",valueX);
    }

  async voteForImage(imageId: number) {
    // ตรวจสอบว่ามีรูปภาพนี้ใน local storage หรือไม่
    const lastVoteTime = localStorage.getItem(`lastVoteTime_${imageId}`);
    this.Xvalue = await this.mysqlService.getX(1);
    const cooldownTime: number = this.Xvalue[0].X; // ใช้ค่า X จากฐานข้อมูล
      if (lastVoteTime) {
        const lastVoteTimeMillis = parseInt(lastVoteTime, 10);
        const currentTimeMillis = new Date().getTime();
        const elapsedTime = currentTimeMillis - lastVoteTimeMillis;
        
        console.log("Time",cooldownTime);
        // ตรวจสอบว่าผ่านไปเวลา cooldown หรือไม่
        if (elapsedTime < cooldownTime) {
            console.log("โปรดรอสักครู่ก่อนที่จะโหวตซ้ำสำหรับรูปภาพ ID:", imageId);
            return; // หากยังไม่ถึงเวลา cooldown ให้ย้อนกลับ
        }
    }

    // ทำการโหวต
    console.log("โหวตสำเร็จสำหรับรูปภาพ ID:", imageId);
    console.log("Time",cooldownTime);
    // บันทึกเวลาที่โหวตสำหรับรูปภาพนี้ลงใน local storage
    localStorage.setItem(`lastVoteTime_${imageId}`, new Date().getTime().toString());
  } 

    // ตรวจสอบว่ายังไม่ถึงเวลา cooldown หรือไม่
    async canVote(imageId: any): Promise<boolean> {
      const lastVoteTime = localStorage.getItem(`lastVoteTime_${imageId}`);
      this.Xvalue = await this.mysqlService.getX(1);
      if (lastVoteTime) {
          const lastVoteTimeMillis = parseInt(lastVoteTime, 10);
          const currentTimeMillis = new Date().getTime();
          const elapsedTime = currentTimeMillis - lastVoteTimeMillis;
          const cooldownTime: number = this.Xvalue[0].X;
          return elapsedTime >= cooldownTime; // สามารถโหวตได้หากเวลาผ่านไปเพียงพอต่อการ cooldown
      }
      return true; // สามารถโหวตได้หากยังไม่มีการโหวตก่อนหน้านี้
      }


      async getTime() {
        // เรียกใช้งาน API เพื่อดึงข้อมูลเวลา
        this.Xvalue = await this.mysqlService.getX(1);
      
        // แปลงข้อมูลเวลาให้เป็นนาทีและวินาที
        const timeInMilliseconds: number = this.Xvalue[0].X;
        const timeInSeconds: number = Math.floor(timeInMilliseconds / 1000);
        const minutes: number = Math.floor(timeInSeconds / 60);
        const seconds: number = timeInSeconds % 60;
      
        // กำหนดค่าของ selectedMinute และ selectedSecond จากข้อมูลที่ได้รับ
        this.selectedMinute = minutes.toString();
        this.selectedSecond = seconds.toString();
        console.log('Selected Minute:', this.selectedMinute);
        console.log('Selected Second:', this.selectedSecond);
      }
      
  }
  function openPopup() {
    throw new Error('Function not implemented.');
  }

