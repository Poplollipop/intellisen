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
import { HttpClientService } from '../../service/http-client.service';
import { Router } from '@angular/router';



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

  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {

  readonly panelOpenState = signal(false);

  keywords: string = '';
  selectedButton: string | null = null;
  inputCase: string = '';
  inputLaw: string = '';
  lawType: string = '';
  groupedCourts!: SelectItemGroup[];
  inputCourts!: string[];
  inputCaseYear: string = '';
  startDate!: Date;
  endDate!: Date;
  caseType: string = '';
  year: string = '89';
  zhi: string = '';
  hao: string = '';
  combinedId: string = '';

  isExpanded: boolean = false;

  constructor(
    private searchSessionService: SearchSessionService,
    private http: HttpClientService,
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



  toggleButton(buttonType: string): void {
    this.selectedButton = this.selectedButton == buttonType ? null : buttonType;
    // console.log(this.selectedButton)
  }

  toggleAdvanced() {
    this.isExpanded = !this.isExpanded;
  }

  updateCombinedId() {
    // 將三個輸入框的值合併成一個新值
    this.combinedId = `${this.year}年度${this.zhi}字第${this.hao}號`;
  }


  confirm() {
    const data: InputSearchData = {
      keyword: this.keywords,   // 關鍵字
      inputCase: this.inputCase,    // 案由
      inputLaw: this.inputLaw,      // 選擇法條
      inputCourts: this.inputCourts,    // 選擇法院
      lawType: this.selectedButton || '',   // 刑法or民法
      startDate: this.startDate,    // 開始時間
      endDate: this.endDate,    // 結束時間
      id: this.combinedId,    // 字號
      caseType: this.caseType,    // 裁判種類
    }
    this.searchSessionService.setData(data);

    // console.log(data);

    const tidyData = {
      searchName: this.keywords,
      caseType: this.lawType,
      charge: this.inputCase,
      courtList: this.inputCourts,
      law: this.inputLaw,
      verdictStartDate: this.startDate,
      verdictEndDate: this.endDate,
      docType: this.caseType,
      verdictId: this.combinedId,
    }

    // this.http.postApi('http://localhost:8080/case/search', tidyData)
    //   .subscribe(
    //     (response: any) => {
    //       // console.log('搜尋結果:', response);
    //       this.searchSessionService.searchData = response;
    //     }
    //   )

    // 將整理的資料暫存到 service
    this.searchSessionService.searchData = tidyData;

    this.router.navigate(['/search-result']);
  }
}







