import { Component, Input } from '@angular/core';
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
    private http: HttpClientService
  ) { }

  goLogin() {
    this.router.navigateByUrl('/login')
  }

  goLogout() {
    this.http.postApi2('http://localhost:8080/accountSystem/logout', '').subscribe({
      next: (response: any) => {
        if (response.body.code == 200) {
          // 登出成功，顯示確認選項
          Swal.fire({
            title: '登出成功',
            text: '確定要登出嗎？',
            icon: 'info',
            showCancelButton: true,   // 顯示取消按鈕
            confirmButtonText: '確定',
            cancelButtonText: '取消'
          }).then((result) => {
            if (result.isConfirmed) {
              // 用戶確認登出，執行登出操作
              Swal.fire({
                text: '您已成功登出。',
                icon: 'info',
                confirmButtonText: '關閉'
              });
            }
          });
        } else {
          // 登出失敗
          Swal.fire({
            text: '登出失敗',
            icon: 'error',
            confirmButtonText: '確定'
          });
        }
      },
      error: (error) => {
        // 請求失敗
        Swal.fire({
          text: '登出失敗',
          icon: 'error',
          confirmButtonText: '確定'
        });
      }
    });


    this.session.clearIsLogin();
    this.router.navigateByUrl('/search')
  }

  goRegister() {
    this.router.navigateByUrl('/register')
  }
}




