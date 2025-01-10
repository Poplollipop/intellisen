import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';
import Swal from 'sweetalert2';



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
  // 從 app.component 取得當前路徑
  @Input() routerUrl: string = '';

  constructor(
    private router: Router,
    public session: SessionServiceService,
    private http: HttpClientService,
    private cdRef: ChangeDetectorRef
  ) { }

  goLogin() {
    this.router.navigateByUrl('/login')
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
}




