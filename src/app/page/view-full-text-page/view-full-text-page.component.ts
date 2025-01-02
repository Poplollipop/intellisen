import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ViewChild, Renderer2  } from '@angular/core';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';

interface MarkIndex {
  type: number;
  length: number;
  range: number[];
}

@Component({
  selector: 'app-view-full-text-page',
  imports: [MatIconModule,

  ],
  templateUrl: './view-full-text-page.component.html',
  styleUrl: './view-full-text-page.component.scss'
})
export class ViewFullTextPageComponent {
// 額外功能選取文字時 可以知道它的index位置
  constructor(
    private router: Router,
    private clipboard: Clipboard,
    private renderer: Renderer2
  ){}

  @ViewChild('toptextSpan', { static: false }) toptextSpanRef!: ElementRef<HTMLSpanElement>;
  @ViewChild('buttontextSpan', { static: false }) buttontextSpanRef!: ElementRef<HTMLSpanElement>;
  @ViewChild('toolbar', { static: false }) toolbarRef!: ElementRef<HTMLDivElement>;

  toptext = '上半內文，這是一段測試文字。';
  buttontext = '下半內文，請選取部分文字進行高亮。';

  currentHighlight: HTMLElement | null = null;


  ngOnInit(): void {
    document.addEventListener('mouseup', () => this.saveSelection());
    document.addEventListener('selectionchange', () => this.saveSelection());
  }

  ngOnDestroy(): void {
    document.removeEventListener('mouseup', () => this.saveSelection());
    document.removeEventListener('selectionchange', () => this.saveSelection());
  }

  //=========================================


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
    if (event) {
      event.stopPropagation(); // 防止事件冒泡清除選取範圍
    }

    this.restoreSelection(); // 恢復選取範圍

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      console.warn('未選取任何文字');
      alert('請先選取文字後再進行高亮操作！');
      return;
    }

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;

    // 檢查範圍是否在目標文字區域內
    if (
      !this.toptextSpanRef.nativeElement.contains(commonAncestor) &&
      !this.buttontextSpanRef.nativeElement.contains(commonAncestor)
    ) {
      console.warn('選取範圍不在目標文字區域內');
      alert('請選取正確的文字範圍！');
      return;
    }

    // 移除選取範圍內的舊高亮
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;

    let currentNode: Node | null = startContainer;
    while (currentNode) {
      if (currentNode.nodeType === 1 && (currentNode as HTMLElement).style.backgroundColor) {
        // 如果是高亮的 span，則移除
        const span = currentNode as HTMLElement;
        const textNode = document.createTextNode(span.textContent || '');
        span.parentNode?.replaceChild(textNode, span);
      }

      // 遍歷到下一個節點，直到結束容器
      if (currentNode === endContainer) break;
      currentNode = currentNode.nextSibling;
    }

    // 添加新的高亮
    const highlightSpan = this.renderer.createElement('span');
    this.renderer.setStyle(highlightSpan, 'background-color', color);
    this.renderer.setStyle(highlightSpan, 'border-radius', '2px');
    this.renderer.setStyle(highlightSpan, 'cursor', 'pointer');
    highlightSpan.appendChild(range.extractContents());
    range.insertNode(highlightSpan);

    // 綁定點擊事件，顯示工具欄
    this.renderer.listen(highlightSpan, 'click', (event: MouseEvent) => {
      this.showToolbar(event, highlightSpan);
    });

    selection.removeAllRanges(); // 清除選取範圍
    console.log('新高亮已應用');
  }



  savedRange: Range | null = null;

  saveSelection(): void {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      this.savedRange = selection.getRangeAt(0); // 保存選取範圍
      console.log('選取範圍已保存', this.savedRange);
    }
  }


  restoreSelection(): void {
    if (this.savedRange) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(this.savedRange); // 恢復選取範圍
      console.log('選取範圍已恢復', this.savedRange);
    }
  }

  // 顯示工具欄
  showToolbar(event: MouseEvent, highlightSpan: HTMLElement): void {
    const toolbar = this.toolbarRef.nativeElement;
    this.currentHighlight = highlightSpan;

    this.renderer.setStyle(toolbar, 'top', `${event.clientY}px`);
    this.renderer.setStyle(toolbar, 'left', `${event.clientX}px`);
    this.renderer.removeClass(toolbar, 'hidden');
  }

  // 隱藏工具欄
  hideToolbar(): void {
    const toolbar = this.toolbarRef.nativeElement;
    this.renderer.addClass(toolbar, 'hidden');
    this.currentHighlight = null;
  }

  // 刪除高亮
  removeAllHighlights(): void {
    const parentElements = [
      this.toptextSpanRef.nativeElement,
      this.buttontextSpanRef.nativeElement,
    ];

    parentElements.forEach((parent) => {
      const highlightedSpans = parent.querySelectorAll('span[style*="background-color"]');
      highlightedSpans.forEach((span) => {
        const textNode = document.createTextNode(span.textContent || '');
        span.parentNode?.replaceChild(textNode, span); // 替換 span 為純文字
      });
    });

    console.log('所有螢光效果已刪除');
  }

  removeHighlightsInRange(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // 防止事件冒泡清除選取範圍
    }

    this.restoreSelection(); // 恢復選取範圍

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      console.warn('未選取任何文字');
      alert('請先選取要刪除高亮的文字範圍！');
      return;
    }

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;

    // 確保選取範圍在目標文字區域內
    if (
      !this.toptextSpanRef.nativeElement.contains(commonAncestor) &&
      !this.buttontextSpanRef.nativeElement.contains(commonAncestor)
    ) {
      console.warn('選取範圍不在目標文字區域內');
      alert('請選取正確的文字範圍！');
      return;
    }

    // 刪除範圍內的高亮
    const fragment = range.cloneContents();
    const spans = Array.from(fragment.querySelectorAll('span[style*="background-color"]'));

    spans.forEach((span) => {
      const textNode = document.createTextNode(span.textContent || '');
      span.parentNode?.replaceChild(textNode, span);
    });

    console.log('選取範圍內的螢光效果已刪除');
  }


  // 更改高亮顏色
  changeHighlightColor(color: string): void {
    if (this.currentHighlight) {
      this.renderer.setStyle(this.currentHighlight, 'background-color', color);
    }
  }


  //=========================================

  copyLink = '';

  onShare() {
    // alert('分享按鈕被點擊！');
  }

  onDownload() {
    alert('下載暫無功能');
  }

  onDownloadPDF() {
    // alert('PDF 下載按鈕被點擊！');
  }

  onPrint(includeHighlights: boolean = false) {
    if (includeHighlights) {
      // alert('列印帶有螢光筆標記');
    } else {
      // alert('列印不帶螢光筆標記');
    }
  }

  onCopyLink() {
    navigator.clipboard.writeText(this.copyLink).then(() => {
      // alert('連結已複製！');
    });
  }

  //=========================================
  // 回上頁
  returnToPreviousPage(){
    this.router.navigate(['/search-result']);
  }

}


