import { SearchSessionService } from './../../service/search-session.service';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectItemGroup } from 'primeng/api';
import { InputSearchData } from '../../service/search-session.service';
import { Router } from '@angular/router';
import { Checkbox } from 'primeng/checkbox';



@Component({
  selector: 'app-search-page',
  imports: [
    MatIconModule,
    MatExpansionModule,
    AccordionModule,
    AvatarModule,
    BadgeModule,
    InputTextModule,
    FormsModule,
    MultiSelectModule,
    Checkbox
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {

  readonly panelOpenState = signal(false);

  keywords: string = '';
  inputCase: string = '';
  law: string = '';
  lawList!: string[];
  lawType!: string [];
  groupedCourts!: SelectItemGroup[];
  inputCourts!: string[];
  inputCaseYear: string = '';
  startDate!: Date;
  endDate!: Date;
  caseType: string = '';
  year: string = '';
  zhi: string = '';
  hao: string = '';
  combinedId: string = '';

  isExpanded: boolean = false;  // 進階條件是否展開的變數
  errorMessage: string = '';    // 法條錯誤提示訊息


  constructor(
    private searchSessionService: SearchSessionService,
    private router: Router
  ) {
    this.groupedCourts = [
      {
        label: '北部',
        value: 'N',
        items: [
          { label: '臺灣臺北地方法院', value: 'TPD' },
          { label: '臺灣新北地方法院', value: 'PCD' },
          { label: '臺灣士林地方法院', value: 'SLD' },
          { label: '臺灣桃園地方法院', value: 'TYD' },
          { label: '臺灣新竹地方法院', value: 'SCD' },
          { label: '臺灣基隆地方法院', value: 'KLD' },

        ]
      },
      {
        label: '中部',
        value: 'M',
        items: [
          { label: '臺灣苗栗地方法院', value: 'MLD' },
          { label: '臺灣臺中地方法院', value: 'TCD' },
          { label: '臺灣南投地方法院', value: 'NTD' },
          { label: '臺灣彰化地方法院', value: 'CHD' },
          { label: '臺灣雲林地方法院', value: 'ULD' },
        ]
      },
      {
        label: '南部',
        value: 'S',
        items: [
          { label: '臺灣嘉義地方法院', value: 'CYD' },
          { label: '臺灣臺南地方法院', value: 'TND' },
          { label: '臺灣橋頭地方法院', value: 'CTD' },
          { label: '臺灣高雄地方法院', value: 'KSD' },
          { label: '臺灣屏東地方法院', value: 'PTD' },
        ]
      },
      {
        label: '東部',
        value: 'E',
        items: [
          { label: '臺灣臺東地方法院', value: 'TTD' },
          { label: '臺灣花蓮地方法院', value: 'HLD' },
          { label: '臺灣宜蘭地方法院', value: 'ILD' },
        ]
      },
      {
        label: '離島',
        value: 'O',
        items: [
          { label: '臺灣澎湖地方法院', value: 'PHD' },
          { label: '福建連江地方法院', value: 'LCD' },
          { label: '福建金門地方法院', value: 'KMD' },
        ]
      },
    ];
  }


  toggleAdvanced() {
    this.isExpanded = !this.isExpanded;
  }

  updateCombinedId() {
    // 將三個輸入框的值合併成一個新值
    this.combinedId = `${this.year}年度${this.zhi}字第${this.hao}號`;
  }


  // 驗證輸入內容
  validateInput(input: string): boolean {
    // 禁止特殊符號：僅允許中文、文字、數字及空白
    const regex = /^[^\s!@#$%^&*()_+\-=[\]{}':"\\|,.<>/?]*$/;
    return regex.test(input);
  }

  // 更新法條列表
  updateLawsList() {
    const isValid = this.validateInput(this.law);

    if (isValid) {
      this.errorMessage = '';
      this.lawList = this.law.split(';').filter(law => law.trim() !== '');
    } else {
      this.errorMessage = '輸入內容不可有分號以外的特殊符號，請重新輸入';
    }
  }


  confirm() {
    // const data: InputSearchData = {
    //   searchName: this.keywords,            // 關鍵字
    //   charge: this.inputCase,               // 案由
    //   law: this.lawList,                    // 選擇法條
    //   courtList: this.inputCourts,          // 選擇法院
    //   caseType: this.lawType,               // 刑法or民法
    //   verdictStartDate: this.startDate,     // 開始時間
    //   verdictEndDate: this.endDate,         // 結束時間
    //   verdictId: this.combinedId,           // 字號
    //   docType: this.caseType,               // 裁判種類
    // }
    // this.searchSessionService.setSearchConditions(data);
    // this.router.navigate(['/search-result']);

    // console.log(data);

    const tidyData = {
      searchName: this.keywords,
      caseType: this.lawType,
      charge: this.inputCase,
      courtList: this.inputCourts,
      law: this.lawList,
      verdictStartDate: this.startDate,
      verdictEndDate: this.endDate,
      docType: this.caseType,
      verdictId: this.combinedId,
    }

    // 將整理的資料暫存到 service
    this.searchSessionService.searchData = tidyData;
    console.log("存入的資料:", tidyData);
    this.router.navigate(['/search-result']);

    // this.http.postApi('http://localhost:8080/case/search', tidyData)
    //   .subscribe(
    //     (response: any) => {
    //       // console.log('搜尋結果:', response);
    //       this.searchSessionService.searchData = response;
    //     }
    //   )


    // this.http.postApi('http://localhost:8080/case/search', tidyData)
    // .subscribe(
    //     (response: any) => {
    //     console.log('搜尋結果:', response);
    //   }
    // )
  }
}







