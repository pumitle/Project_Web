import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthenticationGuard } from '../app/authen.guard';
import { UploadComponent } from './pages/upload/upload.component';
import { VotesComponent } from './pages/votes/votes.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ToprankComponent } from './pages/toprank/toprank.component';


export const routes: Routes = [
    {path:'',component:MainComponent},
    { path: 'id/:uid', component: MainComponent, canActivate: [AuthenticationGuard] },
    {path:'login' ,component:LoginComponent},
    {path:'signin' ,component:RegisterComponent},
    {path:'upload',component:UploadComponent,canActivate: [AuthenticationGuard]},
    {path:'vote',component:VotesComponent,canActivate: [AuthenticationGuard]},
    {path:'profile',component:ProfileComponent,canActivate: [AuthenticationGuard]},
    {path:'toprank',component:ToprankComponent,canActivate: [AuthenticationGuard]},
    
];
