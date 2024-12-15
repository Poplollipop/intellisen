import { Routes } from '@angular/router';
import { ResultPageComponent } from './component/result-page/result-page.component';
import { AppComponent } from './app.component';
import { HomePageComponent } from './component/home-page/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent }, // 主畫面路由
  { path: 'result', component: ResultPageComponent }, // 結果頁面路由
  { path: '**', redirectTo: '' }, // 捕獲未知路徑並跳回主畫面
];
