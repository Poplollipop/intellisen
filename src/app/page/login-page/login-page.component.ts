import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { HttpClientService } from '../../service/http-client.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login-page',
  imports: [
    MatButtonModule,
    FormsModule,
    PasswordModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  email!: string;
  password!: string;
  errorMessage: string = '';    // 錯誤提示訊息


  constructor(
    private router: Router,
    private http: HttpClientService,
  ){}

  // 驗證email格式
  accountValidation(input: string):boolean{
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;;
    return regex.test(input);
  }

  // 顯示email錯誤
  updateEmailForm(){
    const isValid = this.accountValidation(this.email);
    if (isValid) {
      this.errorMessage = '';
    } else {
      this.errorMessage = '請輸入正確Email格式!';
    }

  }



  // 註冊
  gotoregister(){
    let tidyData = {
      email: this.email,
      password: this.password
    }

    this.http.postApi2('http://localhost:8080/case/login',tidyData).subscribe({
      next: (response: any) => {
        if (response.status == 200) {
          Swal.fire({
            title: '登入成功!',
            text: '歡迎回來！',
            icon: 'success',
            confirmButtonText: '確定'
          });
          this.router.navigateByUrl('/register')
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
