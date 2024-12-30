import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SearchSessionService {

  searchData!: any; // 暫存搜尋頁面資訊
  tidyMap!:any; // 暫存搜尋顯示結果

  // private inputData: InputSearchData = {
  //   searchName: '',                            // 關鍵字
  //   charge: '',                                // 案由
  //   law:[],                                    // 法條搜索
  //   courtList: [],                             // 法院搜索
  //   caseType: [],                              // 刑法or民法
  //   verdictStartDate: new Date('1990-01-01'),  // 開始時間
  //   verdictEndDate: new Date('9990-01-01'),    // 結束時間
  //   verdictId: '',                             // 字號
  //   docType: '',                               // 判決or裁定
  // }


  // 設定資料(不一定用到)
  setSearchConditions(data: InputSearchData): void {
    this.searchData = { ...data };
  }

  // 取資料(不一定用到)
  getSearchConditions(): any {
    return this.searchData;
  }

  // 清除選擇條件(不一定用到)
  clearData(): void {
    this.searchData = {
      searchName: '',
      charge: '',
      law:[],
      courtList: [],
      caseType: [],
      verdictStartDate: new Date('1990-01-01'),
      verdictEndDate: new Date('9990-01-01'),
      verdictId: '',
      docType: '',
    };
  }

}

export interface InputSearchData {
  searchName: string;
  charge: string;
  law: string[];
  courtList: string[];
  caseType: string[];
  verdictStartDate: Date;
  verdictEndDate: Date;
  verdictId: string;
  docType: string;
}
