import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-toolbar',
  imports: [
    MatToolbarModule,

  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  constructor(
      private router: Router
  ) {}

  goLogin(){
    this.router.navigateByUrl('/login')
  }

  goRegister(){
    this.router.navigateByUrl('/register')
  }

}
