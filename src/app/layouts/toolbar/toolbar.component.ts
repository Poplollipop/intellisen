import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-toolbar',
  imports: [
    MatToolbarModule,
    RouterLink
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  // 從 app.component 取得當前路徑
  @Input() routerUrl: string = '';

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
