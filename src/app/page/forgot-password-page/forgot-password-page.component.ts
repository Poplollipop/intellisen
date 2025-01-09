import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-password-page',
  imports: [FormsModule],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss'
})
export class ForgotPasswordPageComponent {
  email!: string;
  errorMessage: string = '';
  forgotPasswordData!: any;

  constructor(
    private http: HttpClientService,
    private router: Router,
  ) {}

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
    this.forgotPasswordData = {
      email: this.email
    }
    this.http.postApi2('http://localhost:8080/accountSystem/forgot-password', this.forgotPasswordData).subscribe({
      next: (response: any) => {
        if (response.body.code == 200) {
          Swal.fire({
            title: '重置密碼驗證信已發送，請至信箱查看!',
            text: '請至信箱確認！',
            icon: 'success',
            confirmButtonText: '確定'
          });
          console.log(response.body.code);
          this.router.navigateByUrl('/login');
        }

        if (response.body.code != 200) {
          Swal.fire({
            title: '重置密碼失敗',
            text: '請檢查重置密碼驗證信內容。',
            icon: 'error',
            confirmButtonText: '確定'
          });
          console.log(response.body.code);
        }
      },
      error: (error) => {
        Swal.fire({
          title: '重置密碼驗證信寄送失敗',
          text: '請檢查email是否正',
          icon: 'error',
          confirmButtonText: '再試一次'
        });
      }
    })
  }
}

