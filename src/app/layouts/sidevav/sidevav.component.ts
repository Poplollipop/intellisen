import { Component } from '@angular/core';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';

@Component({
  selector: 'app-sidevav',
  imports: [],
  templateUrl: './sidevav.component.html',
  styleUrl: './sidevav.component.scss'
})
export class SidevavComponent {

  constructor(
      public session: SessionServiceService,
      private http: HttpClientService,
    ) {}
}
