import { ChangeDetectorRef, Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';



@Component({
  selector: 'app-toolbar',
  imports: [
    MatToolbarModule,
    RouterLink
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  private readonly platformId = inject(PLATFORM_ID); // 確保程式碼在瀏覽器上執行與 sessionStorage 存在

  // 從 app.component 取得當前路徑
  @Input() routerUrl: string = '';
  userName !: string;
  userRole !: string;

  constructor(
    private router: Router,
    public session: SessionServiceService,
    private http: HttpClientService,
    private cdRef: ChangeDetectorRef
  ) { }

  goLogin() {
    this.router.navigateByUrl('/login')
  }

  ngOnInit() {
    // 取得會員資訊
    if (isPlatformBrowser(this.platformId)) {
      const data = sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')!) : false;
      if (data) {
        this.userName = data.name === 'guest' ? '會員' : data.name; // 防止預設名稱顯示在畫面上
        this.userRole = data.role;
      }
    }
  }

  goLogout() {
    Swal.fire({
      title: '登出確認',
      text: '確定要登出嗎？',
      icon: 'info',
      showCancelButton: true,   // 顯示取消按鈕
      confirmButtonText: '確定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.postApi2('http://localhost:8080/accountSystem/logout', '').subscribe({
          next: (response: any) => {
            if (response.body.code != 200) {
              // 登出失敗
              Swal.fire({
                text: '登出失敗',
                icon: 'error',
                confirmButtonText: '確定'
              });
              return;
            }
          },
          error: (error) => {
            // 請求失敗
            Swal.fire({
              text: '登出失敗',
              icon: 'error',
              confirmButtonText: '確定'
            });
            return;
          }
        });
        // 用戶確認登出，執行登出操作
        Swal.fire({
          text: '您已成功登出。',
          icon: 'info',
          confirmButtonText: '關閉'
        });
        this.session.clearIsLogin();
        this.session.clearEmail();
        console.log(this.session.getIsLogin());
        // 手動觸發變更檢測，更新顯示登出狀態
        this.cdRef.detectChanges();
        this.router.navigateByUrl('/search')
      }
    });
  }

  goRegister() {
    this.router.navigateByUrl('/register')
  }

  goAccountCenter() {
    this.router.navigateByUrl('/account-center')
  }

  toChinese(role: string): string {
    return this.session.toChinese(role);
  }
}




