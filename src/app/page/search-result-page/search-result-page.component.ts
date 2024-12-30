import { Component } from '@angular/core';
import { SearchSessionService } from '../../service/search-session.service';
import { HttpClientService } from '../../service/http-client.service';
import { SessionServiceService } from '../../service/session-service.service';
import { firstValueFrom } from 'rxjs';
import { CaseDetailsComponent } from './case-details/case-details.component';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { MultiSelectModule } from 'primeng/multiselect';


@Component({
  selector: 'app-search-result-page',
  imports: [
    // ScrollPanel,
    CaseDetailsComponent,
    DrawerModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    Fluid,
    MultiSelectModule
  ],
  templateUrl: './search-result-page.component.html',
  styleUrl: './search-result-page.component.scss'
})

export class SearchResultPageComponent {
  tidyMap!: any; // 整理後的 map
  caseList: any[] = []; // 接後端的東西
  selectedCaseId!: string; // 選中的案件id
  showCaseDetail : boolean = false; // 顯示案件細節

  groupedCourts!: any;
  searchForm!: FormGroup;
  visible2: boolean = false;
  editMode = false;

  constructor(
    private searchSessionService: SearchSessionService,
    public sessionServiceService: SessionServiceService,
    private http: HttpClientService,
    private fb: FormBuilder
  ) {

    // 初始化表單
    this.searchForm = this.fb.group({
      searchName: new FormControl({ value: '', disabled: true }),
      charge: new FormControl({ value: '', disabled: true }),
      law: new FormControl({ value: '', disabled: true }),
      caseType: new FormControl({ value: '', disabled: true }),
      courtList: new FormControl({ value: [], disabled: true }),
      verdictId: new FormControl({ value: '', disabled: true }),
      verdictStartDate: new FormControl({ value: '', disabled: true }),
      verdictEndDate: new FormControl({ value: '', disabled: true }),
      docType: new FormControl({ value: '', disabled: true }),
    });

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



  async ngOnInit(): Promise<void> {
    // 從 SearchSessionService 獲取條件
    const savedConditions = this.searchSessionService.searchData;

    // 如果存在已保存的條件，使用 patchValue 載入
    if (savedConditions) {
      this.searchForm.patchValue(savedConditions);
    }

    // 取得 API 所有搜尋的資料
    let resData: any;
    resData = await firstValueFrom(this.http.postApi('http://localhost:8080/case/search', this.searchSessionService.searchData));

    // 重組資料
    this.caseList = resData.caseList;
    this.tidyMap = this.tidyData(resData.caseList);

    console.log(this.caseList);
    // 計算總頁數
    this.calculateTotalPages();

  }


  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.searchForm.enable();   // 啟用所有欄位
    } else {
      this.searchForm.disable();  // 禁用所有欄位
    }
  }

  saveChanges(): void {
    if (this.searchForm.valid) {
      this.searchSessionService.setSearchConditions(this.searchForm.value);
      alert('搜尋條件已保存！');
    }
  }




  // 搜尋
  // private initializeSearchData(): void {
  //   this.caseType = this.searchSessionService.searchData.caseType;
  //   this.charge = this.searchSessionService.searchData.charge;
  //   this.docType = this.searchSessionService.searchData.docType;
  //   this.law = this.searchSessionService.searchData.law;
  //   this.searchName = this.searchSessionService.searchData.searchName;

  //   // 如果有輸入法院才串接
  //   if (this.searchSessionService.searchData.courtList) {
  //     this.courtList = this.searchSessionService.searchData.courtList
  //       .map((item: any) => this.sessionServiceService.turnCodeToName(item))
  //       .join('、');
  //   }

  //   // 如果有輸入日期才串接
  //   if (this.searchSessionService.searchData.verdictStartDate && this.searchSessionService.searchData.verdictEndDate) {
  //     this.verdictStartDate = this.sessionServiceService.convertToROCDate(new Date(this.searchSessionService.searchData.verdictStartDate));
  //     this.verdictEndDate = this.sessionServiceService.convertToROCDate(new Date(this.searchSessionService.searchData.verdictEndDate));
  //   }

  //   // console.log(this.searchSessionService.searchData);
  // }

  formatCaseId(caseId: string): string {
    const regex = /(\d+)(年度)?([^字第]+)(字)?(第)?(\d+)/; // 以「/」定義正規表達式的開始與結束
    const match = caseId.match(regex); // 使用 match() 方法來匹配

    if (match) {
      // match[1]: 年度的數字, match[3]: 案件類型的字, match[6]: 號數的數字
      // ${}: {}內允許在字符串中直接嵌入變數或表達式的值
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
          verdictDate: this.sessionServiceService.convertToROCDate(new Date(item.verdictDate)),
          defendantName: item.defendantName,
          docType: item.docType,
          groupId: item.groupId,
          judgeName: item.judgeName,
          law: item.law,
          content: item.content,
          url: item.url
        }
      }

      return result;
    }, {});

    this.searchSessionService.tidyMap = this.tidyMap;

    // console.log(this.tidyMap['112年度訴字第382號']);
    // console.log(this.tidyMap);
  }


  page: number = 1; // 當前頁碼
  itemsPerPage: number = 10; // 每頁顯示的項目數量
  totalPages: number = 1; // 總頁數

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.caseList.length / this.itemsPerPage);
    if (this.totalPages === 0) {
      this.totalPages = 1; // 如果沒有資料，預設為 1 頁
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }


  selectId(id: string){
    this.selectedCaseId = id;
  }





}


