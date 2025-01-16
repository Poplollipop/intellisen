import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';
import Swal from 'sweetalert2';
import { SidenavComponent } from '../../layouts/sidenav/sidenav.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-account-center-page',
  imports: [
    SidenavComponent,
    RouterOutlet,
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
    private http: HttpClientService,
  ) { }

  ngOnInit(): void {
    this.email = this.session.getEmail();
    this.userDataReq = {
      email: this.email
    }
    this.http.postApi2('http://localhost:8080/accountSystem/get-user-info', this.userDataReq).subscribe({
      next: (response: any) => {
        console.log('取得的帳戶資訊:', response);
        if (response.body.code == 200) {
          sessionStorage.setItem('userData', JSON.stringify(response.body))
          this.session.notifyTaskCompleted();// 通知 sidevav 顯示可選擇的內容
        }     
      },
      error: (error) => {
      }
    })


  }

  goToUpdatePage() {
    this.router.navigateByUrl('/edit-info')
  }


}
