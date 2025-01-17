import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientService } from '../../../service/http-client.service';
import Swal from 'sweetalert2';
import { SessionServiceService } from '../../../service/session-service.service';
import { NavigationEnd, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';


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

  name: string | null = null;
  phone: string | null = null;
  email: string | null = null;
  role: string | null = null;
  imageUrl: string | null = null; // 用戶圖像路徑
  selectedFile: File | null = null;
  maxFileSize: number = 5 * 1024 * 1024; // 最大檔案大小 5MB
  allowedFileTypes: string[] = ['image/jpeg', 'image/png']; // 允許的檔案類型


  udpdateData!: any;

  // 事務所
  address: string | null = null;
  lawFirmNumber: string | null = null;

  // 律師
  licenseNumber: string | null = null;
  lawFirm: string | null = null;

  // 一般使用者
  city: string | null = null;

  // 預設非編輯模式
  editMode = {
    basicInfo: false,
    contactInfo: false,
    changeRole: false,
  };

  constructor(
    private http: HttpClientService,
    private session: SessionServiceService,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/account-center/account-profile') {
        this.showProfile();
      }
    });
  }

  ngOnInit() {
    // 訂閱sessionStorage更新完成後才執行提取資料的方法
    this.session.taskCompleted$.subscribe(() =>{
      this.showProfile();
    })
  }


  showProfile() {
    if (isPlatformBrowser(this.platformId)) {
      // 把 sessionStorage 的東西取出來，要用 parse
      const userData = JSON.parse(sessionStorage.getItem('userData')!);
      this.email = this.session.getEmail();
      this.name = userData.name;
      this.role = userData.role;
      // 根據回傳角色配對中文
      if (userData.role == 'lawFirm') {
        this.role = '事務所'
        this.phone = userData.phone;
        this.address = userData.address;
        this.lawFirmNumber = userData.lawFirmNumber;
      }
      if (userData.role == 'lawyer') {
        this.role = '律師'
        this.phone = userData.phone;
        this.lawFirm = userData.lawFirm;
        this.licenseNumber = userData.licenseNumber;
      }
      if (userData.role == 'user') {
        this.role = '一般使用者'
        this.phone = userData.phone;
        this.city = userData.city;
      }
      if (userData.role == 'guest') {
        this.role = '訪客'
      }

      this.getUserProfilePicture(); // 取得用戶頭像

      console.log(this.email);
    }
  }



  // 切換編輯模式
  toggleEdit(section: keyof typeof this.editMode) {
    this.editMode[section] = !this.editMode[section];
  }

  // 更新資料
  updateInfo() {
    if(this.role == '律師'){
      this.role = 'lawyer'
    }
    if(this.role == '事務所'){
      this.role = 'lawFirm'
    }
    if(this.role == '一般使用者'){
      this.role = 'user'
    }
    if(this.role == '訪客'){
      this.role = 'guest'
    }
    this.udpdateData = {
      role: this.role,
      address: this.address,
      lawFirmNumber: this.lawFirmNumber,
      name: this.name,
      phone: this.phone,
      email: this.email,
      licenseNumber: this.licenseNumber,
      lawFirm: this.lawFirm,
      city: this.city,
    }
    console.log(this.udpdateData);

    this.http.postApi2('http://localhost:8080/accountSystem/update-profile', this.udpdateData).subscribe({
      next: (response: any) => {
        if (response.body.code == 200) {
          Swal.fire({
                title: '移除書籤成功!',
                icon: 'success',
                confirmButtonText: '確定',
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload(); // 在按下「確定」後執行刷新
                }
              });
          console.log(response);
          this.editMode.basicInfo = false;
          this.editMode.contactInfo = false;
          sessionStorage.setItem('userData', JSON.stringify(this.udpdateData));
          // window.location.reload(); // 強制刷新頁面
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

  getUserProfilePicture() {
    const email = this.session.getEmail();  // 用戶的email
    const url = 'http://localhost:8080/accountSystem/get-profile-picture'; // API

    // 獲取用戶圖片
    this.http.getImage(url, { email: email }).subscribe({
      next: (response: HttpResponse<ArrayBuffer>) => {
        // 檢查 response.body 是否為 null
        if (response.body) {
          // 獲取 Content-Type
          const contentType = response.headers.get('Content-Type') || 'image/jpeg'; // 默認為 'image/jpeg'

          // 將 ArrayBuffer 轉換為 Base64 字串
          const base64String = this.arrayBufferToBase64(response.body);

          // 動態設置圖片的 MIME 類型，並設置 imageUrl
          this.imageUrl = `data:${contentType};base64,${base64String}`;
        } else {
          console.error('圖片數據為空');
        }
      },
      error: (error) => {
        console.error('獲取圖片失敗', error);
      }
    });
  }

  //  將 ArrayBuffer 格式的二進位數據轉換為 Base64 格式
  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = ''; // 儲存從 ArrayBuffer 中提取的每一個字節的字符
    const bytes = new Uint8Array(buffer); // 將 ArrayBuffer 轉換為 Uint8Array
    const length = bytes.byteLength; // 獲取 Uint8Array 的長度
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]); // 將二進位數據轉換為文本(binary 字串)
    }
    return window.btoa(binary); // 將 binary 字串轉換為 Base64 編碼
  }

  // 當文件選擇被觸發時
  onFileChange(event: any): void {
    const file = event.target.files[0]; // 獲取第一個檔案
    if (file) {
      // 檢查檔案大小
      if (file.size > this.maxFileSize) {
        this.selectedFile = null;
        Swal.fire({
          title: '檔案過大，請選擇小於 5MB 的檔案',
          icon: 'error',
          confirmButtonText: '確定'
        });
        return;
      }

      // 檢查檔案類型
      if (!this.allowedFileTypes.includes(file.type)) {
        this.selectedFile = null;
        Swal.fire({
          title: '請上傳 JPG 或 PNG 格式的圖片',
          icon: 'error',
          confirmButtonText: '確定'
        });
        return;
      }

      // 顯示即時預覽圖片
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result; // 更新預覽圖片的 URL
      };
      reader.readAsDataURL(file); // 讀取檔案作為 Base64 字串



      this.selectedFile = file;


    }
  }

  // 提交表單上傳頭像
  onSubmit(): void {
    if (this.selectedFile) {
      const formData = new FormData(); // FormData 物件，允許我們以表單的形式傳遞檔案。
      formData.append('profilePicture', this.selectedFile); // append 方法會將檔案附加到 FormData 物件中

      const uploadUrl = 'http://localhost:8080/accountSystem/update-profile-picture?email=' + this.email;

      this.http.postApi2(uploadUrl, formData).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: '圖片上傳成功!',
            icon: 'success',
            confirmButtonText: '確定'
          }).then((result) => {
            window.location.reload(); // 強制刷新頁面
          }
        )},
        error: (error) => {
          Swal.fire({
            title: '圖片上傳失敗，請重新上傳',
            icon: 'error',
            confirmButtonText: '確定'
          });
        }
      });
    }
  }
}
