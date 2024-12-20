import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SessionServiceService {

  private selectedData: SelectedData = {
    courts: [],
    laws: [],
    startYear: '89',
    endYear: '113',
    case: '',
  };

  // 法院代碼
  private court_code: Map<string, string> = new Map<string, string>([
    ["TPD", "臺灣臺北地方法院"],
    ["PCD", "臺灣新北地方法院"],
    ["SLD", "臺灣士林地方法院"],
    ["TYD", "臺灣桃園地方法院"],
    ["SCD", "臺灣新竹地方法院"],
    ["MLD", "臺灣苗栗地方法院"],
    ["TCD", "臺灣臺中地方法院"],
    ["NTD", "臺灣南投地方法院"],
    ["CHD", "臺灣彰化地方法院"],
    ["ULD", "臺灣雲林地方法院"],
    ["CYD", "臺灣嘉義地方法院"],
    ["TND", "臺灣臺南地方法院"],
    ["CTD", "臺灣橋頭地方法院"],
    ["KSD", "臺灣高雄地方法院"],
    ["PTD", "臺灣屏東地方法院"],
    ["TTD", "臺灣臺東地方法院"],
    ["HLD", "臺灣花蓮地方法院"],
    ["ILD", "臺灣宜蘭地方法院"],
    ["KLD", "臺灣基隆地方法院"],
    ["PHD", "臺灣澎湖地方法院"],
    ["LCD", "福建連江地方法院"],
    ["KMD", "福建金門地方法院"],
  ]);


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

  // 將法律代號轉成法院名稱
  turnCodeToName(code: string) {
    return this.court_code.get(code)
  }
}

export interface SelectedData {
  courts: string[];
  laws: string[];
  startYear: string;
  endYear: string;
  case: string;
}
