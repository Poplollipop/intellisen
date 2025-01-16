import { Routes } from '@angular/router';
import { HomePageComponent } from './page/home-page/home-page.component';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { RegisterPageComponent } from './page/register-page/register-page.component';
import { SearchPageComponent } from './page/search-page/search-page.component';
import { ResultPageComponent } from './page/result-page/result-page.component';
import { SearchResultPageComponent } from './page/search-result-page/search-result-page.component';
import { ViewFullTextPageComponent } from './page/view-full-text-page/view-full-text-page.component';
import { EditInfoPageComponent } from './page/edit-info-page/edit-info-page.component';
import { ForgotPasswordPageComponent } from './page/forgot-password-page/forgot-password-page.component';
import { ResetPasswordPageComponent } from './page/reset-password-page/reset-password-page.component';
import { AccountCenterPageComponent } from './page/account-center-page/account-center-page.component';
import { AccountMainPageComponent } from './page/account-center-page/account-main-page/account-main-page.component';
import { AccountProfilePageComponent } from './page/account-center-page/account-profile-page/account-profile-page.component';
import { HistoricalRecordComponent } from './page/account-center-page/historical-record/historical-record.component';
import { MyBookmarksComponent } from './page/account-center-page/my-bookmarks/my-bookmarks.component';
import { ClientManagementComponent } from './page/account-center-page/client-management/client-management.component';
import { DeleteAccountComponent } from './page/account-center-page/delete-account/delete-account.component';
import { MembersManagementComponent } from './page/account-center-page/members-management/members-management.component';
import { ViewHistoryComponent } from './page/account-center-page/view-history/view-history.component';

export const routes: Routes = [
  { path: '', redirectTo:'/search', pathMatch:'full' },     // 導向首頁
  { path: 'home', component: HomePageComponent },           // 主畫面路由
  { path: 'result', component: ResultPageComponent },       // 結果頁面路由
  { path: 'login', component: LoginPageComponent },         // 登入頁面
  { path: 'register', component: RegisterPageComponent },   // 註冊頁面
  { path: 'search', component: SearchPageComponent},         // 搜尋頁
  { path: 'search-result', component: SearchResultPageComponent }, // 搜尋結果頁面
  { path: 'full-text', component: ViewFullTextPageComponent }, // 查看全文頁面
  { path: 'full-text/:groupId', component: ViewFullTextPageComponent }, // 查看全文頁面
  { path: 'edit-info', component: EditInfoPageComponent }, // 編輯個人資料頁面
  { path: 'forgot-password', component: ForgotPasswordPageComponent }, // 編輯個人資料頁面
  { path: 'reset-password', component: ResetPasswordPageComponent }, // 重置密碼頁面
  { path: 'account-center', component: AccountCenterPageComponent,
    children: [
      { path: '', component: AccountProfilePageComponent},   // 預設首頁
      { path: 'account-main', component: AccountMainPageComponent },  // 首頁
      { path: 'account-profile', component: AccountProfilePageComponent },  // 個人資訊
      { path: 'my-bookmarks', component: MyBookmarksComponent },   // 我的書籤
      { path: 'view-history', component: ViewHistoryComponent },   // 觀看紀錄
      { path: 'members-management', component: MembersManagementComponent },  // 成員管理
      { path: 'client-management', component: ClientManagementComponent },  // 成員管理
      { path: 'delete-account', component: DeleteAccountComponent },   // 刪除帳號
      { path: 'management', component: MembersManagementComponent },  // 管理
      { path: 'historical-record', component : HistoricalRecordComponent}, // 觀看紀錄
    ]
  }
];
