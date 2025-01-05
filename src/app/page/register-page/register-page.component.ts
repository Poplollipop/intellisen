import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-register-page',
  imports: [
    MatButtonModule,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {

  constructor(
    private router: Router,
  ) {}

  goBack(){
    this.router.navigateByUrl('/login')
  }

  goRegister(){
    Swal.fire({
      text: '驗證信已發送，請至信箱查看',
      icon: 'info',
      confirmButtonText: '關閉'
    })
  }
}
