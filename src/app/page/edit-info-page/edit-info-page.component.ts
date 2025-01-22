import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-edit-info-page',
  imports: [
    FormsModule,
  ],
  templateUrl: './edit-info-page.component.html',
  styleUrl: './edit-info-page.component.scss'
})
export class EditInfoPageComponent {
  private readonly platformId = inject(PLATFORM_ID); // 確保程式碼在瀏覽器上執行與 sessionStorage 存在

  email!: string;
  role: string | null = null;
  name: string | null = null;
  phone: string | null = null;
  udpdateData!: any
  newRole: string | null = null;

  // 一般使用者
  city: string | null = null;

  // 事務所
  address: string | null = null;
  lawFirmNumber: string | null = null;

  // 律師
  licenseNumber: string | null = null;
  lawFirm: string | null = null;


  constructor(
    private session: SessionServiceService,
    private http: HttpClientService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.email = this.session.getEmail();
    if (isPlatformBrowser(this.platformId)) {
      this.role = JSON.parse(sessionStorage.getItem('userData')!).role
    if(this.role == 'lawFirm') {
      this.role = '事務所'
    }
    if(this.role == 'lawyer') {
      this.role = '律師'
    }
    if(this.role == 'user') {
      this.role = '一般使用者'
    }
    if(this.role == 'guest') {
      this.role = '使用者'
    }
    }
  }

  updateInfo() {
    this.udpdateData = {
      email: this.email,
      role: this.newRole,
      name: this.name,
      phone: this.phone,
      address: this.address,
      lawFirmNumber: this.lawFirmNumber,
      licenseNumber: this.licenseNumber,
      lawFirm: this.lawFirm,
      city: this.city,
    }
    console.log(this.udpdateData);

    this.http.postApi2('http://localhost:8080/accountSystem/update-profile', this.udpdateData).subscribe({
      next: (response: any) => {
        if (response.body.code == 200) {
          Swal.fire({
            title: '更新成功!',
            icon: 'success',
            confirmButtonText: '確定'
          });
          console.log("更新帳戶回傳",response);
          this.session.setEmail(this.email);
          this.router.navigateByUrl('/account-center')
        }


        if (response.body.code != 200) {
          Swal.fire({
            title: '更新失敗',
            text: '請檢查更新內容是否符合格式。',
            icon: 'error',
            confirmButtonText: '再試一次'
          });
          console.log(response);
        }
      },
      error: (error) => {
        Swal.fire({
          title: '更新失敗',
          text: '請檢查更新內容是否符合格式。',
          icon: 'error',
          confirmButtonText: '再試一次'
        });
      }
    })
  }

  backToAccountCenter() {
    this.router.navigateByUrl('/account-center/account-profile')
  }
}
