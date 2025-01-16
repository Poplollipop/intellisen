import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { HttpClientService } from '../../service/http-client.service';
import Swal from 'sweetalert2';
import { InputTextModule } from 'primeng/inputtext';
import { SessionServiceService } from '../../service/session-service.service';



@Component({
  selector: 'app-login-page',
  imports: [
    MatButtonModule,
    FormsModule,
    PasswordModule,
    InputTextModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {

  email!: string;
  password!: string;
  errorMessage: string = '';    // 錯誤提示訊息


  constructor(
    private router: Router,
    private http: HttpClientService,
    private session: SessionServiceService
  ){}

  // 驗證email格式
  accountValidation(input: string):boolean{
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(input);
  }

  // 顯示email錯誤
  updateEmailForm(event : Event){
    const isValid = this.accountValidation((event.target as HTMLInputElement).value);
    if (isValid) {
      this.errorMessage = '';
    } else {
      this.errorMessage = '請輸入正確Email格式!';
    }
  }

  // 登入
  login(){
    if(!this.email || !this.password){
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

    this.http.postApi2('http://localhost:8080/accountSystem/login', tidyData).subscribe({
      next: (response: any) => {
        if (response.body.code == 200) {
          Swal.fire({
            title: '登入成功!',
            text: '歡迎回來！',
            icon: 'success',
            confirmButtonText: '確定'
          });
          console.log(response.body.code);
          this.session.setIsLogin(true);
          this.session.setEmail(this.email);
          console.log(this.session.getIsLogin());
          this.router.navigateByUrl('/search')
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

  // 建立帳號
  goRegister(){
    this.router.navigateByUrl('/register')
  }

  // 忘記密碼
  goForgotPassword() {
    this.router.navigateByUrl('/forgot-password')
  }
}
