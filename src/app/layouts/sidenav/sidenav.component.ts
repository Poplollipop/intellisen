import { Component, inject, PLATFORM_ID } from '@angular/core';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-sidenav',
  imports: [RouterLinkActive, RouterLink, MatIconModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  private readonly platformId = inject(PLATFORM_ID); // 確保程式碼在瀏覽器上執行與 sessionStorage 存在

  role: string | null = '';
  name: string | null = '';
  menuItems: { icon: string ; label: string; link: string }[] = [];
  imageUrl: string | null = null; // 用戶圖像路徑

  constructor(
    public session: SessionServiceService,
    private http: HttpClientService,
    private router: Router
  ) { }

  ngOnInit() {
    // 訂閱 session 的 taskCompleted 實體
    // 等待 account-center-page 的 get_user_info api 取資料後
    // 再執行 show_sidevav 顯示 sidevav 可選擇的內容
    this.session.taskCompleted$.subscribe(() =>{
      this.show_sidevav();
    })
  }

  show_sidevav(){
    if (isPlatformBrowser(this.platformId)) {
      // 取得header資訊
      this.role = JSON.parse(sessionStorage.getItem('userData')!).role;
      this.name = JSON.parse(sessionStorage.getItem('userData')!).name;
    }
    // 根據不同角色顯示不同sidenav選項
    switch (this.role) {
      case 'lawFirm':
        this.role = '事務所'
        this.menuItems = [
          // { label: '首頁', link: '/account-center/account-main' },
          { icon: "person" , label: '個人資料', link: '/account-center/account-profile' },
          { icon: 'bookmark' , label: '書籤', link: '/account-center/my-bookmarks' },
          { icon: 'history' , label: '瀏覽紀錄', link: '/account-center/historical-record' },
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
          { icon: 'history' ,  label: '瀏覽紀錄', link: '/account-center/historical-record' },
          { icon: 'manage_accounts' ,  label: '客戶管理', link: '/account-center/client-management' },
          { icon: 'person_remove' ,  label: '刪除帳號', link: '/account-center/delete-account' },
        ];
        break;
      case 'user':
        this.role = '一般會員'
        this.menuItems = [
          // { label: '首頁', link: '/account-center/account-main' },
          { icon: 'person' ,  label: '個人資料', link: '/account-center/account-profile' },
          { icon: 'bookmark' ,  label: '書籤', link: '/account-center/my-bookmarks' },
          { icon: 'history' ,  label: '瀏覽紀錄', link: '/account-center/historical-record' },
          { icon: 'person_remove' ,  label: '刪除帳號', link: '/account-center/delete-account' },
        ];
        break;
      case 'guest':
        this.role = '使用者'
        this.menuItems = [
          // { label: '首頁', link: '/account-center/account-main' },
          { icon: 'person' ,  label: '個人資料', link: '/account-center/account-profile' },
          { icon: 'person_remove' ,  label: '刪除帳號', link: '/account-center/delete-account' },
        ];
        break;
    }

    this.getUserProfilePicture(); // 取得用戶頭像
  }


  // 刪除帳號
  goDelete() {
    this.router.navigateByUrl('/account-center/delete-account')
  }

  getUserProfilePicture() {
    const email = this.session.getEmail();  // 用戶的email
    const url = 'http://localhost:8080/accountSystem/get-profile-picture'; // API

    // 獲取用戶圖片
    this.http.getImage(url, { email: email }).subscribe({
      next: (response: HttpResponse<ArrayBuffer>) => {
        // 檢查 response.body 是否為 null
        if (response.body) {
          // 獲取 Content-Type
          const contentType = response.headers.get('Content-Type') || 'image/jpeg'; // 默認為 'image/jpeg'

          // 將 ArrayBuffer 轉換為 Base64 字串
          const base64String = this.arrayBufferToBase64(response.body);

          // 動態設置圖片的 MIME 類型，並設置 imageUrl
          this.imageUrl = `data:${contentType};base64,${base64String}`;
        } else {
          return;
        }
      },
      error: (error) => {
        return;
      }
    });
  }

  //  將 ArrayBuffer 格式的二進位數據轉換為 Base64 格式
  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = ''; // 儲存從 ArrayBuffer 中提取的每一個字節的字符
    const bytes = new Uint8Array(buffer); // 將 ArrayBuffer 轉換為 Uint8Array
    const length = bytes.byteLength; // 獲取 Uint8Array 的長度
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]); // 將二進位數據轉換為文本(binary 字串)
    }
    return window.btoa(binary); // 將 binary 字串轉換為 Base64 編碼
  }
}
