import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password-page',
  imports: [FormsModule],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss'
})
export class ResetPasswordPageComponent {
  email!: string;
  errorMessage: string = '';
  newPassword!: string;
  resetPasswordData!: any;

  constructor(
    private session: SessionServiceService,
    private http: HttpClientService
  ) { }

  // 驗證email格式
  accountValidation(input: string): boolean {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;;
    return regex.test(input);
  }

  // 顯示email錯誤
  updateEmailForm() {
    const isValid = this.accountValidation(this.email);
    if (isValid) {
      this.errorMessage = '';
    } else {
      this.errorMessage = '請輸入正確Email格式!';
    }
  }

  // 重置密碼
  resetPassword() {
    this.resetPasswordData = {
      email: this.email,
      password: this.newPassword
    }

    console.log(this.resetPasswordData);

    this.http.postApi2('http://localhost:8080/accountSystem/reset-password', this.resetPasswordData).subscribe({
      next: (response: any) => {
        if (response.body.code == 200) {
          Swal.fire({
            title: '密碼重置',
            text: '密碼已更新成功！',
            icon: 'success',
            confirmButtonText: '確定'
          });
          console.log(response.body.code);
        }

        if (response.body.code != 200) {
          Swal.fire({
            title: '密碼重置失敗',
            text: '請檢查密碼重置驗證信是否已點擊。',
            icon: 'error',
            confirmButtonText: '再試一次'
          });
          console.log(response.body.code);
        }
      },
      error: (error) => {
        Swal.fire({
          title: '密碼重置失敗',
          text: '請檢查密碼重置驗證信是否已點擊。',
          icon: 'error',
          confirmButtonText: '再試一次'
        });
      }
    })
  }
}
