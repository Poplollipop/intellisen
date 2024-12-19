import { Routes } from '@angular/router';
import { ResultPageComponent } from './page/result-page/result-page.component';
import { HomePageComponent } from './page/home-page/home-page.component';

export const routes: Routes = [
  { path: '', redirectTo:'/home', pathMatch:'full' },       // 導向首頁
  { path: 'home', component: HomePageComponent },           // 主畫面路由
  { path: 'result', component: ResultPageComponent },       // 結果頁面路由
];
