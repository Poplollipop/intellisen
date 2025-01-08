import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SessionServiceService } from '../service/session-service.service';
import { HttpClientService } from '../service/http-client.service';

@Component({
  selector: 'app-forgot-password-page',
  imports: [FormsModule],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss'
})
export class ForgotPasswordPageComponent {
  email!: string;
  errorMessage: string = '';

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

  forgotPassword() {
    this.http.postApi2('http://localhost:8080/accountSystem/forgot-password', this.email).subscribe({
      next: (response: any) => {
        if (response.body.code == 200) {
          Swal.fire({
            title: '忘記密碼信已發送，請至信箱查看!',
            text: '歡迎回來！',
            icon: 'success',
            confirmButtonText: '確定'
          });
          console.log(response.body.code);
        }

        if (response.body.code != 200) {
          Swal.fire({
            title: '登入失敗',
            text: '請檢查帳號或密碼是否正確。',
            icon: 'error',
            confirmButtonText: '再試一次'
          });
          console.log(response.body.code);
        }
      },
      error: (error) => {
        Swal.fire({
          title: '登入失敗',
          text: '請檢查帳號或密碼是否正確。',
          icon: 'error',
          confirmButtonText: '再試一次'
        });
      }
    })
  }
}

