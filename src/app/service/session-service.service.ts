import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionServiceService {

  private selectedCriteria: SelectedCriteria = {
    courts: [],
    laws: [],
    startYear: '',
    endYear: '',
    case: '',
  };

  // 設定選擇條件
  setCriteria(criteria: SelectedCriteria): void {
    this.selectedCriteria = { ...criteria };
  }

  // 取得選擇條件
  getCriteria(): SelectedCriteria {
    return this.selectedCriteria;
  }

  // 清除選擇條件
  clearCriteria(): void {
    this.selectedCriteria = {
      courts: [],
      laws: [],
      startYear: '',
      endYear: '',
      case: '',
    };
  }
}

export interface SelectedCriteria {
  courts: string[];
  laws: string[];
  startYear: string;
  endYear: string;
  case: string;
}
