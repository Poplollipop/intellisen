import { FullTextDialogComponent } from './full-text-dialog/full-text-dialog.component';
import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common'; // 匯入 CommonModule
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchSessionService } from '../../service/search-session.service';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-view-full-text-page',
  imports: [MatIconModule,
    MatTooltipModule,
    CommonModule,
  ],
  templateUrl: './view-full-text-page.component.html',
  styleUrl: './view-full-text-page.component.scss'
})
// 增加網頁ID，並儲存該ID給伺服器
export class ViewFullTextPageComponent {
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private searchSessionService: SearchSessionService,
  ) { }

  @ViewChild('suptextSpan', { static: false }) suptextSpan!: ElementRef<HTMLSpanElement>;
  @ViewChild('toolbar', { static: false }) toolbarRef!: ElementRef<HTMLDivElement>;


  suptext!: any;
  url!: any;
  judgmentJid!: any;
  currentHighlight: HTMLElement | null = null; // 用於追蹤當前被選中的高亮元素
  savedRange: Range | null = null; // 用於保存用戶的選取範圍
  showPrintOptions = false; // 控制列印選項框的顯示狀態
  isToolbarVisible = false; // 控制工具列表起始狀態:為 false 不啟用


  ngOnInit(): void {
    // 從 http 網址網址中取的案件 id
    this.route.paramMap.subscribe((param) => {
      this.judgmentJid = param.get('id');
    })

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
      this.suptext = this.searchSessionService.singleCaseDate.content;
      this.url = this.searchSessionService.singleCaseDate.url;
      this.judgmentJid = this.searchSessionService.singleCaseDate.groupId;
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
    const toolbarButtons = document.querySelectorAll('.toolbar-button');
    toolbarButtons.forEach((button) => (button as HTMLElement).blur()); // 確保按鈕失去焦點
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
      const citationFormat = `「${selectedText}」` + this.judgmentJid + `\n--- 引自 司法院事實型量刑資訊系統`;
      this.clipboard.copy(citationFormat);
    }
  }

  // 我的最愛-儲存判決書
  myFavorite(){

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
          text: this.suptext.slice(highlight.startOffset, startOffset),
        });
      }

      // 保留未覆蓋的後段
      if (highlight.endOffset > endOffset) {
        updatedRanges.push({
          ...highlight,
          startOffset: endOffset,
          text: this.suptext.slice(endOffset, highlight.endOffset),
        });
      }

      return updatedRanges;
    });

    // 新增新的高亮範圍
    const newHighlight: HighlightRange = {
      startOffset,
      endOffset,
      text: this.suptext.slice(startOffset, endOffset),
      color,
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

    this.highlightedRanges.forEach(({ startOffset, endOffset, color }) => {
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


  // 更改高亮顏色()
  // changeHighlightColor(color: string): void {
  //   if (!this.currentHighlight) {
  //     alert('請先選取要更改顏色的高亮文字！');
  //     return;
  //   }

  //   const highlightRange = this.highlightedRanges.find(
  //     (h) =>
  //       h.text === this.currentHighlight?.textContent &&
  //       h.startOffset === this.savedRange?.startOffset &&
  //       h.endOffset === this.savedRange?.endOffset
  //   );

  //   if (highlightRange) {
  //     highlightRange.color = color;
  //     this.renderer.setStyle(this.currentHighlight, 'background-color', color);
  //   }

  //   this.updateHighlightStorage(); // 更新儲存
  // }
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
          text: this.suptextSpan.nativeElement.textContent!.slice(
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
          text: this.suptextSpan.nativeElement.textContent!.slice(
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
  togglePrintOptions() {
    this.showPrintOptions = !this.showPrintOptions;
  }

  // 點擊列印選項
  onPrint(includeHighlights: boolean): void {
    console.log(includeHighlights); // 這裡會顯示用戶選擇的值

    const body = document.getElementById('toptext');

    if (body) {
      // 根據 includeHighlights 來動態切換類別
      if (includeHighlights) {
        body.classList.remove('no-highlight'); // 加上 highlight 類
      }
      if (!includeHighlights) {
        body.classList.add('no-highlight');  // 移除 highlight 類
      }
    }

    // 觸發列印
    setTimeout(() => {
      window.print();
    }, 100); // 等待一些時間以確保列印選項被應用
  }

  //=========================================
  // 回上頁
  returnToPreviousPage() {
    this.router.navigate(['/search-result']);
  }
  //=========================================
  // 高亮文字索引位置儲存方法:
  highlightedRanges: HighlightRange[] = []; // 儲存高亮範圍
  // 監控高亮文字位置儲存狀態
  updateHighlightStorage(range?: { startOffset: number; endOffset: number }, add: boolean = false, color: string = 'yellow'): void {
    if (!range) {
      console.log('更新高亮範圍儲存：', this.highlightedRanges);
      return;
    }

    if (add) {
      // 新增高亮範圍，補全 HighlightRange 的屬性
      const text = this.suptextSpan.nativeElement.textContent?.slice(range.startOffset, range.endOffset) || '';
      this.highlightedRanges.push({
        ...range,
        text, // 提取範圍內的文字
        color, // 指定顏色
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

}
// 儲存高亮文字位置格式
interface HighlightRange {
  startOffset: number; // 起始位置
  endOffset: number; // 結束位置
  text: string; // 提取的文字
  color: string; // 顏色
}
