import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { HttpClientService } from '../../service/http-client.service';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-register-page',
  imports: [
    MatButtonModule,
    FormsModule,
    PasswordModule,
    InputTextModule
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {

  constructor(
    private router: Router,
    private http: HttpClientService
  ) { }

  email!: string;
  rawPwd!: string;
  confirmPwd!: string;
  password!: string;
  errorMessage: string = ''
  errorMessage2: string = ''

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

  // 驗證密碼
  pwdValidation() {
    if (this.rawPwd != this.confirmPwd) {
      this.errorMessage2 = '請輸入相同密碼';
    }
    else {
      this.errorMessage2 = '';
      this.password = this.confirmPwd;
    }
  }



  goBack() {
    this.router.navigateByUrl('/login')
  }

  goRegister() {
    if (!this.email || !this.password) {
      Swal.fire({
        text: '帳號或密碼不可為空!',
        icon: 'error',
        confirmButtonText: '確定'
      });
      return
    }

    let tidyData = {
      email: this.email,
      password: this.password
    }

    console.log(tidyData);

    this.http.postApi2('http://localhost:8080/case/register', tidyData).subscribe({
      next: (response: any) => {
        if (response.status == 200) {
          Swal.fire({
            text: '驗證信已發送，請至信箱查看',
            icon: 'info',
            confirmButtonText: '關閉'
          });
        }
      },
      error: (error) => {
        Swal.fire({
          text: '註冊失敗，請檢查email或密碼格式是否正確',
          icon: 'error',
          confirmButtonText: '確定'
        });
      }
    })
  }
}
