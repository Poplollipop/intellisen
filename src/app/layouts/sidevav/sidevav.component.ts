import { Component, inject, PLATFORM_ID } from '@angular/core';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidevav',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './sidevav.component.html',
  styleUrl: './sidevav.component.scss',
})
export class SidevavComponent {
  private readonly platformId = inject(PLATFORM_ID); // 確保程式碼在瀏覽器上執行與 sessionStorage 存在

  role: string | null = '';
  menuItems: { label: string; link: string }[] = [];

  constructor(
    public session: SessionServiceService,
    private http: HttpClientService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.role = sessionStorage.getItem('role');
    }

    switch (this.role) {
      case 'lawFirm':
        this.menuItems = [
          { label: '首頁', link: '/account-center/account-main' },
          { label: '個人資料', link: '/account-center/account-profile' },
          // { label: '書籤', link: '/account-center/' },
          // { label: '觀看紀錄', link: '/account-center/' },
          // { label: '刪除帳號', link: '/account-center/' },
          // { label: '成員管理', link: '/account-center/' },
        ];
        break;
      case 'lawyer':
        this.menuItems = [
          { label: '首頁', link: '/account-center/account-main' },
          // { label: '個人資料', link: '/account-center/' },
          // { label: '書籤', link: '/account-center/' },
          // { label: '觀看紀錄', link: '/account-center/' },
          // { label: '刪除帳號', link: '/account-center/' },
          // { label: '客戶管理', link: '/account-center/' },
        ];
        break;
      case 'user':
        this.menuItems = [
          { label: '首頁', link: '/account-center/account-main' },
          // { label: '個人資料', link: '/account-center/' },
          // { label: '書籤', link: '/account-center/' },
          // { label: '觀看紀錄', link: '/account-center/' },
          // { label: '刪除帳號', link: '/account-center/' },
        ];
        break;
      case 'guest':
          this.menuItems = [
            { label: '首頁', link: '/account-center/account-main' },
            // { label: '個人資料', link: '/account-center/' },
            // { label: '刪除帳號', link: '/account-center/' },
          ];
        break;  
    }
  }
}
