import { Routes } from '@angular/router';
import { HomePageComponent } from './page/home-page/home-page.component';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { RegisterPageComponent } from './page/register-page/register-page.component';
import { SearchPageComponent } from './page/search-page/search-page.component';
import { ResultPageComponent } from './page/result-page/result-page.component';
import { SearchResultPageComponent } from './page/search-result-page/search-result-page.component';
import { ViewFullTextPageComponent } from './page/view-full-text-page/view-full-text-page.component';

export const routes: Routes = [
  { path: '', redirectTo:'/search', pathMatch:'full' },     // 導向首頁
  { path: 'home', component: HomePageComponent },           // 主畫面路由
  { path: 'result', component: ResultPageComponent },       // 結果頁面路由
  { path: 'login', component: LoginPageComponent },         // 登入頁面
  { path: 'register', component: RegisterPageComponent },   // 註冊頁面
  { path: 'search', component: SearchPageComponent},         // 搜尋頁
  { path: 'search-result', component: SearchResultPageComponent }, // 搜尋結果頁面
  { path: 'full-text', component: ViewFullTextPageComponent }, // 查看全文頁面
  { path: 'full-text/:id', component: ViewFullTextPageComponent } // 查看全文頁面
];
