import { Component, inject, PLATFORM_ID } from '@angular/core';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-sidevav',
  imports: [RouterLinkActive, RouterLink, MatIconModule],
  templateUrl: './sidevav.component.html',
  styleUrl: './sidevav.component.scss',
})
export class SidevavComponent {
  private readonly platformId = inject(PLATFORM_ID); // 確保程式碼在瀏覽器上執行與 sessionStorage 存在

  role: string | null = '';
  name: string | null = '';
  menuItems: { icon: string ; label: string; link: string }[] = [];

  constructor(
    public session: SessionServiceService,
    private http: HttpClientService,
    private router: Router
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.role = JSON.parse(sessionStorage.getItem('userData')!).role;
      this.name = JSON.parse(sessionStorage.getItem('userData')!).name;;
    }

    switch (this.role) {
      case 'lawFirm':
        this.role = '事務所'
        this.menuItems = [
          // { label: '首頁', link: '/account-center/account-main' },
          { icon: "person" , label: '個人資料', link: '/account-center/account-profile' },
          { icon: 'bookmark' , label: '書籤', link: '/account-center/my-bookmarks' },
          { icon: 'history' , label: '觀看紀錄', link: '/account-center/historical-record' },
          { icon: 'manage_accounts' , label: '成員管理', link: '/account-center/members-management' },
          { icon: 'person_remove' , label: '刪除帳號', link: '/account-center/delete-account' },
        ];
        break;
      case 'lawyer':
        this.role = '律師'
        this.menuItems = [
          // { label: '首頁', link: '/account-center/account-main' },
          { icon: "person" ,  label: '個人資料', link: '/account-center/account-profile' },
          { icon: 'bookmark' ,  label: '書籤', link: '/account-center/my-bookmarks' },
          { icon: 'history' ,  label: '觀看紀錄', link: '/account-center/historical-record' },
          // { icon: 'manage_accounts' ,  label: '客戶管理', link: '/account-center/client-management' },
          { icon: 'person_remove' ,  label: '刪除帳號', link: '/account-center/delete-account' },
        ];
        break;
      case 'user':
        this.role = '一般使用者'
        this.menuItems = [
          // { label: '首頁', link: '/account-center/account-main' },
          { icon: 'person' ,  label: '個人資料', link: '/account-center/account-profile' },
          { icon: 'bookmark' ,  label: '書籤', link: '/account-center/my-bookmarks' },
          { icon: 'history' ,  label: '觀看紀錄', link: '/account-center/' },
          { icon: 'person_remove' ,  label: '刪除帳號', link: '/account-center/delete-account' },
        ];
        break;
      case 'guest':
        this.role = '訪客'
        this.menuItems = [
          // { label: '首頁', link: '/account-center/account-main' },
          { icon: 'person' ,  label: '個人資料', link: '/account-center/account-profile' },
          { icon: 'person_remove' ,  label: '刪除帳號', link: '/account-center/delete-account' },
        ];
        break;
    }
  }


  // 刪除帳號
  goDelete() {
    this.router.navigateByUrl('/account-center/delete-account')
  }

}
