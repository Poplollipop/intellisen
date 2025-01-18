import { Component, inject, PLATFORM_ID } from '@angular/core';
import { SearchSessionService } from '../../service/search-session.service';
import { HttpClientService } from '../../service/http-client.service';
import { SessionServiceService } from '../../service/session-service.service';
import { CaseDetailsComponent } from './case-details/case-details.component';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatTabsModule } from '@angular/material/tabs';
import { ScrollTop } from 'primeng/scrolltop';
import { PaginatorModule } from 'primeng/paginator';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClickDialogComponent } from '../view-full-text-page/click-dialog/click-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    PaginatorModule,
  ],
  templateUrl: './search-result-page.component.html',
  styleUrl: './search-result-page.component.scss',
})
export class SearchResultPageComponent {
  private readonly platformId = inject(PLATFORM_ID); // 確保程式碼在瀏覽器上執行與 sessionStorage 存在

  tidyMap!: any; // 整理後的 map
  caseList: any[] = []; // 接後端的東西

  errorMessage: string = ''; // 法條錯誤提示訊息
  lawList!: string[]; // 整理後的法院字串
  isExpanded: boolean = false; // 進階條件是否展開的變數
  isAscending: boolean = false; // 排序方向

  // 下面是輸入框的預設值
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
  id: string = '';

  

  // 書籤變數
  isLogin: boolean = false; // 判斷是否為登入狀態
  myBookmarks: any[] = [];

  // 檢查書籤是否已存在
  Bookmarkcode !: any;

  

  // tab頁籤
  defaultTabIndex: number = 0; // 預設開啟第一個頁籤 (索引 0)

  constructor(
    protected searchSessionService: SearchSessionService,
    public sessionServiceService: SessionServiceService,
    private http: HttpClientService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private dialog: MatDialog,
  ) {
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
        ],
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
        ],
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
        ],
      },
      {
        label: '東部',
        value: 'E',
        items: [
          { label: '臺灣臺東地方法院', value: 'TTD' },
          { label: '臺灣花蓮地方法院', value: 'HLD' },
          { label: '臺灣宜蘭地方法院', value: 'ILD' },
        ],
      },
      {
        label: '離島',
        value: 'O',
        items: [
          { label: '臺灣澎湖地方法院', value: 'PHD' },
          { label: '福建連江地方法院', value: 'LCD' },
          { label: '福建金門地方法院', value: 'KMD' },
        ],
      },
    ];
  }

  ngOnInit(): void {
    const savedConditions = this.initializeSavedConditions();

    if (savedConditions) {
      console.log('上一頁輸入的條件:', savedConditions);
      this.fillSearchForm(savedConditions);
      this.searchApi(savedConditions);
    }

    // 確認是否是登入狀態以改變書籤點擊後動作
    if (isPlatformBrowser(this.platformId)) {
      this.isLogin = JSON.parse(sessionStorage.getItem('isLogin')!);
    }

  }

  // 將 savedConditions 初始化封裝到一個方法中，集中處理
  initializeSavedConditions() {
    let savedConditions;

    if (this.searchSessionService.searchData) {
      savedConditions = this.searchSessionService.searchData;
    } else if (isPlatformBrowser(this.platformId)) {
      savedConditions = JSON.parse(
        sessionStorage.getItem('savedConditions') || '{}'
      );
      this.searchSessionService.searchData = savedConditions;
    }

    if (savedConditions) {
      sessionStorage.setItem('savedConditions', JSON.stringify(savedConditions));
    }
    return savedConditions;
  }

  // 將搜尋條件的資料填充到input的邏輯分離出來
  private fillSearchForm(savedConditions: any): void {
    this.keywords = savedConditions.searchName || '';
    this.inputCase = savedConditions.charge || '';
    this.inputCourts = savedConditions.courtList || [];
    this.law = (savedConditions.lawList || []).join('; ');
    this.lawType = savedConditions.caseType
      ? savedConditions.caseType.split(',').map((item: string) => item.trim())
      : [];

    this.id = savedConditions.verdictId || '';
    console.log(typeof this.id);

    const match = this.id.match(/^(\d+)?年度$/);
    if (match) {
      this.year = match[1] || '';
      console.log(this.year);
    }

    // const match = this.id.match(/^(?:(\d+)?年度)?(.*)?字(?:第(\d+)?號)?$/);
    // console.log(match);

    // if (match) {
    //   this.year = match[1] || '';
    //   this.zhi = match[2] || '';
    //   this.hao = match[3] || '';
    // }else {
    //   // 如果沒有匹配到任何內容
    //   this.year = '';
    //   this.zhi = '';
    //   this.hao = '';
    // }

    // console.log(this.year);

    this.startDate = savedConditions.verdictStartDate || '';
    this.endDate = savedConditions.verdictEndDate || '';
    this.caseType = savedConditions.docType || '';
  }

  // 取得 API 所有搜尋的資料方法
  searchApi(savedConditions: any) {
    this.ngxService.start(); // 啟動 loading 動畫
    let resData: any;
    this.http
      .postApi('http://localhost:8080/case/search', savedConditions)
      .subscribe((searchData) => {
        resData = searchData;
        console.log(resData);

        // 重組資料
        this.caseList = resData.caseList;
        this.tidyMap = this.tidyData(resData.caseList);

        // 計算總頁數
        this.totalRecords = this.caseList.length; // 計算總資料筆數
        this.updateVisibleCases(); // 初始化第一頁數據
        this.sortCases('verdictDate', false); // 預設排序

        this.ngxService.stop(); // 關閉 loading 動畫
      });
  }

  // 更新顯示資料
  updateVisibleCases() {
    const start = this.first; // 更新起始的那一筆的 index
    const end = this.first + this.itemsPerPage; // 更新結束的那一筆的 index
    this.visibleCases = this.caseList.slice(start, end); // 只取該頁要顯示的筆數的 index

    // 為每個項目動態新增 isBookmarked
    this.visibleCases = this.caseList.map((item) => ({
      ...item,
      isBookmarked: false,
    }));

    // 確認sessionStorage裡面是否已有書籤
    const storedBookmarks = sessionStorage.getItem('myBookmarks');
    let bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];

    // 把sessionStorage裡面已經存在的書籤id和畫面顯示的列表id做比對
    const existingItems = this.visibleCases.filter(   // 把visibleCases的每個物件取出成caseItem並進行比對
      caseItem => bookmarks.some(      // 遍歷 bookmarks 陣列，檢查是否有至少一個bookmark滿足條件
        (bookmark: any) => bookmark.id == caseItem.id   
      )
    );

    existingItems.forEach(item => item.isBookmarked = true)
      
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
          verdictDate: this.sessionServiceService.convertToROCDate(
            new Date(item.verdictDate)
          ),
          defendantName: item.defendantName,
          docType: item.docType,
          groupId: item.groupId,
          judgeName: item.judgeName,
          law: item.law,
          content: item.content2
            ? item.content + '\n' + item.content2
            : item.content,
          url: item.url,
        };
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

  // 更新法條列表 (字串轉陣列)
  updateLawsList() {
    if (this.validateInput(this.law)) {
      this.errorMessage = '';
      this.lawList = this.law.split(';').filter((law) => law.trim() !== '');
    } else {
      this.errorMessage = '輸入內容不可有分號以外的特殊符號，請重新輸入';
    }
  }

  goCombinedId(): string {
    this.combinedId = '';
    // 將三個輸入框的值合併成一個新值
    if (this.year) {
      this.combinedId = this.combinedId + `${this.year}年度`;
    }
    if (this.zhi) {
      this.combinedId = this.combinedId + `${this.zhi}字`;
    }
    if (this.hao) {
      this.combinedId = this.combinedId + `第${this.hao}號`;
    }
    return this.combinedId;
  }

  // 進階搜尋觸發
  toggleAdvanced() {
    this.isExpanded = !this.isExpanded;
  }

  // 搜尋條件再搜尋
  searchAgain() {
    const tidyData = {
      searchName: this.keywords, // 模糊搜尋名
      verdictId: this.goCombinedId(), // 裁判字號 id
      caseType: (this.lawType || []).join(', '), // 案件類型:刑法、民法等等
      charge: this.inputCase, // 案由
      courtList: this.inputCourts, // 法院
      lawList: this.lawList, // 法條
      verdictStartDate: this.startDate, // 開始時間
      verdictEndDate: this.endDate, // 結束時間
      docType: this.caseType, // 文件類型:裁定、判決
    };

    const savedConditions = tidyData;
    this.searchSessionService.searchData.searchName = this.keywords;

    this.searchApi(savedConditions);
  }

  // 全局排序函數
  sortCases(sortField: string, ascending: boolean) {
    const direction = ascending ? 1 : -1;
    this.caseList.sort((a, b) => {
      const valueA = new Date(a[sortField]).getTime();
      const valueB = new Date(b[sortField]).getTime();
      return (valueA - valueB) * direction;
    });

    // 更新當前頁面數據
    this.updateVisibleCases();
  }

  // 排序切換處理
  toggleSort() {
    this.isAscending = !this.isAscending; // 切換排序方向
    this.sortCases('verdictDate', this.isAscending); // 重新排序
  }

  // 頁籤
  itemsPerPage: number = 10; // 每頁顯示的筆數
  totalRecords: number = 0; // 總筆數
  first: number = 0; // 當前的起始那一筆的索引
  visibleCases: any[] = []; // 當前頁面顯示的案件數據

  onPageChange(event: any): void {
    this.first = event.first; // 更新起始那一筆的索引
    this.itemsPerPage = event.rows; // 更新每頁筆數
    this.updateVisibleCases(); // 更新顯示的筆數
  }

  // 觀看全文
  checkContent(groupId: string, id: string, court: string) {
    // 將網址與案件 id 綁在一起
    this.router.navigateByUrl(
      'full-text/' + groupId + '&id=' + id + '&court=' + court
    );
    this.sessionServiceService.url = this.router.url;
  }

  /**
   * 提取包含關鍵字的文字片段，並將關鍵字加上高亮顯示（只處理第一次找到的結果）。
   * @param keyword - 要搜尋的關鍵字。
   * @param content - 文章全文。
   * @returns 包含高亮顯示關鍵字的文字片段；如果找不到關鍵字，回傳空字串。
   */
  highlightKeywordOnce(keyword: string, content: string): string {
    // 如果關鍵字跟內文都是 null 就回空字串
    if (!keyword && !content) {
      return content;
    }

    // 只有關鍵字都是 null 就會回主文
    if (!keyword) {
      return content;
    }

    // 建立正則表達式，匹配關鍵字（不區分大小寫）
    const keywordRegex = new RegExp(`(${keyword})`, 'i');
    const match = keywordRegex.exec(content);

    if (!match) {
      return content; // 如果找不到關鍵字，回傳空字串
    }

    // 計算要截取的文字片段的開始和結束位置
    const start = Math.max(0, match.index - 50);
    const end = Math.min(content.length, match.index + keyword.length + 150);

    // 提取文字片段，並將關鍵字加上高亮顯示
    const snippet = content
      .substring(start, end)
      .replace(keywordRegex, `<span class="keyword" >$1</span>`);

    return snippet;
  }

  // // 新增&刪除書籤
  // toggleBookmark(caseItem: any) {
  //   // 從 sessionStorage 讀取現有書籤資料
  //   const storedBookmarks = sessionStorage.getItem('myBookmarks');
  //   let bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];

  //   // 檢查是否已存在書籤，如果不存在就新增，如果已存在就刪除
  //   const exists = bookmarks.some(
  //     (bookmark: any) => bookmark.id == caseItem.id
  //   );
  //   if (!exists) {
  //     // 如果不存在，新增書籤
  //     bookmarks.push(caseItem);
  //     // 改變書籤icon變數
  //     caseItem.isBookmarked = true;
  //     // 更新 sessionStorage
  //     sessionStorage.setItem('myBookmarks', JSON.stringify(bookmarks));
  //     Swal.fire({
  //       title: '書籤新增成功!',
  //       icon: 'success',
  //       confirmButtonText: '確定',
  //     });
  //   } else {
  //     // 過濾掉要刪除的書籤
  //     bookmarks = bookmarks.filter(
  //       (bookmark: any) => bookmark.id != caseItem.id
  //     );
  //     // 改變書籤icon變數
  //     caseItem.isBookmarked = false;
  //     // 更新 sessionStorage
  //     sessionStorage.setItem('myBookmarks', JSON.stringify(bookmarks));
  //     Swal.fire({
  //       title: '移除書籤成功!',
  //       icon: 'success',
  //       confirmButtonText: '確定',
  //     });

  //     console.log('已刪除書籤:', caseItem.id);
  //   }
  // }

  // // 新增書籤
  // addBookmark(caseItem: any) {
  //   // 從 sessionStorage 讀取現有書籤資料
  //   const storedBookmarks = sessionStorage.getItem('myBookmarks');
  //   let bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];

  //   // 檢查是否已存在書籤
  //   const exists = bookmarks.some(
  //     (bookmark: any) => bookmark.id == caseItem.id
  //   );
  //   if (!exists) {
  //     // 如果不存在，新增書籤
  //     bookmarks.push(caseItem);
  //     // 改變書籤icon變數
  //     this.isBookmarked = true;
  //     // 更新 sessionStorage
  //     sessionStorage.setItem('myBookmarks', JSON.stringify(bookmarks));
  //     Swal.fire({
  //       title: '書籤新增成功!',
  //       icon: 'success',
  //       confirmButtonText: '確定',
  //     });
  //   } else {
  //     Swal.fire({
  //       title: '該案件已經在書籤中',
  //       icon: 'success',
  //       confirmButtonText: '確定',
  //     });
  //   }
  // }

  // // 刪除書籤
  // // 清除單一書籤
  //   removeBookmark(bookmarkId: string): void {
  //     // 從 sessionStorage 讀取現有書籤資料
  //     const storedBookmarks = sessionStorage.getItem('myBookmarks');
  //     let bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];

  //     // 過濾掉要刪除的書籤
  //     bookmarks = bookmarks.filter((bookmark: any) => bookmark.id != bookmarkId);
  //     // 改變書籤icon變數
  //     this.isBookmarked = false;
  //     // 更新 sessionStorage
  //     sessionStorage.setItem('myBookmarks', JSON.stringify(bookmarks));
  //     Swal.fire({
  //       title: '移除書籤成功!',
  //       icon: 'success',
  //       confirmButtonText: '確定',
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         window.location.reload(); // 在按下「確定」後執行刷新
  //       }
  //     });

  //     // console.log('已刪除書籤:', bookmarkId);
  //   }

  toggleBookmark(caseItem: any) {
        const email = this.sessionServiceService.getEmail();
        const groupId = caseItem.groupId;
        const id = caseItem.id;
        const court = caseItem.court;
        const charge = caseItem.charge;
        const judgeName = caseItem.judgeName;
        const defendantName = caseItem.defendantName;
        const docType = caseItem.docType;
        const caseType = caseItem.caseType;
        const verdictDate = caseItem.verdictDate;
        
        // 呼叫新增書籤api
        this.postSaveBookmarkApi(email, groupId, id, court, charge, judgeName, defendantName, docType, caseType, verdictDate);
        
      }
    

   // 儲存書籤api
  postSaveBookmarkApi(email: string, groupId: string, id: string, court: string, charge: string, judgeName: string, defendantName: string, docType: string, caseType: string, verdictDate: string): void {
    const bookmark = { email, groupId, id, court, verdictDate, charge, defendantName, judgeName, caseType, docType };

    console.log("儲存的書籤:", bookmark);

    // 檢查是否已存在書籤
    this.getBookmarkAlreadyExists(email, groupId, id, court);

    if (this.Bookmarkcode == 200) {
      this.openDialog('書籤已儲存，不須重複儲存！');
      return;
    }

    this.http.postApi('http://localhost:8080/accountSystem/bookmark', bookmark).subscribe({
      next: (res: any) => {
        console.log('書籤儲存成功:', res);

        // 更新書籤狀態
        // this.Bookmarkcode = 200;
        
        this.openDialog('書籤已成功儲存！');
      },
    });
  }


  // 確認書籤是否已存在
  getBookmarkAlreadyExists(email: string, groupId: string, id: string, court: string) {
    this.http
      .getApi('http://localhost:8080/accountSystem/bookmark-already-exists?email=' + email + '&groupId=' + groupId + '&id=' + id + '&court=' + court)
      .subscribe(
        (res: any) => {
          // 如果螢光筆資料庫沒有資料直接回傳
          if (res == null) return;
          this.Bookmarkcode = res.code;
          console.log("重複檢查結果:",this.Bookmarkcode)
        });
  }

  // 打開通知對話框
    openDialog(message: string): void {
      this.dialog.open(ClickDialogComponent, {
        data: { message }
      });
    }
}
