import { Component } from '@angular/core';
import { SearchSessionService } from '../../service/search-session.service';
import { ScrollPanel } from 'primeng/scrollpanel';
import { HttpClientService } from '../../service/http-client.service';
import { SessionServiceService } from '../../service/session-service.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-search-result-page',
  imports: [ScrollPanel],
  templateUrl: './search-result-page.component.html',
  styleUrl: './search-result-page.component.scss'
})
export class SearchResultPageComponent {
  caseType: string = "";; // 案件類型
  charge: string = "";; // 案由
  courtList: string = ""; // 裁判法院
  docType: string = ""; // 種類，如裁定或判決等
  law: string = ""; // 相關法條
  searchName: string = ""; // 搜尋內容
  verdictStartDate: string = ""; // 判決開始日期
  verdictEndDate: string = ""; // 判決結束日期
  verdictId: string = ""; // 裁判字號
  judgeName: string = ""; //法官姓名
  defendantName: string = ""; // 被告姓名
  date: string = ""; // 裁判日期
  caseList!: any; // 搜尋 list
  tidyMap!: any; // 整理後的 map
  displayData!: any;

  constructor(
    private searchSessionService: SearchSessionService,
    public sessionServiceService: SessionServiceService,
    private http: HttpClientService
  ) { }

  async ngOnInit(): Promise<void> {
    // 前頁輸入搜尋的內容
    this.initializeSearchData();

    // 取得 API 所有搜尋的資料
    let resData: any;
    resData = await firstValueFrom(this.http.postApi('http://localhost:8080/case/search', this.searchSessionService.searchData));

    // 重組資料
    this.caseList = resData.caseList;
    this.tidyMap = this.tidyData(resData.caseList);

    console.log( this.caseList);
    // console.log(this.formatCaseId(this.caseList[0].id));
  }

  // 輸入搜尋的內容
  private initializeSearchData(): void {
    this.caseType = this.searchSessionService.searchData.caseType;
    this.charge = this.searchSessionService.searchData.charge;
    this.docType = this.searchSessionService.searchData.docType;
    this.law = this.searchSessionService.searchData.law;
    this.searchName = this.searchSessionService.searchData.searchName;

    // 如果有輸入法院才串接
    if (this.searchSessionService.searchData.courtList) {
      this.courtList = this.searchSessionService.searchData.courtList
        .map((item: any) => this.sessionServiceService.turnCodeToName(item))
        .join('、');
    }

    // 如果有輸入日期才串接
    if (this.searchSessionService.searchData.verdictStartDate && this.searchSessionService.searchData.verdictEndDate) {
      this.verdictStartDate = this.sessionServiceService.convertToROCDate(new Date(this.searchSessionService.searchData.verdictStartDate));
      this.verdictEndDate = this.sessionServiceService.convertToROCDate(new Date(this.searchSessionService.searchData.verdictEndDate));
    }

    // console.log(this.searchSessionService.searchData);
  }

   formatCaseId(caseId: string): string {
    const regex = /(\d+)(年度)?([^字第]+)(字)?(第)?(\d+)/; // ^ 和 $ 分別表示匹配字符串的開始和結束
    const match = caseId.match(regex); // 使用 match() 方法來匹配

    if (match) {
      // match[1]: 年度的數字, match[3]: 案件類型的字, match[6]: 號數的數字
      return `${match[1]},${match[3]},${match[6]}`;
    } else {
      return caseId = '';
    }
  }

  // 重組資料
  private tidyData(rawData: any): void {
    // 以 id 作為分組依據
    this.tidyMap = rawData.reduce((result: any, item: any) => {
      if (!result[item.id]) {
        result[item.id] = {
          caseType: item.caseType,
          charge: item.charge,
          court: this.sessionServiceService.turnCodeToName(item.court),
          date: this.sessionServiceService.convertToROCDate(new Date(item.date)),
          defendantName: item.defendantName,
          docType: item.docType,
          groupId: item.groupId,
          judgeName: item.judgeName,
          law: item.law,
          text: item.text,
          url: item.url
        }
      }

      return result;
    }, {});

    console.log(this.tidyMap['112年度訴字第382號']);
    console.log(this.tidyMap);
  }

  // 顯示左側的資料
  display(id: string): void {
    this.displayData = this.tidyMap[id];
    // console.log(this.displayData);
    console.log('123');
  }

}


