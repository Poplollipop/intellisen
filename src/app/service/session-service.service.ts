import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SessionServiceService {

  private selectedData: SelectedData = {
    courts: [],
    laws: [],
    startYear: '',
    endYear: '',
    case: '',
  };

  // 設定選擇條件
  setData(data: SelectedData): void {
    this.selectedData = { ...data };
  }

  // 取得選擇條件
  getData(): SelectedData {
    return this.selectedData;
  }

  // 清除選擇條件
  clearData(): void {
    this.selectedData = {
      courts: [],
      laws: [],
      startYear: '',
      endYear: '',
      case: '',
    };
  }
}

export interface SelectedData {
  courts: string[];
  laws: string[];
  startYear: string;
  endYear: string;
  case: string;
}
