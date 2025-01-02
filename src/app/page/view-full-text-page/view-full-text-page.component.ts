import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common'; // 匯入 CommonModule
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
interface MarkIndex {
  type: number;
  length: number;
  range: number[];
}

@Component({
  selector: 'app-view-full-text-page',
  imports: [MatIconModule,
    MatTooltipModule,
    CommonModule,
  ],
  templateUrl: './view-full-text-page.component.html',
  styleUrl: './view-full-text-page.component.scss'
})
export class ViewFullTextPageComponent {
  // 額外功能選取文字時 可以知道它的index位置
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  @ViewChild('suptextSpan', { static: false }) suptextSpan!: ElementRef<HTMLSpanElement>;
  @ViewChild('toolbar', { static: false }) toolbarRef!: ElementRef<HTMLDivElement>;



  currentHighlight: HTMLElement | null = null; // 用於追蹤當前被選中的高亮元素
  savedRange: Range | null = null; // 用於保存用戶的選取範圍
  showPrintOptions = false; // 控制列印選項框的顯示狀態


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 僅在瀏覽器中執行這些程式碼，避免伺服器渲染時出錯
      document.addEventListener('mouseup', () => this.handleTextSelection());
      document.addEventListener('selectionchange', () => this.handleTextSelection());
      this.updateDynamicLink(); // 更新分享連結
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 移除事件監聽器，防止記憶體洩漏
      document.removeEventListener('mouseup', () => this.saveSelection());
      document.removeEventListener('selectionchange', () => this.saveSelection());
    }
  }

  //=========================================

  // 顯示工具欄
  showToolbar(event: MouseEvent, highlightSpan: HTMLElement): void {
    const toolbar = this.toolbarRef.nativeElement;

    // 設置工具欄的位置
    this.renderer.setStyle(toolbar, 'top', `${event.clientY + window.scrollY}px`);
    this.renderer.setStyle(toolbar, 'left', `${event.clientX + window.scrollX}px`);
    this.renderer.removeClass(toolbar, 'hidden'); // 顯示工具欄
    this.currentHighlight = highlightSpan; // 設定當前高亮的文字元素
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


  // 隱藏工具列
  hideToolbar(): void {
    const toolbar = this.toolbarRef.nativeElement;
    this.renderer.addClass(toolbar, 'hidden');
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

  // 引文複製功能
  copyQuote() {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
      const citationFormat = `「${selectedText}」\n--- 引自 司法院事實型量刑資訊系統`;
      this.clipboard.copy(citationFormat);
    }
  }

  // 高亮功能，顏色參數為選擇的顏色
  highlightText(color: string, event?: MouseEvent): void {
    if (event) event.stopPropagation(); // 防止事件冒泡

    // 恢復選取範圍
    this.restoreSelection();

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      alert('請先選取文字後再進行高亮操作！');
      return;
    }

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;

    // 檢查選取範圍是否在目標文字區域內
    if (!this.suptextSpan.nativeElement.contains(commonAncestor)) {
      alert('請選取正確的文字範圍！');
      return;
    }

    // 創建高亮的 span 元素
    const highlightSpan = this.renderer.createElement('span');
    this.renderer.setStyle(highlightSpan, 'background-color', color);
    this.renderer.setStyle(highlightSpan, 'border-radius', '2px');
    this.renderer.setStyle(highlightSpan, 'cursor', 'pointer');
    highlightSpan.appendChild(range.extractContents());
    range.insertNode(highlightSpan);

    // 綁定點擊事件，點擊高亮文字時顯示工具列
    this.renderer.listen(highlightSpan, 'click', (event: MouseEvent) => {
      this.showToolbar(event, highlightSpan);
    });

    selection.removeAllRanges(); // 清除選取範圍
  }



  // 刪除所有高亮效果
  removeAllHighlights(): void {
    const highlightedSpans = this.suptextSpan.nativeElement.querySelectorAll('span[style*="background-color"]');
    highlightedSpans.forEach((span) => {
      const textNode = document.createTextNode(span.textContent || '');
      span.parentNode?.replaceChild(textNode, span);
    });
  }


  // 刪除選取範圍內的高亮效果
  removeHighlightsInRange(event?: MouseEvent): void {
    if (event) event.stopPropagation(); // 防止事件冒泡
    this.restoreSelection(); // 恢復用戶的選取範圍

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      alert('請先選取要刪除高亮的文字範圍！');
      return;
    }

    const range = selection.getRangeAt(0);
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

    let currentNode: Node | null = walker.nextNode();
    while (currentNode) {
      const span = currentNode as HTMLElement;

      // 範圍與節點是否完全重合
      const spanRange = document.createRange();
      spanRange.selectNodeContents(span);

      if (range.compareBoundaryPoints(Range.START_TO_START, spanRange) <= 0 &&
        range.compareBoundaryPoints(Range.END_TO_END, spanRange) >= 0) {
        const textNode = document.createTextNode(span.textContent || '');
        span.parentNode!.replaceChild(textNode, span);
      }

      currentNode = walker.nextNode();
    }
  }



  // 更改高亮顏色
  changeHighlightColor(color: string): void {
    if (this.currentHighlight) {
      this.renderer.setStyle(this.currentHighlight, 'background-color', color);
    }
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
    window.open('https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TCDM%2c109%2c%E9%87%91%E8%A8%B4%2c495%2c20240529%2c2', '_blank');
  }
  // 判決書PDF檔下載
  onDownloadPDF() {
    // alert('PDF 下載按鈕被點擊！');
  }
  //===================================================

  // 切換選項框顯示狀態
  togglePrintOptions() {
    this.showPrintOptions = !this.showPrintOptions;
  }


  // 點擊列印選項
  onPrint(includeHighlights: boolean = false) {
    console.log('列印選項已選擇:', includeHighlights ? '附帶螢光筆' : '不附帶螢光筆');

    this.showPrintOptions = false; // 隱藏選項框
    if (includeHighlights) {
      this.prepareHighlightsForPrint(true);
    } else {
      this.prepareHighlightsForPrint(false);
    }

    window.print(); // 啟動列印功能
  }

  // 處理高亮邏輯
  prepareHighlightsForPrint(includeHighlights: boolean) {
    if (includeHighlights) {
      console.log('列印帶有螢光筆標記的內容');
      // 添加處理高亮邏輯
    } else {
      console.log('列印不帶螢光筆標記的內容');
      // 添加清除高亮邏輯
    }
  }


  //=========================================
  // 回上頁
  returnToPreviousPage() {
    this.router.navigate(['/search-result']);
  }
  //=========================================
  toptext = `臺灣臺北地方法院刑事附帶民事訴訟判決
 108年度附民字第672號
 原告張育慈
 劉圓
 洪家澤
 上列原告與被告GLOBALPROPERTYCLUB（即ANB＆M101集團）、
 葉廷浩間請求侵權行為損害賠償事件，本院判決如下：
 主文
 原告之訴及假執行之聲請均駁回。
 理由
 一、按「提起附帶民事訴訟，應提出訴狀於法院為之」、「前項
 訴狀，準用民事訴訟法之規定」，刑事訴訟法第492條第1項
 及第2項分別定有明文。而原告之訴有起訴不合程式或不備
 其他要件之情形者，依其情形可以補正經審判長定期間命其
 補正而不補正者，法院應以裁定駁回之，民事訴訟法第249
 條第1項定有明文。復按起訴，應以訴狀表明當事人及法定
 代理人、訴訟標的及其原因事實、應受判決事項之聲明，同
 法第244條第1項亦有規定。再按當事人書狀，應記載當事人
 姓名、住所或居所，此為起訴必須具備之程式，同法第116
 條第1項第1款復有明定。又刑事訴訟法第502條第1項規定：
 「法院認為原告之訴不合法或無理由者，應以判決駁回之。
 」
 二、查本件原告起訴未完整載明被告GLOBALPROPERTYCLUB（即
 ANB＆M101集團，下稱ANB集團）之正確名稱，另未記載被告A
 NB集團之公務所、事務所或營業所，暨被告葉廷浩之住所或
 居所，亦未提出其餘相關資料，致本院無從特定當事人，經
 本院於民國109年2月14日裁定命原告於裁定送達後10日內補
 正，此裁定於同年月24日送達原告，然原告逾期迄今仍未補
 正等情，有刑事附帶民事訴訟起訴狀、上開裁定及本院送達
 證書在卷可憑。是揆諸首揭說明，本件附帶民事訴訟有民事
 訴訟法第249條第1項第6款起訴不合程式或不備其他要件之
 情事，應予駁回。原告之訴既經駁回，則其假執行之聲請即
 失所依據，併予駁回。
 三、據上論斷，應依刑事訴訟法第502條第1項判決如主文。`;
  buttontext = `刑事第十六庭審判長法　官　胡宗淦
 法　官　程欣儀
 法　官　林幸怡
 以上正本證明與原本無異。
 對本判決如不服非對刑事判決上訴時不得上訴並應於送達後20日
 內，向本院提出上訴狀。
 書記官李玟郁
 中　　華　　民　　國　　113　年　　6　　月　　5　　日`;

  suptext = this.toptext + this.buttontext;
}


