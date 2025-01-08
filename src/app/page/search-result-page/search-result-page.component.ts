import { Component, inject, PLATFORM_ID } from '@angular/core';
import { SearchSessionService } from '../../service/search-session.service';
import { HttpClientService } from '../../service/http-client.service';
import { SessionServiceService } from '../../service/session-service.service';
import { CaseDetailsComponent } from './case-details/case-details.component';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { isPlatformBrowser } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { SelectItemGroup } from 'primeng/api';
import {MatTabsModule} from '@angular/material/tabs';
import { ScrollTop } from 'primeng/scrolltop';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-search-result-page',
  imports: [
    CaseDetailsComponent,
    DrawerModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    MatIconModule,
    MatExpansionModule,
    AccordionModule,
    AvatarModule,
    BadgeModule,
    InputTextModule,
    FormsModule,
    MultiSelectModule,
    Checkbox,
    MatTabsModule,
    ScrollTop,
    PaginatorModule
  ],
  templateUrl: './search-result-page.component.html',
  styleUrl: './search-result-page.component.scss'
})

export class SearchResultPageComponent {

  private readonly platformId = inject(PLATFORM_ID); // 確保程式碼在瀏覽器上執行與 sessionStorage 存在

  tidyMap!: any;    // 整理後的 map
  caseList: any[] = [];       // 接後端的東西
  selectedCaseId!: string;    // 選中的案件id

  searchForm!: FormGroup;
  errorMessage: string = '';    // 法條錯誤提示訊息
  lawList!: string[];     // 整理後的法院字串
  isExpanded: boolean = false;  // 進階條件是否展開的變數

  keywords: string = '';
  inputCase: string = '';
  law: string = '';
  lawType!: string[];
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

  constructor(
    private searchSessionService: SearchSessionService,
    public sessionServiceService: SessionServiceService,
    private http: HttpClientService,
    // private fb: FormBuilder,
    private ngxService: NgxUiLoaderService,
  ) {

    // // 初始化表單
    // this.searchForm = this.fb.group({
    //   searchName: new FormControl(''),
    //   charge: new FormControl(''),
    //   lawList: new FormControl(''),
    //   caseType: new FormControl(''),
    //   courtList: new FormControl([]),
    //   verdictId: new FormControl(''),
    //   verdictStartDate: new FormControl(''),
    //   verdictEndDate: new FormControl(''),
    //   docType: new FormControl(''),

    // });


    // 法院選擇
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

  ngOnInit(): void {

    // 從 SearchSessionService 獲取條件
    // 設定 sessionStorage 保存搜尋條件
    let savedConditions;
    if (this.searchSessionService.searchData) {
      savedConditions = this.searchSessionService.searchData;
      console.log("上一頁輸入的條件:",savedConditions)
      this.keywords = savedConditions.searchName;
      this.inputCase = savedConditions.charge;
      this.inputCourts = savedConditions.courtList;
      this.law = (savedConditions.lawList || []).join('; ');
      this.lawType = savedConditions.caseType;
      this.combinedId = savedConditions.verdictId;
        const match = this.combinedId.match(/^(\d+)?年度(.*)?字第(\d+)?號$/);
        if (match) {
          this.year = match[1] || ''; // 如果匹配不到，設為空字串
          this.zhi = match[2] || ''; 
          this.hao = match[3] || ''; 
        }
      this.startDate = savedConditions.verdictStartDate;
      this.endDate = savedConditions.verdictEndDate;
      this.caseType = savedConditions.docType;
      sessionStorage.setItem("savedConditions", JSON.stringify(savedConditions))
    }

    // 取得在sessionStorage裡的資料
    // isPlatformBrowser(this.platformId) : 檢查程式碼是否在瀏覽器上執行(不加會error)
    if (!this.searchSessionService.searchData && isPlatformBrowser(this.platformId)) {
      savedConditions = JSON.parse(sessionStorage.getItem("savedConditions")!);
    }

    // 取得 API 所有搜尋的資料
    if (savedConditions) {
      this.searchApi(savedConditions);
    }


  
  }

  // 取得 API 所有搜尋的資料方法
  searchApi(savedConditions: any) {

    this.ngxService.start(); // 啟動 loading 動畫
    let resData: any;
    this.http.postApi('http://localhost:8080/case/search', savedConditions).subscribe((searchData) => {
      resData = searchData;
      console.log(resData);

      // // 儲存搜尋資料
      // this.searchForm.patchValue(savedConditions);

      // 重組資料
      this.caseList = resData.caseList;
      this.tidyMap = this.tidyData(resData.caseList);

      // 計算總頁數
      this.totalRecords = this.caseList.length; // 計算總記錄數
      this.updateVisibleCases(); // 初始化第一頁數據

      this.ngxService.stop()// 關閉 loading 動畫
    });
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
          verdictDate: this.sessionServiceService.convertToROCDate(new Date(item.verdictDate)),
          defendantName: item.defendantName,
          docType: item.docType,
          groupId: item.groupId,
          judgeName: item.judgeName,
          law: item.law,
          content: item.content2 ? item.content + "\n" + item.content2 : item.content,
          url: item.url
        }
      }

      return result;
    }, {});

    this.searchSessionService.tidyMap = this.tidyMap;
  }


  

  // 下面是搜尋條件相關

  // 驗證法條輸入內容
  validateInput(input: string): boolean {
    // 禁止特殊符號：僅允許分號
    const regex = /^[^\s!@#$%^&*()_+\-=[\]{}':"\\|,.<>/?]*$/;
    return regex.test(input);
  }

  // 更新法條列表
  updateLawsList() {
    if (this.validateInput(this.law)) {
      this.errorMessage = '';
      this.lawList = this.law.split(';').filter(law => law.trim() !== '');
    } else {
      this.errorMessage = '輸入內容不可有分號以外的特殊符號，請重新輸入';
    }
  }

  updateCombinedId() {
    // 將三個輸入框的值合併成一個新值
    this.combinedId = `${this.year}年度${this.zhi}字第${this.hao}號`;
  }


  // 搜尋條件再搜尋
  searchAgain() {
    // 取出 form 中的值
    const updateCondition = this.searchForm.value;


    // 製作  search pai 的 req 資料
    const sendApiData = updateCondition


    // 發送 API 搜尋資料
    this.searchApi(sendApiData);
  }

  toggleAdvanced() {
    this.isExpanded = !this.isExpanded;
  }





  // 頁籤
  itemsPerPage1: number = 10; // 每頁顯示的記錄數
  totalRecords: number = 0; // 總記錄數
  first: number = 0; // 當前的起始記錄索引
  visibleCases: any[] = []; // 當前頁面顯示的案件數據


  onPageChange(event: any): void {
    this.first = event.first; // 更新起始記錄索引
    this.itemsPerPage1 = event.rows; // 更新每頁記錄數
    this.updateVisibleCases(); // 更新顯示的記錄
  }
  
  updateVisibleCases(): void {
    const start = this.first;
    const end = this.first + this.itemsPerPage1;
    this.visibleCases = this.caseList.slice(start, end);
  }
  

}


