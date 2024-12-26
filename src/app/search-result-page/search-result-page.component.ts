import { Component } from '@angular/core';


@Component({
  selector: 'app-search-result-page',
  imports: [  ],
  templateUrl: './search-result-page.component.html',
  styleUrl: './search-result-page.component.scss'
})
export class SearchResultPageComponent {
  court!: string; // 裁判法院
  id!: string; // 裁判字號
  charge!: string; // 案由
  caseType!: string; // 案件類型
  docType!: string; // 種類，如裁定或判決等
  judgeName!: string; //法官姓名
  defendantName!: string; // 被告姓名
  date!: string; // 裁判日期

  searchResultData!: any; // 假資料

  ngOnInit(): void {
    this.searchResultData = {

      }
    };

    // this.id = this.searchResultData.id;
    // this.court = this.searchResultData.court;
    // this.charge = this.searchResultData.charge;
    // this.caseType = this.searchResultData.caseType;
    // this.docType = this.searchResultData.docType;
    // this.judgeName = this.searchResultData.judgeName;
    // this.defendantName = this.searchResultData.defendantName;
    // this.date = this.searchResultData.date;





}

