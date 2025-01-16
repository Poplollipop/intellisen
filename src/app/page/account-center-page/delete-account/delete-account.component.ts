import { Component } from '@angular/core';
import { HttpClientService } from '../../../service/http-client.service';
import { SessionServiceService } from '../../../service/session-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-account',
  imports: [],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})
export class DeleteAccountComponent {

  deleteUserData!: any;
  email!: string;

  constructor(
    private http: HttpClientService,
    private session: SessionServiceService,
    private router: Router
  ) { }

  // 刪除帳戶
  confirmDelete() {
    this.deleteUserData = {
      email: this.session.getEmail()
    }

    Swal.fire({
      title: '刪除帳戶通知',
      text: '確定要刪除嗎？',
      icon: 'info',
      showCancelButton: true,   // 顯示取消按鈕
      confirmButtonText: '確定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.postApi2('http://localhost:8080/accountSystem/delete-user', this.deleteUserData).subscribe({
          next: (response: any) => {
            if (response.body.code == 200) {
              Swal.fire({
                text: '您已成功刪除。',
                icon: 'info',
                confirmButtonText: '關閉'
              });
              this.session.clearIsLogin();
              this.router.navigateByUrl('/search');
            } else {
              Swal.fire({
                text: '刪除帳戶失敗',
                icon: 'error',
                confirmButtonText: '確定'
              });
            }
          },
          error: (error) => {
            Swal.fire({
              text: '刪除帳戶失敗',
              icon: 'error',
              confirmButtonText: '確定'
            });
          }
        });
      }
    });
  }
}
