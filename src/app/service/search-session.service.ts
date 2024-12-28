import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SearchSessionService {

  searchData!: any; // 暫存搜尋頁面資訊

  private inputData: InputSearchData = {
    keyword: '',                            // 關鍵字
    inputCase: '',                          // 案由
    inputLaw:[],                            // 法條搜索
    inputCourts: [],                        // 法院搜索
    lawType: [],                            // 刑法or民法
    startDate: new Date('1990-01-01'),      // 開始時間
    endDate: new Date('9990-01-01'),        // 結束時間
    id: '',                                 // 字號
    caseType: '',                           // 判決or裁定
  }

  setData(data: InputSearchData): void {
    this.inputData = { ...data };
  }

  // 清除選擇條件
  clearData(): void {
    this.inputData = {
      keyword: '',
      inputCase: '',
      inputLaw:[],
      inputCourts: [],
      lawType: [],
      startDate: new Date('1990-01-01'),
      endDate: new Date('9990-01-01'),
      id: '',
      caseType: '',
    };
  }

}

export interface InputSearchData {
  keyword: string;
  inputCase: string;
  inputLaw: string[];
  inputCourts: string[];
  lawType: string[];
  startDate: Date;
  endDate: Date;
  id: string;
  caseType: string;
}
