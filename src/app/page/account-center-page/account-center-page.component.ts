import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';
import Swal from 'sweetalert2';
import { SidevavComponent } from '../../layouts/sidevav/sidevav.component';

@Component({
  selector: 'app-account-center-page',
  imports: [
    SidevavComponent,
  ],
  templateUrl: './account-center-page.component.html',
  styleUrl: './account-center-page.component.scss'
})
export class AccountCenterPageComponent {
  role!: string;
  name!: string;
  phone!: string;
  email!: string;
  userDataReq!: any;
  deleteUserData!: any;

  constructor(
    private router: Router,
    public session: SessionServiceService,
    private http: HttpClientService
  ) { }

  ngOnInit(): void {
    this.email = this.session.getEmail();
    this.userDataReq = {
      email: this.email
    }
    this.http.postApi2('http://localhost:8080/accountSystem/get-user-info', this.userDataReq).subscribe({
      next: (response: any) => {
        if (response.body.code == 200) {
          console.log(response);
          this.role = response.body.role != 'guest' ? response.body.role : '尚無身分資訊';
          this.name = response.body.name != 'guest' ? response.body.name : '尚無名稱資訊';
          this.phone = response.body.phone != '0' ? response.body.phone : '尚無電話資訊';
        }
      },
      error: (error) => {
        this.role = '';
        this.name = '';
        this.phone = '';
      }
    })
  }

  goToUpdatePage() {
    this.router.navigateByUrl('/edit-info')
  }

  // 刪除帳戶
  confirmDelete() {
    this.deleteUserData = {
      email: this.email
    }

    this.http.postApi2('http://localhost:8080/accountSystem/delete-user', this.deleteUserData).subscribe({
      next: (response: any) => {
        if (response.body.code == 200) {
          Swal.fire({
            title: '刪除帳戶通知',
            text: '確定要刪除嗎？',
            icon: 'info',
            showCancelButton: true,   // 顯示取消按鈕
            confirmButtonText: '確定',
            cancelButtonText: '取消'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                text: '您已成功刪除。',
                icon: 'info',
                confirmButtonText: '關閉'
              });
              this.session.clearIsLogin();
              this.router.navigateByUrl('/search')
            }
          });
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
}
