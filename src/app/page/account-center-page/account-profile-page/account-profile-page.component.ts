import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientService } from '../../../service/http-client.service';
import Swal from 'sweetalert2';
import { SessionServiceService } from '../../../service/session-service.service';
import { RadioButton } from 'primeng/radiobutton';
import { Router } from '@angular/router';


@Component({
  selector: 'app-account-profile-page',
  imports: [
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './account-profile-page.component.html',
  styleUrl: './account-profile-page.component.scss'
})
export class AccountProfilePageComponent {
    private readonly platformId = inject(PLATFORM_ID); // 確保程式碼在瀏覽器上執行與 sessionStorage 存在
  
    name: string | null = '';
    phone: string | null = '';
    email: string | null = '';
    role: string | null = '';


    udpdateData!: any;

    // 事務所
    address!: string;
    lawFirmNumber!: string;
  
    // 律師
    licenseNumber!: string;
    lawFirm!: string;

    // 一般使用者
    city!: string;

    editMode = {
      basicInfo: false,
      contactInfo: false,
      changeRole: false,
    };

    constructor(
        private http: HttpClientService,
        private session: SessionServiceService,
        private router: Router
      ) {}

    ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {
        // 把 sessionStorage 的東西取出來，要用 parse
        const userData = JSON.parse(sessionStorage.getItem('userData')!);
        this.email = this.session.getEmail();
        this.name = userData.name;
        this.role = userData.role;
        if(userData.role == 'lawFirm') {
          this.role = '事務所'
          this.phone = userData.phone;
          this.address = userData.address;
          this.lawFirmNumber = userData.lawFirmNumber
        }
        if(userData.role == 'lawyer') {
          this.role = '律師'
          this.phone = userData.phone;
          this.lawFirm = userData.lawFirm;
          this.licenseNumber = userData.licenseNumber
        }
        if(userData.role == 'user') {
          this.role = '一般使用者'
          this.city = userData.city
        }
        if(userData.role == 'guest') {
          this.role = '訪客'
        }
        
        
        
        console.log(this.email);
      }
    }

    // 切換編輯模式
    toggleEdit(section: keyof typeof this.editMode) {
      this.editMode[section] = !this.editMode[section];
    }

    // 更新資料
    updateInfo() {
        this.udpdateData = {
          role: this.role,
          address: this.address,
          lawFirmNumber: this.lawFirmNumber,
          name: this.name,
          phone: this.phone,
          email: this.email,
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
              console.log(response);
              this.editMode.basicInfo = false;
              this.editMode.contactInfo = false;
              sessionStorage.setItem('userData', JSON.stringify(this.udpdateData))
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

      // 更換方案
      goChangeRole() {
        this.router.navigateByUrl('/edit-info')
      }

}
