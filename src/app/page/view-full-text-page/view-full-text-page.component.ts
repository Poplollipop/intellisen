import { SessionServiceService } from './../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';
import { FullTextDialogComponent } from './full-text-dialog/full-text-dialog.component';
import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common'; // 匯入 CommonModule
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchSessionService } from '../../service/search-session.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ScrollTop } from 'primeng/scrolltop';
import { ClickDialogComponent } from './click-dialog/click-dialog.component';
import { log } from 'node:console';


@Component({
  selector: 'app-view-full-text-page',
  imports: [
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    ScrollTop,
  ],
  templateUrl: './view-full-text-page.component.html',
  styleUrl: './view-full-text-page.component.scss'
})
// 增加網頁ID，並儲存該ID給伺服器
export class ViewFullTextPageComponent {
  constructor(
    private sessionServiceService: SessionServiceService,
    private http: HttpClientService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private SessionServiceService: SessionServiceService,
    private ngxService: NgxUiLoaderService,
  ) { }


  @ViewChild('suptextSpan', { static: false }) suptextSpan!: ElementRef<HTMLSpanElement>;
  @ViewChild('toolbar', { static: false }) toolbarRef!: ElementRef<HTMLDivElement>;


  email!: any;
  suptext!: any;
  url!: any;
  fullTextParam !: any;
  judgmentJgroupId!: any;
  judgmentJid!: any;
  judgmentJcourt!: any;
  charge!: any;
  court!: any;
  judgeName!: any;
  defendantName!: any;
  docType!: any;
  caseType!: any;
  verdictDate!: any;
  // 檢查書籤是否已存在
  Bookmarkcode !: any;
  currentHighlight: HTMLElement | null = null; // 用於追蹤當前被選中的高亮元素
  savedRange: Range | null = null; // 用於保存用戶的選取範圍
  showPrintOptions = false; // 控制列印選項框的顯示狀態
  isToolbarVisible = false; // 控制工具列表起始狀態:為 false 不啟用
  historicalRecord: Array<{
    id: string, groupId: string, court: string,
    year: number, month: number, date: number
  }> = new Array();// 觀看紀錄列表


  ngOnInit(): void {

    // 從 http 網址網址中取的案件 id
    this.route.paramMap.subscribe((param) => {
      const fullRouteParam = param.get('groupId'); // 獲取完整的路由字串

      if (fullRouteParam) {
        // 拆解參數
        const [groupId, idAndCourt] = fullRouteParam.split('&id=');
        const [id, courtParam] = idAndCourt.split('&court=');
        const court = courtParam;

        // 將拆解出的值賦值到全域變數
        this.email = this.sessionServiceService.getEmail();
        this.judgmentJgroupId = groupId;
        this.judgmentJid = id;
        this.judgmentJcourt = court;

        // 呼叫 API，將文章內容載入頁面
        this.getJudgmentApi(this.judgmentJgroupId, this.judgmentJid, this.judgmentJcourt);

        // 檢查書籤是否已存在
        this.getBookmarkAlreadyExists(this.email, groupId, id, court);

        this.getHighlighterAlreadyExists(this.email, groupId, id, court);
      }

      // 紀錄觀看紀錄
      if (isPlatformBrowser(this.platformId) && sessionStorage.getItem('isLogin') === 'true') {
        // 確認是否已有觀看紀錄
        let record: Array<{
          id: string, groupId: string, court: string,
          year: number, month: number, date: number
        }> = JSON.parse(localStorage.getItem('historicalRecord_' + sessionStorage.getItem('email'))!) ?
            JSON.parse(localStorage.getItem('historicalRecord_' + sessionStorage.getItem('email'))!) : new Array();

        // 放入 historicalRecord 中
        this.historicalRecord = record;

        console.log(this.historicalRecord);
        const date = new Date();
        // 更新觀看紀錄
        record.unshift({
          id: this.judgmentJid,
          groupId: this.judgmentJgroupId,
          court: this.judgmentJcourt,
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          date: date.getDate(),
        })

        // 限制記錄比數為 10 筆
        if (record.length > 10) {
          record.pop(); // 刪除最後一筆
        }

        //更新觀看紀錄
        localStorage.setItem('historicalRecord_' + sessionStorage.getItem('email'), JSON.stringify(record));
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      // 僅在瀏覽器中執行這些程式碼，避免伺服器渲染時出錯
      document.addEventListener('mouseup', () => this.handleTextSelection());
      document.addEventListener('selectionchange', () => this.handleTextSelection());
      this.updateDynamicLink(); // 更新分享連結
      //==============================================================
      setTimeout(() => {
        this.isToolbarVisible = true; // 避免初始渲染出現工具列
      }, 10);
      //==============================================================
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 移除事件監聽器，防止記憶體洩漏
      document.removeEventListener('mouseup', () => this.saveSelection());
      document.removeEventListener('selectionchange', () => this.saveSelection());
    }
  }
  // 確保右上工具按鈕在頁面載入時不觸發動畫
  ngAfterViewInit() {
    // const toolbarButtons = document.querySelectorAll('.toolbar-button');
    // toolbarButtons.forEach((button) => (button as HTMLElement).blur()); // 確保按鈕失去焦點
  }

  //=========================================

  // 顯示工具列
  showToolbar(event: MouseEvent, highlightSpan: HTMLElement): void {
    const toolbar = this.toolbarRef.nativeElement;

    // 設定工具列位置
    this.renderer.setStyle(toolbar, 'top', `${event.clientY + window.scrollY}px`);
    this.renderer.setStyle(toolbar, 'left', `${event.clientX + window.scrollX}px`);

    // 顯示工具列
    this.renderer.removeClass(toolbar, 'hidden');
  }

  // 隱藏工具列
  hideToolbar(): void {
    const toolbar = this.toolbarRef.nativeElement;

    // 隱藏工具列
    this.renderer.addClass(toolbar, 'hidden');
  }

  // 動態顯示工具列
  handleTextSelection(): void {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // 保存選取範圍
      this.savedRange = range;

      // 確認選取範圍是否在文字區域內
      if (this.suptextSpan.nativeElement.contains(range.commonAncestorContainer)) {
        const toolbar = this.toolbarRef.nativeElement;

        // 設定工具列位置
        this.renderer.setStyle(toolbar, 'top', `${rect.bottom + window.scrollY + 5}px`);
        this.renderer.setStyle(toolbar, 'left', `${rect.left + window.scrollX}px`);
        this.renderer.removeClass(toolbar, 'hidden');
      } else {
        this.hideToolbar();
      }
    } else {
      this.hideToolbar();
    }
  }

  //========================================
  // 儲存用戶的選取範圍
  saveSelection(): void {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      this.savedRange = selection.getRangeAt(0);
      console.log('選取範圍已保存', this.savedRange);
    }
  }

  // 恢復用戶的選取範圍
  restoreSelection(): void {
    if (this.savedRange) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(this.savedRange);
      console.log('選取範圍已恢復', this.savedRange);
    }
  }
  //==========================================
  // api區
  // 搜尋給於id，呼叫後端接收判決書資料
  getJudgmentApi(judgmentJgroupId: string, judgmentJid: string, judgmentJcourt: string) {

    this.ngxService.start(); // 啟動 loading 動畫

    this.http
      .getApi('http://localhost:8080/case/judgmentid?groupId=' + judgmentJgroupId + '&id=' + judgmentJid + '&court=' + judgmentJcourt)
      .subscribe(
        (res: any) => {
          console.log(res);

          this.suptext = res.caseList[0].content2
            ? res.caseList[0].content + '\n' + res.caseList[0].content2
            : res.caseList[0].content;

          this.url = res.caseList[0].url;
          this.judgmentJid = res.caseList[0].id;
          this.court = this.sessionServiceService.turnCodeToName(res.caseList[0].court);
          this.charge = res.caseList[0].charge;
          this.verdictDate = res.caseList[0].verdictDate;
          this.defendantName = res.caseList[0].defendantName;
          this.judgeName = res.caseList[0].judgeName;
          this.caseType = res.caseList[0].caseType;
          this.docType = res.caseList[0].docType;
          this.ngxService.stop(); // 關閉 loading 動畫
        });
  }

  // 儲存書籤api
  postSaveBookmarkApi(email: string, groupId: string, id: string, court: string, charge: string, judgeName: string, defendantName: string, docType: string, caseType: string, verdictDate: string): void {
    const bookmark = { email, groupId, id, court, verdictDate, charge, defendantName, judgeName, caseType, docType };

    console.log(bookmark);

    // 檢查是否已存在書籤
    this.getBookmarkAlreadyExists(email, groupId, id, court);

    if (this.Bookmarkcode === 200) {
      this.openDialog('書籤已儲存，不須重複儲存！');
      return;
    }

    this.http.postApi('http://localhost:8080/accountSystem/bookmark', bookmark).subscribe({
      next: (res: any) => {
        console.log('書籤儲存成功:', res);

        // 更新書籤狀態
        this.Bookmarkcode = 200;

        this.openDialog('書籤已成功儲存！');
      },
    });
  }

  // 刪除書籤
  postDeleteBookmarkApi() {

  }


  // 確認書籤是否已存在
  getBookmarkAlreadyExists(email: string, groupId: string, id: string, court: string) {
    this.http
      .getApi('http://localhost:8080/accountSystem/bookmark-already-exists?email=' + email + '&groupId=' + groupId + '&id=' + id + '&court=' + court)
      .subscribe(
        (res: any) => {
          // 如果螢光筆資料庫沒有資料直接回傳
          if (res === null) return;
          this.Bookmarkcode = res.code;
        });
  }


  // 儲存螢光筆api
  postHighlighterApi(email: string, groupId: string, id: string, court: string, highlights: any) {
    const highlighter = {
      email: email,
      groupId: groupId,
      id: id,
      court: court,
      highlights: highlights
    }
    // console.log(highlighter);
    this.http.postApi('http://localhost:8080/accountSystem/seve-highlighte', highlighter).subscribe({
      next: () => {
        this.openDialog('螢光筆儲存成功!');
      }
    })
  }

  // 螢光筆取得
  getHighlighterAlreadyExists(email: string, groupId: string, id: string, court: string) {
    this.http
      .getApi('http://localhost:8080/accountSystem/highlighte-already-exists?email=' + email + '&groupId=' + groupId + '&id=' + id + '&court=' + court)
      .subscribe(
        (res: any) => {
          // 如果螢光筆資料庫沒有資料直接回傳
          if (res.code != 200) return;
          console.log(res);
          this.storeHighlightRanges(res.highlighteList);
          this.replaceTextWithHighlights();
        });
  }

  //==========================================
  // Clipboard 複製功能
  copyContent(): void {
    const selection = window.getSelection()?.toString() || '';
    if (selection) {
      this.clipboard.copy(selection);
      // alert('已複製選取內容！');
    } else {
      // alert('未選取任何內容！');
    }
  }

  // 引文複製功能(法院、字號)
  copyQuote() {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
      const citationFormat = `「${selectedText}」\n--- ` + this.judgmentJid;
      this.clipboard.copy(citationFormat);
    }
  }

  // 書籤-儲存判決書
  myFavorite() {
    const email = this.email;
    const groupId = this.judgmentJgroupId;
    const id = this.judgmentJid;
    const court = this.judgmentJcourt;
    const charge = this.charge;
    const judgeName = this.judgeName;
    const defendantName = this.defendantName;
    const docType = this.docType;
    const caseType = this.caseType;
    const verdictDate = this.verdictDate;

    if (!email || email.trim() === '') {
      this.openDialog('請先登入帳號');
      return;
    }

    // 呼叫儲存書籤 API
    this.postSaveBookmarkApi(email, groupId, id, court, charge, judgeName, defendantName, docType, caseType, verdictDate);
  }

  // 儲存螢光筆
  myhighlighters() {
    const email = this.email;
    const groupId = this.judgmentJgroupId;
    const id = this.judgmentJid;
    const court = this.judgmentJcourt;
    const highlights = this.highlightedRanges;
    if (!email || email.trim() === '') {
      this.openDialog('請先登入帳號');
      return;
    }

    if (!highlights || highlights.length === 0 || highlights.some(highlight => !highlight.selectText || highlight.selectText.trim() === '')) {
      this.openDialog('未使用螢光筆');
      return;
    }

    this.postHighlighterApi(email, groupId, id, court, highlights);
  }

  // 打開通知對話框
  openDialog(message: string): void {
    this.dialog.open(ClickDialogComponent, {
      data: { message }
    });
  }

  //==========================================================
  // 高亮功能，顏色參數為選擇的顏色
  highlightText(color: string, event?: MouseEvent): void {
    if (event) event.stopPropagation(); // 防止事件冒泡

    this.restoreSelection(); // 恢復選取範圍

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      alert('請先選取文字後再進行高亮操作！');
      return;
    }

    const range = selection.getRangeAt(0);
    const { startOffset, endOffset } = this.getAbsoluteOffset(range);

    // 更新高亮範圍，處理重疊範圍
    this.highlightedRanges = this.highlightedRanges.flatMap((highlight) => {
      if (highlight.endOffset <= startOffset || highlight.startOffset >= endOffset) {
        return [highlight]; // 保留無交集的高亮
      }

      const updatedRanges: HighlightRange[] = [];

      // 保留未覆蓋的前段
      if (highlight.startOffset < startOffset) {
        updatedRanges.push({
          ...highlight,
          endOffset: startOffset,
          selectText: this.suptext.slice(highlight.startOffset, startOffset),
        });
      }

      // 保留未覆蓋的後段
      if (highlight.endOffset > endOffset) {
        updatedRanges.push({
          ...highlight,
          startOffset: endOffset,
          selectText: this.suptext.slice(endOffset, highlight.endOffset),
        });
      }

      return updatedRanges;
    });

    // 新增新的高亮範圍
    const newHighlight: HighlightRange = {
      startOffset,
      endOffset,
      selectText: this.suptext.slice(startOffset, endOffset),
      highlighterColor: color,
    };
    this.highlightedRanges.push(newHighlight);

    // 更新顯示的高亮範圍資訊
    this.updateHighlightStorage();

    // 新增高亮文字到 DOM
    const highlightSpan = this.renderer.createElement('span');
    this.renderer.setStyle(highlightSpan, 'background-color', color);
    highlightSpan.appendChild(range.extractContents());
    range.insertNode(highlightSpan);

    selection.removeAllRanges(); // 清除選取範圍
  }


  private applyHighlights(): void {
    // 清除目前的高亮
    const highlightedSpans = this.suptextSpan.nativeElement.querySelectorAll(
      'span[style*="background-color"]'
    );
    highlightedSpans.forEach((span) => {
      const textNode = document.createTextNode(span.textContent || '');
      span.parentNode?.replaceChild(textNode, span);
    });

    // 重新新增高亮
    const content = this.suptextSpan.nativeElement.textContent || '';
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    this.highlightedRanges.forEach(({ startOffset, endOffset, highlighterColor: color }) => {
      // 新增普通文字
      if (startOffset > lastIndex) {
        const textNode = document.createTextNode(content.slice(lastIndex, startOffset));
        fragment.appendChild(textNode);
      }

      // 新增高亮文字
      const highlightSpan = document.createElement('span');
      highlightSpan.textContent = content.slice(startOffset, endOffset);
      highlightSpan.style.backgroundColor = color;
      fragment.appendChild(highlightSpan);

      lastIndex = endOffset;
    });

    // 新增剩餘普通文字
    if (lastIndex < content.length) {
      const textNode = document.createTextNode(content.slice(lastIndex));
      fragment.appendChild(textNode);
    }

    // 替換內容
    this.suptextSpan.nativeElement.innerHTML = '';
    this.suptextSpan.nativeElement.appendChild(fragment);
  }

  // 讀取 取得email所擁有的螢光筆文字替換進文章中
  replaceTextWithHighlights(): void {
    if (!this.suptext || typeof this.suptext !== 'string') {
      console.error('suptext is not initialized or is not a valid string.');
      return; // 中止操作
    }

    let textWithHighlights = this.suptext; // 初始化為原文
    let offsetCorrection = 0; // 偏移修正變數

    this.highlightedRanges
      .sort((a, b) => a.startOffset - b.startOffset)
      .forEach((range) => {
        const { startOffset, endOffset, selectText, highlighterColor } = range;

        const adjustedStart = startOffset + offsetCorrection;
        const adjustedEnd = endOffset + offsetCorrection;

        // 防禦性檢查：確保範圍不超出文字長度
        if (adjustedStart < 0 || adjustedEnd > textWithHighlights.length) {
          console.warn(
            `Invalid range: adjustedStart=${adjustedStart}, adjustedEnd=${adjustedEnd}, textLength=${textWithHighlights.length}`
          );
          return; // 跳過無效範圍
        }

        const currentText = textWithHighlights.slice(adjustedStart, adjustedEnd);
        if (currentText !== selectText) {
          console.warn(
            `範圍文字不匹配：預期 "${selectText}"，實際 "${currentText}"`
          );
          return;
        }

        const highlightedText = `<span style="background-color: ${highlighterColor};">${selectText}</span>`;
        const beforeText = textWithHighlights.slice(0, adjustedStart);
        const afterText = textWithHighlights.slice(adjustedEnd);
        textWithHighlights = beforeText + highlightedText + afterText;

        offsetCorrection += highlightedText.length - selectText.length;
      });

    this.suptextSpan.nativeElement.innerHTML = textWithHighlights;
  }



  //===============================================================
  // 詢問清除全部螢光效果
  removeAllHighlights(): void {
    const dialogRef = this.dialog.open(FullTextDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // 用戶點擊了確定清除
        console.log('清除全部螢光效果');
        this.performHighlightRemoval();
      } else {
        // 用戶點擊了取消
        console.log('取消清除');
      }
    });
  }
  // 執行清除螢光效果
  performHighlightRemoval(): void {
    this.highlightedRanges = []; // 清空儲存的高亮範圍

    const highlightedSpans = this.suptextSpan.nativeElement.querySelectorAll(
      'span[style*="background-color"]'
    );

    highlightedSpans.forEach((span) => {
      const textNode = document.createTextNode(span.textContent || '');
      span.parentNode?.replaceChild(textNode, span);
    });

    this.updateHighlightStorage(); // 更新儲存
  }

  // 刪除選取範圍內的高亮效果
  removeHighlightsInRange(event?: MouseEvent): void {
    if (event) event.stopPropagation(); // 防止事件冒泡
    this.restoreSelection(); // 恢復選取範圍

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      alert('請先選取要刪除高亮的文字範圍！');
      return;
    }

    const range = selection.getRangeAt(0);
    const startOffset = this.getAbsoluteOffset(range).startOffset;
    const endOffset = this.getAbsoluteOffset(range).endOffset;

    // 遍歷高亮節點
    const walker = document.createTreeWalker(
      this.suptextSpan.nativeElement,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node: Node) => {
          const el = node as HTMLElement;
          return el.style.backgroundColor && range.intersectsNode(el)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      }
    );

    const nodesToProcess: HTMLElement[] = [];
    let currentNode: Node | null = walker.nextNode();
    while (currentNode) {
      nodesToProcess.push(currentNode as HTMLElement);
      currentNode = walker.nextNode();
    }

    // 更新 DOM
    nodesToProcess.forEach((span) => {
      const spanRange = document.createRange();
      spanRange.selectNodeContents(span);

      const spanStart = Math.max(
        0,
        range.startOffset - spanRange.startOffset
      );
      const spanEnd = Math.min(
        span.textContent?.length || 0,
        range.endOffset - spanRange.startOffset
      );

      if (spanStart >= spanEnd) return; // 無交集，跳過

      const textContent = span.textContent || '';
      const beforeText = textContent.slice(0, spanStart);
      const removedText = textContent.slice(spanStart, spanEnd);
      const afterText = textContent.slice(spanEnd);

      const parent = span.parentNode;

      // 插入前段高亮文字
      if (beforeText.trim()) {
        const beforeSpan = span.cloneNode() as HTMLElement;
        beforeSpan.textContent = beforeText;
        parent?.insertBefore(beforeSpan, span);
      }

      // 插入移除高亮部分為普通文字
      if (removedText.trim()) {
        const normalTextNode = document.createTextNode(removedText);
        parent?.insertBefore(normalTextNode, span);
      }

      // 插入後段高亮文字
      if (afterText.trim()) {
        const afterSpan = span.cloneNode() as HTMLElement;
        afterSpan.textContent = afterText;
        parent?.insertBefore(afterSpan, span.nextSibling);
      }

      // 移除原高亮文字
      parent?.removeChild(span);
    });

    // 更新儲存結構
    this.highlightedRanges = this.highlightedRanges.flatMap((highlight) => {
      if (
        highlight.endOffset <= startOffset || // 無交集範圍
        highlight.startOffset >= endOffset
      ) {
        return [highlight];
      }

      const updatedRanges: HighlightRange[] = [];

      // 前段高亮
      if (highlight.startOffset < startOffset) {
        updatedRanges.push({
          ...highlight,
          endOffset: startOffset,
          selectText: this.suptextSpan.nativeElement.textContent!.slice(
            highlight.startOffset,
            startOffset
          ),
        });
      }

      // 後段高亮
      if (highlight.endOffset > endOffset) {
        updatedRanges.push({
          ...highlight,
          startOffset: endOffset,
          selectText: this.suptextSpan.nativeElement.textContent!.slice(
            endOffset,
            highlight.endOffset
          ),
        });
      }

      return updatedRanges;
    });

    // 呼叫 updateHighlightStorage 以列印結果
    this.updateHighlightStorage();
    selection.removeAllRanges(); // 清除選取範圍
  }

  //=========================================
  // 本站網站連結複製
  copyLink = '';

  updateDynamicLink() {
    // 獲取當前路徑並生成完整網址
    const currentUrl = this.router.createUrlTree([], { relativeTo: this.route }).toString();
    this.copyLink = `${window.location.origin}${currentUrl}`;
  }

  onShare() {
    this.updateDynamicLink(); // 確保分享按鈕點擊時更新網址
    navigator.clipboard.writeText(this.copyLink).then(() => {
      alert('網址已複製到剪貼簿！');
    }).catch(() => {
      alert('複製失敗，請手動複製網址。');
    });
  }
  // 前往判決書網站
  onOpenInNew() {
    window.open(this.url, '_blank');
  }
  // 判決書PDF檔下載
  onDownloadPDF() {
    // alert('PDF 下載按鈕被點擊！');
  }
  //===================================================

  // 切換選項框顯示狀態
  togglePrintOptions(): void {
    this.showPrintOptions = !this.showPrintOptions;

    if (this.showPrintOptions) {
      // 設置全局事件監聽器，點擊其他地方關閉選項框
      setTimeout(() => {
        document.addEventListener('click', this.closePrintOptionsOnOutsideClick.bind(this));
      }, 0);
    } else {
      // 移除全局事件監聽器
      document.removeEventListener('click', this.closePrintOptionsOnOutsideClick.bind(this));
    }
  }


  // 點擊列印選項(呼叫新分頁)
  onPrint(includeHighlights: boolean): void {
    console.log('列印功能，附帶螢光:', includeHighlights);
    this.showPrintOptions = false;

    // 移除全局事件監聽器
    document.removeEventListener('click', this.closePrintOptionsOnOutsideClick.bind(this));


    // 複製主文內容
    const mainContent = document.querySelector('.main-content')?.cloneNode(true) as HTMLElement;
    if (!mainContent) {
      alert('無法找到主文內容進行列印！');
      return;
    }


    // 根據是否附帶螢光筆切換樣式
    if (!includeHighlights) {
      // 清除所有帶有背景色的元素樣式
      const spansWithBackground = mainContent.querySelectorAll('*[style*="background-color"]');
      spansWithBackground.forEach((el) => {
        el.removeAttribute('style');
      });
    }

    // 建立列印窗口
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('無法開啟列印窗口！');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>列印</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              min-height: 100vh;
              background-color: white;
            }
            .main-content {
              max-width: 1000px;
              width: 90%;
              margin: 20px auto;
              padding: 20px;
              text-align: left;
              line-height: 1.8;
              font-size: 14px;
              word-wrap: break-word;
              white-space: pre-wrap; /* 保留換行符號 */
              box-sizing: border-box;
            }
            pre {
              margin: 0;
              font-size: 22px;
            }
            .back-button,
            .document__toolbar,
            .print-options {
              display: none !important;
            }
            .no-highlight span[style*="background-color"] {
              background-color: inherit !important;
            }
          </style>
        </head>
        <body>${mainContent.outerHTML}</body>
      </html>
    `);


    printWindow.document.close();

    // 確保樣式更新後再進行列印
    setTimeout(() => {
      printWindow.print();

      // 在列印後自動關閉窗口
      printWindow.onafterprint = () => printWindow.close();

      // 如果未自動關閉，則手動關閉
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
        }
      }, 500); // 延遲0.5秒後關閉視窗
    }, 100); // 延遲100毫秒確保樣式更新完成
  }

  // 點擊按鈕外部關閉選項框
  private closePrintOptionsOnOutsideClick(event: MouseEvent): void {
    const printOptions = document.querySelector('.print-options');
    const printButton = document.querySelector('.print-button');

    if (printOptions && !printOptions.contains(event.target as Node) && !printButton?.contains(event.target as Node)) {
      this.showPrintOptions = false;
      document.removeEventListener('click', this.closePrintOptionsOnOutsideClick.bind(this));
    }
  }

  //=========================================
  // 回搜尋頁
  returnToPreviousPage() {
    if (this.sessionServiceService.url) {
      this.router.navigate([this.sessionServiceService.url]);
    } else {
      this.router.navigate(['/search-result']);
    }
  }
  //=========================================
  // 高亮文字索引位置儲存方法:
  highlightedRanges: HighlightRange[] = []; // 儲存高亮範圍

  highlighterData: any[] = []; // 從後端取得的高亮資料
  // 監控高亮文字位置儲存狀態
  updateHighlightStorage(range?: { startOffset: number; endOffset: number }, add: boolean = false, highlighterColor: string = 'yellow'): void {
    if (!range) {
      console.log('更新高亮範圍儲存：', this.highlightedRanges);
      return;
    }

    if (add) {
      // 新增高亮範圍，補全 HighlightRange 的屬性
      const selectText = this.suptextSpan.nativeElement.textContent?.slice(range.startOffset, range.endOffset) || '';
      this.highlightedRanges.push({
        ...range,
        selectText: selectText, // 提取範圍內的文字
        highlighterColor: highlighterColor, // 指定顏色
      });
    } else {
      // 移除範圍內的高亮
      this.highlightedRanges = this.highlightedRanges.filter((highlight) => {
        return (
          highlight.endOffset <= range.startOffset || highlight.startOffset >= range.endOffset
        );
      });
    }

    console.log('更新後的高亮範圍：', this.highlightedRanges);
  }


  // 偏移量計算方法，計算文章長度，去判斷螢光筆文字的位置
  getAbsoluteOffset(range: Range): { startOffset: number; endOffset: number } {
    const fullText = this.suptext; // 獲取完整文章內容
    const startContainer = range.startContainer.textContent || '';
    const endContainer = range.endContainer.textContent || '';

    const startIndex =
      fullText.indexOf(startContainer) + range.startOffset;
    const endIndex =
      fullText.indexOf(endContainer) + range.endOffset;

    return { startOffset: startIndex, endOffset: endIndex };
  }

  // 將高亮資料存入 highlightedRanges 容器
  storeHighlightRanges(highlighterData: any[]): void {
    this.highlightedRanges = highlighterData.map((item) => ({
      startOffset: item.start_offset,
      endOffset: item.end_offset,
      selectText: item.Select_text,
      highlighterColor: item.highlighter_color
    }));

    console.log('儲存的高亮範圍：', this.highlightedRanges);
  }

  //===========================================================================
  addHour(date: Date, hours: number): Date {
    const dateCopy = new Date(date.getTime());
    const hoursToAdd = hours * 60 * 60 * 1000;
    dateCopy.setTime(date.getTime() + hoursToAdd);
    return dateCopy;
  }

  // 觀看瀏覽紀錄所指定的全文
  checkContent(groupId: string, id: string, court: string) {
    // 將網址與案件 id 綁在一起
    this.router.navigateByUrl('full-text/' + groupId + '&id=' + id + '&court=' + court);
  }
}
// 儲存高亮文字位置格式
interface HighlightRange {
  startOffset: number; // 起始位置
  endOffset: number; // 結束位置
  selectText: string; // 提取的文字
  highlighterColor: string; // 顏色
}
