import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolbarComponent } from '../../layouts/toolbar/toolbar.component';
import { SelectedData, SessionServiceService } from '../../service/session-service.service';

@Component({
  selector: 'app-result-page',
  imports: [
    MatTooltipModule,
    ToolbarComponent
  ],
  templateUrl: './result-page.component.html',
  styleUrl: './result-page.component.scss'
})

export class ResultPageComponent {

  // 初始化
  data: SelectedData = {
    courts: [],
    laws: [],
    startYear: '',
    endYear: '',
    case: '',
  };

  constructor(private sessionService: SessionServiceService) {}


  ngOnInit(): void {
    this.data = this.sessionService.getData();
  }

  removeCourt(index: number): void {
    this.data.courts.splice(index, 1);
  }

  removeLaw(index: number): void {
    this.data.laws.splice(index, 1);
  }

}
