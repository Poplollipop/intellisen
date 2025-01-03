import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HttpClientService } from '../../service/http-client.service';

@Component({
  selector: 'app-register-page',
  imports: [
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  email!: string;
  password!: string;
  registerData!: register; // 註冊資料


  constructor(
    private router: Router,
    private http: HttpClientService,
  ) { }

  // 註冊
  register() {
    // 檢查 email 格式
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      return alert('請確認 Email 格式');
    }

    // 密碼不得為空或空白字串
    if (!this.password || !this.password.trim()) {
      return alert('請確認密碼格式');
    }


    this.registerData = {
      email: this.email,
      password: this.password
    }

    this.http.postApi('http://localhost:8080/accountSystem/register', this.registerData)
      .subscribe((res: any) => {
        console.log(res);
        if (res.code == 400) {
          return alert('Email 已重複，請確認填寫');
        }
      });
  }

  goback() {
    this.router.navigateByUrl('/login')
  }
}

interface register {
  email: string;
  password: string
}
