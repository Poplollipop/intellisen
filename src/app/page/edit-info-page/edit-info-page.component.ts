import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';
import Swal from 'sweetalert2';
import { RadioButton } from 'primeng/radiobutton';


@Component({
  selector: 'app-edit-info-page',
  imports: [
    FormsModule,
    RadioButton
  ],
  templateUrl: './edit-info-page.component.html',
  styleUrl: './edit-info-page.component.scss'
})
export class EditInfoPageComponent {
  email!: string;
  role!: string; // 身分
  name!: string; // 名稱
  phone!: string; // 電話
  udpdateData!: any;

  constructor(
    private session: SessionServiceService,
    private http: HttpClientService
  ) { }

  ngOnInit(): void {
    this.email = this.session.getEmail();
  }

  updateInfo() {
    this.udpdateData = {
      email: this.email,
      role: this.role,
      name: this.name,
      phone: this.phone
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
}
