import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';

@Component({
  selector: 'app-account-center-page',
  imports: [],
  templateUrl: './account-center-page.component.html',
  styleUrl: './account-center-page.component.scss'
})
export class AccountCenterPageComponent {
  role!: string;
  name!: string;
  phone!: string;
  emailVerified!: boolean;

  constructor(
      private router: Router,
      public session: SessionServiceService,
      private http: HttpClientService
    ) {}

  goToUpdatePage() {
    this.router.navigateByUrl('/edit-info')
  }

  confirmDelete() {

  }

  sendVerificationEmail() {

  }
}
