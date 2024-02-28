import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthenticationGuard } from '../app/authen.guard';


export const routes: Routes = [
    {path:'',component:MainComponent},
    { path: 'id/:uid', component: MainComponent, canActivate: [AuthenticationGuard] },
    {path:'login' ,component:LoginComponent},
    {path:'signin' ,component:RegisterComponent},
    
];
