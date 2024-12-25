import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login-page',
  imports: [
    MatButtonModule

  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  constructor(
    private router: Router,
  ){}

  gotoregister(){
    this.router.navigateByUrl('/register')
  }

}
