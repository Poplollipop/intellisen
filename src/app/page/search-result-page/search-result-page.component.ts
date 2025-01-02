import { Router } from '@angular/router';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { SearchSessionService } from '../../service/search-session.service';
import { HttpClientService } from '../../service/http-client.service';
import { SessionServiceService } from '../../service/session-service.service';
import { CaseDetailsComponent } from './case-details/case-details.component';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { MultiSelectModule } from 'primeng/multiselect';
import { isPlatformBrowser } from '@angular/common';

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

  private readonly platformId = inject(PLATFORM_ID); // 確保程式碼在瀏覽器上執行與 sessionStorage 存在

  tidyMap!: any;    // 整理後的 map
  caseList: any[] = [];       // 接後端的東西
  selectedCaseId!: string;    // 選中的案件id
  showCaseDetail: boolean = false;     // 顯示案件細節

  groupedCourts!: any;
  searchForm!: FormGroup;
  visible2: boolean = false;
  editMode = false;
  errorMessage: string = '';    // 法條錯誤提示訊息
  lawList!: string[];     // 整理後的法院字串


  constructor(
    private searchSessionService: SearchSessionService,
    public sessionServiceService: SessionServiceService,
    private http: HttpClientService,
    private fb: FormBuilder,
    private router: Router
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

  ngOnInit(): any {

    // 從 SearchSessionService 獲取條件
    // 設定 sessionStorage 保存搜尋條件
    let savedConditions;
    if (this.searchSessionService.searchData) {
      savedConditions = this.searchSessionService.searchData;
      sessionStorage.setItem("savedConditions", JSON.stringify(savedConditions))
    }

    // 取得在sessionStorage裡的資料
    // isPlatformBrowser(this.platformId) : 檢查程式碼是否在瀏覽器上執行(不加會error)
    if (!this.searchSessionService.searchData && isPlatformBrowser(this.platformId)) {
      savedConditions = JSON.parse(sessionStorage.getItem("savedConditions")!);
    }

    // 取得 API 所有搜尋的資料
    let resData: any;
    if (savedConditions) {
      this.http.postApi('http://localhost:8080/case/search', savedConditions).subscribe((searchData) => {
        resData = searchData;

        // 儲存搜尋資料
        this.searchForm.patchValue(savedConditions);

        // // 重組資料
        this.caseList = resData.caseList;
        this.tidyMap = this.tidyData(resData.caseList);

        // // 計算總頁數
        this.calculateTotalPages();
        this.updateDisplayedData();

      });
    }

  }

  // 將字號轉換為顯示的格式
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
  }


  page: number = 1; // 當前頁碼
  itemsPerPage: number = 15; // 每頁顯示的項目數量
  totalPages: number = 1; // 總頁數
  pageNumbers: number[] = []; // 儲存頁碼的陣列
  displayedData: any[] = []; // 當前頁顯示的資料

  calculateTotalPages() {
    // this.totalPages = Math.ceil(this.caseList.length / this.itemsPerPage);
    // if (this.totalPages === 0) {
    //   this.totalPages = 1; // 如果沒有資料，預設為 1 頁
    // }

    this.totalPages = Math.ceil(this.caseList.length / this.itemsPerPage);
    if (this.totalPages === 0) {
      this.totalPages = 1;
    }

    // 計算頁碼範圍，最多顯示5頁，並且聚焦當前頁
    let startPage = Math.max(this.page - 2, 1); // 當前頁的前2頁
    let endPage = Math.min(this.page + 2, this.totalPages); // 當前頁的後2頁

    // 如果顯示的頁碼範圍小於5頁，根據情況調整
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(startPage + 4, this.totalPages); // 從第一頁開始顯示最多5頁
      } else if (endPage === this.totalPages) {
        startPage = Math.max(endPage - 4, 1); // 顯示最後的5頁
      }
    }

    this.pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    // 如果當前頁超過總頁數，設置為總頁數
    if (this.page > this.totalPages) {
      this.page = this.totalPages;
    }

    this.updateDisplayedData();
  }

  updateDisplayedData() {
    const start = (this.page - 1) * this.itemsPerPage;
    const end = Math.min(this.page * this.itemsPerPage, this.caseList.length); // 保證 end 不會超過資料長度
    this.displayedData = this.caseList.slice(start, end);
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.updateDisplayedData();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updateDisplayedData();
    }
  }

  selectPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.updateDisplayedData();
    }
  }

  // 用在父元件傳到子元件的id
  selectId(id: string) {
    this.selectedCaseId = id;
  }


  // 返回搜尋畫面
  backToSearchPage() {
    this.router.navigateByUrl('search')
  }

  // 下面是搜尋條件相關

  // 驗證法條輸入內容
  validateInput(input: string): boolean {
    // 禁止特殊符號：僅允許中文、文字、數字及空白
    const regex = /^[^\s!@#$%^&*()_+\-=[\]{}':"\\|,.<>/?]*$/;
    return regex.test(input);
  }

  // 法條輸入格式錯誤訊息


  // 更新法條列表
  updateLawsList(lawString: any) {
    if (this.validateInput(lawString) && typeof lawString == 'string') {
      this.errorMessage = '';
      this.lawList = lawString.split(';').filter(lawString => lawString.trim() !== '');
    } else {
      this.errorMessage = '輸入內容不可有分號以外的特殊符號，請重新輸入';
    }
  }

  // 搜尋條件編輯模式
  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.searchForm.enable();   // 啟用所有欄位
    } else {
      this.searchForm.disable();  // 禁用所有欄位
    }
  }

  // 搜尋條件再搜尋
  searchAgain() {
    const updateCondition = this.searchForm.value;
    console.log("更改的搜尋條件:", updateCondition);

    const tidyLaw = this.updateLawsList(updateCondition.law);

    const sendApiData = {
      ...updateCondition,
      law: tidyLaw  //  整理後的法條
    }

  }



}


