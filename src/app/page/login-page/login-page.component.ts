import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { HttpClientService } from '../../service/http-client.service';



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
  account!: string;
  password!: string;
  errorMessage: string = ''; // 錯誤提示訊息
  loginData!: login;

  constructor(
    private router: Router,
    private http: HttpClientService
  ){ }

  // 驗證email格式
  accountValidation(input: string): boolean {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;;
    return regex.test(input);
  }

  // 顯示email錯誤
  updateEmailForm() {
    const isValid = this.accountValidation(this.account);

    if (isValid) {
      this.errorMessage = '';
    } else {
      this.errorMessage = '請輸入正確Email格式!';
    }
  }

  gotoregister() {
    this.router.navigateByUrl('/register')
  }

  login() {
    this.loginData = {
      email: this.account,
      password: this.password
    }

    console.log(this.loginData);

    this.http.postApi('http://localhost:8080/accountSystem/login', this.loginData)
    .subscribe((res: any) => {
      console.log(res);
      if (res.code == 400) {
        return alert('test');
      }
    });
  }

}

interface login {
  email: string;
  password: string
}
