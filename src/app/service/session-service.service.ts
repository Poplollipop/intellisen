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

  // 法院代碼
  private court_code: Map<string, string> = new Map<string, string>([
    // 地方法院
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

    // 簡易庭
    ["SLE", "士林簡易庭"],
    ["SJE", "三重簡易庭"],
    ["STE", "新店簡易庭"],
    ["SSE", "新市簡易庭"],
    ["CLE", "中壢簡易庭"],
    ["NHE", "內湖簡易庭"],
    ["TLE", "斗令簡易庭"],
    ["PDE", "北斗簡易庭"],
    ["PKE", "北港簡易庭"],
    ["CPE", "竹北簡易庭"],
    ["SDE", "沙鹿簡易庭"],
    ["ILE", "宜蘭簡易庭"],
    ["GSE", "岡山簡易庭"],
    ["PCE", "板橋簡易庭"],
    ["HLE", "花蓮簡易庭"],
    ["HUE", "虎尾簡易庭"],
    ["KME", "金城簡易庭"],
    ["NTE", "南投簡易庭"],
    ["PTE", "屏東簡易庭"],
    ["SYE", "柳營簡易庭"],
    ["OLE", "員林簡易庭"],
    ["TYE", "桃園簡易庭"],
    ["MKE", "馬公簡易庭"],
    ["KSE", "高雄簡易庭"],
    ["TCE", "臺中簡易庭"],
    ["TPE", "臺北簡易庭"],
    ["TTE", "臺東簡易庭"],
    ["MLE", "苗栗簡易庭"],
    ["ULE", "雲林簡易庭"],
    ["LTE", "羅東簡易庭"],
    ["FYE", "豐原簡易庭"],
    ["PHE", "澎湖簡易庭"],
    ["CDE", "橋頭簡易庭"],
    ["FSE", "鳳山簡易庭"],
    ["CCE", "潮州簡易庭"],
    ["CYE", "嘉義簡易庭(含朴子)"],
    ["TYE", "桃園簡易庭"],
    ["CSE", "旗山簡易庭"],
    ["TTE", "臺東簡易庭"],
    ["CHE", "彰化簡易庭"],


    // 少年及家事法院
    ["KSY", "臺灣高雄少年及家事法院"],

    // 高等法院
    ["TPH", "臺灣高等法院"],
    ["TPA", "最高行政法院"],
    ["TPS", "最高法院"],
    ["TPB", "臺北高等行政法院"],
    ["TPT", "臺北高等行政法院 地方庭行政"],
    ["TCB", "臺中高等行政法院"],
    ["KSB", "高雄高等行政法院"],
    ["KST", "高雄高等行政法院 地方庭行政"],
    ["TCH", "臺灣高等法院臺中分院"],
    ["TNH", "臺灣高等法院臺南分院"],
    ["KSH", "臺灣高等法院高雄分院"],
    ["HLH", "臺灣高等法院花蓮分院"],
    ["KMH", "福建高等法院金門分院"],

    // 其他機構
    ["IPC", "智慧財產及商業法院"],
    ["TP", "司法院"],
    ["TPC", "司法院職務法庭"],
    ["TPU", "司法院訴願決定"],
    ["TPP", "公務員懲戒委員會"],
    ["TPJP", "懲戒法院-職務法庭"],
    ["TPPP", "懲戒法院-懲戒法庭"],
    ["JCC", "憲法法庭憲法"],
  ]);

  private email: string;
  private isLogin: boolean;

  url!: string;

  constructor() {
    // 檢查是否在瀏覽器端執行
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const storedEmail = sessionStorage.getItem('email');
      this.email = storedEmail ? JSON.parse(storedEmail) : '';
    } else {
      this.email = ''; // 如果在伺服器端，設為空字串
    }

    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const storedIsLogin = sessionStorage.getItem('isLogin');
      this.isLogin = storedIsLogin ? JSON.parse(storedIsLogin) : false;
    } else {
      this.isLogin = false; // 如果在伺服器端，設為 false
    }
  }

  // 取得 email
  getIsLogin(): boolean {
    return this.isLogin;
  }

  // 設定 email
  setIsLogin(isLogin: boolean) {
    this.isLogin = isLogin;
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('isLogin', JSON.stringify(isLogin));
    }
  }

  // 清空 email
  clearIsLogin() {
    this.isLogin = false;
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('isLogin');
    }
  }

  // 取得 email
  getEmail(): string {
    return this.email;
  }

  // 設定 email
  setEmail(email: string) {
    this.email = email;
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('email', JSON.stringify(email));
    }
  }

  // 清空 email
  clearEmail() {
    this.email = '';
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('email');
    }
  }

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

  // 西元轉民國
  convertToROCDate(date: Date): string {
    // 取得西元年份
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() 是從 0 開始，所以需要加 1
    const day = date.getDate();

    // 民國年 = 西元年 - 1911
    const rocYear = year - 1911;

    // ${}表示將變數或表達式直接嵌入到字串中，不需要另外拼接
    return `${rocYear}年${month}月${day}日`;
  }
}

export interface SelectedData {
  courts: string[];
  laws: string[];
  startYear: string;
  endYear: string;
  case: string;
}
