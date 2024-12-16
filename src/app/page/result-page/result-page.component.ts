import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolbarComponent } from '../../layouts/toolbar/toolbar.component';
import { SelectedData, SessionServiceService } from '../../service/session-service.service';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;   // 引入 Bootstrap 類別

@Component({
  selector: 'app-result-page',
  imports: [
    MatTooltipModule,
    ToolbarComponent,
    CommonModule
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

  advancedOptions: string[] = ['選項一', '選項二', '選項三', '選項四'];
  selectedOptions: Set<string> = new Set();
  appliedOptions: string[] = []; // 用於顯示已套用的選項

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

   // 開啟 Modal
   openModal(): void {
    const modal = new bootstrap.Modal(document.getElementById('advancedFilterModal'));
    modal.show();
  }

  // 切換選項狀態
  toggleOption(option: string): void {
    if (this.selectedOptions.has(option)) {
      this.selectedOptions.delete(option);
    } else {
      this.selectedOptions.add(option);
    }
  }

  isSelected(option: string): boolean {
    return this.selectedOptions.has(option);
  }

  applyFilters(): void {
    this.appliedOptions = Array.from(this.selectedOptions); // 將選擇的內容轉換為陣列並顯示
  }

}


