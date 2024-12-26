import { serverRoutes } from './../../app.routes.server';
import { Component } from '@angular/core';
import { count } from 'console';
import { ScrollPanel } from 'primeng/scrollpanel';

@Component({
  selector: 'app-search-result-page',
  imports: [ ScrollPanel ],
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
      '113,訴,557': {
        id: '113,訴,557',
        court: '新北地方方法院',
        charge: '詐欺',
        caseType: '刑事案件',
        docType: '判決',
        judgeName: '王大明',
        defendantName: '張三',
        date: '2024-12-25'
      },
      '114,訴,558': {
        id: '114,訴,558',
        court: '台北地方方法院',
        charge: '竊盜',
        caseType: '刑事案件',
        docType: '判決',
        judgeName: '李小華',
        defendantName: '李四',
        date: '2024-12-20'
      },
      '115,訴,559': {
        id: '114,訴,558',
        court: '高雄地方方法院',
        charge: '傷害',
        caseType: '刑事案件',
        docType: '判決',
        judgeName: '林大榮',
        defendantName: '王五',
        date: '2024-12-18'
      }
    };

    this.id = this.searchResultData.id;
    this.court = this.searchResultData.court;
    this.charge = this.searchResultData.charge;
    this.caseType = this.searchResultData.caseType;
    this.docType = this.searchResultData.docType;
    this.judgeName = this.searchResultData.judgeName;
    this.defendantName = this.searchResultData.defendantName;
    this.date = this.searchResultData.date;

  }



}

