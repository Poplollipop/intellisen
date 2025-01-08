import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common'; // 匯入 CommonModule
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchSessionService } from '../../service/search-session.service';
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
    @Inject(PLATFORM_ID) private platformId: Object,
    private searchSessionService: SearchSessionService,
  ) { }

  @ViewChild('suptextSpan', { static: false }) suptextSpan!: ElementRef<HTMLSpanElement>;
  @ViewChild('toolbar', { static: false }) toolbarRef!: ElementRef<HTMLDivElement>;


  suptext!: any;
  url!: any;
  currentHighlight: HTMLElement | null = null; // 用於追蹤當前被選中的高亮元素
  savedRange: Range | null = null; // 用於保存用戶的選取範圍
  showPrintOptions = false; // 控制列印選項框的顯示狀態
  isToolbarVisible = false; // 控制工具列表起始狀態:為 false 不啟用


  ngOnInit(): void {
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

  // 引文複製功能
  copyQuote() {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
      const citationFormat = `「${selectedText}」\n--- 引自 司法院事實型量刑資訊系統`;
      this.clipboard.copy(citationFormat);
    }
  }
  //==========================================================
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
    // 清除原有文字 增加新效果文字
    highlightSpan.appendChild(range.extractContents());
    range.insertNode(highlightSpan);
    // console.log(highlightSpan);


    // 綁定點擊事件，點擊高亮文字時顯示工具列
    this.renderer.listen(highlightSpan, 'click', (event: MouseEvent) => {
      this.showToolbar(event, highlightSpan);
    });

    selection.removeAllRanges(); // 清除選取範圍
  }


  //===============================================================
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

    const nodesToProcess: HTMLElement[] = [];
    let currentNode: Node | null = walker.nextNode();
    while (currentNode) {
      nodesToProcess.push(currentNode as HTMLElement);
      currentNode = walker.nextNode();
    }

    for (const span of nodesToProcess) {
      const spanRange = document.createRange();
      spanRange.selectNodeContents(span);

      const spanStart = range.compareBoundaryPoints(Range.START_TO_START, spanRange) <= 0
        ? 0
        : range.startOffset - spanRange.startOffset;
      const spanEnd = range.compareBoundaryPoints(Range.END_TO_END, spanRange) >= 0
        ? span.textContent!.length
        : range.endOffset - spanRange.startOffset;

      if (spanStart >= spanEnd) continue; // 無交集，跳過

      const textContent = span.textContent || '';
      const beforeText = textContent.slice(0, spanStart);
      const highlightedText = textContent.slice(spanStart, spanEnd);
      const afterText = textContent.slice(spanEnd);

      const parent = span.parentNode;

      // 依次插入節點
      if (beforeText) {
        const beforeSpan = span.cloneNode() as HTMLElement;
        beforeSpan.textContent = beforeText;
        parent?.insertBefore(beforeSpan, span);
      }

      if (highlightedText) {
        const normalTextNode = document.createTextNode(highlightedText);
        parent?.insertBefore(normalTextNode, span);
      }

      if (afterText) {
        const afterSpan = span.cloneNode() as HTMLElement;
        afterSpan.textContent = afterText;
        parent?.insertBefore(afterSpan, span.nextSibling);
      }

      // 移除原高亮文字
      parent?.removeChild(span);
    }

    // 清除選取範圍
    selection.removeAllRanges();
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
  //   toptext =
  //   `臺灣臺中地方法院刑事判決
  //  111年度訴字第1978號
  //  公訴人臺灣臺中地方檢察署檢察官
  //  被告楊智凱



  //  選任辯護人唐光義律師
  //  被告游忠銘


  //  選任辯護人沈暐翔律師
  //  上列被告因違反廢棄物清理法案件，檢察官提起公訴（110年度
  //  偵字第20181號、111年度偵字第15408號）後，被告於本院準
  //  備程序中就被訴事實為有罪之陳述，經聲請改依協商程序而為判
  //  決，本院合議庭裁定由受命法官獨任進行協商程序，判決如下：
  //  主文
  //  楊智凱共同犯廢棄物清理法第四十六條第四款前段之非法處理廢
  //  棄物罪，處有期徒刑壹年貳月。緩刑貳年，並應於民國一百一十
  //  三年十月三十一日前向公庫支付新臺幣貳萬元。扣案之蘋果廠牌
  //  行動電話壹支（含0000000000號SIM卡壹張）沒收。
  //  游忠銘共同犯廢棄物清理法第四十六條第四款前段之非法處理廢
  //  棄物罪，處有期徒刑壹年。緩刑貳年，並應於民國一百一十三年
  //  十一月十五日前向公庫支付新臺幣壹萬元。
  //  犯罪事實及理由
  //  一、本件犯罪事實及證據，除證據部分補充「被告楊智凱、游忠
  //  銘於本院準備程序時之自白」外，其餘均引用檢察官起訴書
  //  之記載（如附件）。
  //  二、本案經檢察官與被告、辯護人於審判外達成協商之合意，且
  //  被告已認罪，其合意內容如主文所示。經查，上開協商合意
  //  無刑事訴訟法第455條之4第1項所列情形之一，檢察官聲
  //  請改依協商程序而為判決，本院爰不經言詞辯論，於協商合
  //  意範圍內為協商判決。
  //  三、應適用之法條：刑事訴訟法第455條之2第1項、第455條
  //  之4第2項、第455條之8、第454條第2項，廢棄物清理
  //  法第46條第3款、第4款前段，刑法第11條前段、第28條、
  //  第55條、第74條第1項第1款、第2項第4款，判決如主文
  //  。
  //  四、協商判決除有刑事訴訟法第455條之4第1項第1款於訊問
  //  程序終結前，被告撤銷協商合意或檢察官撤回協商聲請者；
  //  第2款被告協商之意思非出於自由意志者；第4款被告所犯
  //  之罪非第455條之2第1項所得以協商判決者；第6款被告
  //  有其他較重之裁判上一罪之犯罪事實者；第7款法院認應諭
  //  知免刑或免訴、不受理者情形之一，以及違反同條第2項「
  //  法院應於協商合意範圍內為判決；法院為協商判決所科之刑
  //  ，以宣告緩刑、2年以下有期徒刑、拘役或罰金為限。」之
  //  規定外，不得上訴。
  //  五、如有上開可得上訴情形，應於收受判決送達後20日內向本院
  //  提出上訴書狀（應敘述具體理由並附繕本）。上訴書狀如未
  //  敘述理由，應於上訴期間屆滿後20日內補提理由書於本院。

  //  本案經檢察官陳宜君提起公訴，檢察官謝道明、蕭如娟到庭執行
  //  職務。`;
  //   buttontext = `中　　華　　民　　國　　113　年　　5　　月　　21　　日 刑事第八庭法官陳建宇
  //  以上正本證明與原本無異。
  //  如不服本判決應於收受送達後20日內向本院提出上訴書狀，並應
  //  敘述具體理由；其未敘述上訴理由者，應於上訴期間屆滿後20日
  //  內向本院補提理由書（均須按他造當事人之人數附繕本）「切勿
  //  逕送上級法院」。
  //  　　　　書記官何惠文
  //  中　　華　　民　　國　　113　年　　5　　月　　21　　日
  //  【附錄論罪科刑法條】
  //  廢棄物清理法第46條
  //  有下列情形之一者，處1年以上5年以下有期徒刑，得併科新臺幣
  //  1千5百萬元以下罰金：
  //  一、任意棄置有害事業廢棄物。
  //  二、事業負責人或相關人員未依本法規定之方式貯存、清除、處
  //  理或再利用廢棄物，致污染環境。
  //  三、未經主管機關許可，提供土地回填、堆置廢棄物。
  //  四、未依第41條第1項規定領有廢棄物清除、處理許可文件，從
  //  事廢棄物貯存、清除、處理，或未依廢棄物清除、處理許可
  //  文件內容貯存、清除、處理廢棄物。
  //  五、執行機關之人員委託未取得許可文件之業者，清除、處理一
  //  般廢棄物者；或明知受託人非法清除、處理而仍委託。
  //  六、公民營廢棄物處理機構負責人或相關人員、或執行機關之人
  //  員未處理廢棄物，開具虛偽證明。
  //  【附件】
  //  臺灣臺中地方檢察署檢察官起訴書
  //  110年度偵字第20181號
  //  111年度偵字第15408號
  //  　　被　　　告　生邑實業股份有限公司
  //  　　　　　　　　　　　　設臺北市○○區○○路0段000號8樓之6
  //  兼代表人陳榮陞男　67歲（民國00年0月0日生）
  //  　　　　　　　　　　　　住○○市○○區○○路0段000巷00弄000號3樓
  //  　　　　　　　　　　　　國民身分證統一編號：Z000000&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;000號
  //  　　被　　　告　高文秀　男　68歲（民國00年0月00日生）
  //  　　　　　　　　　　　住○○市○○區○○街00號6樓
  //  　　　　　　　　　　國民身分證統一編號：Z0000000
  //  &ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;
  //  &ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;00號
  //  　　　　　　　　楊智凱　男　39歲（民國00年00月00日生）
  //  　　　　　　　　　　　　住彰化縣○○市○○○路00號
  //  　　　　　　　　　　　　國民身分證統一編號：Z0000000&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;00號
  //  上三人之
  //  共同選任辯護人黃啟逢律師
  //  　　被　　　　　告　劉中興　男　54歲（民國00年0月00日生）
  //  　　　　　　　　　　　　住彰化縣○○鎮○○路000號
  //  　　　　　　　　　　　　居彰化縣○○鄉○○路○○段00巷00號
  //  　　　　　　　　　　　　國民身分證統一編號：Z0000000&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;00號
  //  　　　　　　　　游忠銘　男　31歲（民國00年00月00日生）
  //  　　　　　　　　　　　　住南投縣○○鎮○○巷00號
  //  　　　　　　　　　　　　國民身分證統一編號：Z0000000&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;&ZZZZ;00號
  //  上列被告等因違反廢棄物清理法案件，業經偵查終結，認應提起
  //  公訴，茲敘述犯罪事實及證據並所犯法條如下：
  //  　　　　犯罪事實
  //  一、陳榮陞為生邑實業股份有限公司(下稱生邑公司)之負責人，
  //  綜理公司所有事務、高文秀為生邑公司之總經理，負責指揮
  //  、指派生邑公司芳苑廠及臺中廠之事務分配以及有關生邑公
  //  司堆肥製程及相關業務、楊智凱是生邑公司芳苑廠(業因水
  //  汙染問題，遭彰化縣環保局於110年1月27日勒令停業)及臺
  //  中廠(址設臺中市○○區○○路0段000巷00號，下稱生邑公司臺
  //  中廠)之現場負責人，負責安排工廠司機、員工之工作分配
  //  、公司17噸及7.4噸車輛載運肥料之原物料之調度、劉中興(
  //  通常駕駛車牌號碼000-0000號)及游忠銘(通常駕駛車牌號碼
  //  000-0000號)均為生邑公司所聘僱負責駕駛載運粗糠混摻豬
  //  糞至芳苑廠及臺中廠堆置之司機，均為從事生邑公司處理廢
  //  棄物相關業務之人。生邑公司是臺中市○○區○○段00地號、31
  //  地號(建物門牌為臺中市○○區○○路0段000巷00號、12-1號，
  //  下稱系爭土地)之承租人(承租期間自民國110年4月22日起至
  //  120年4月21日止，向霑露精密科技有限公司承租)。渠等均
  //  明知向址設嘉義縣朴子市吳朴子腳85-9號之「松華畜牧場」
  //  及址設南投縣○○鄉○○巷0000號之「鴻淯畜牧場」所載運之未
  //  經醱酵及脫水過程之生雞糞，屬一般事業廢棄物，未依規定
  //  領有廢棄物清除、處理許可文件，不得從事廢棄物貯存、清
  //  除、處理，且陳榮陞、高文秀、楊智凱亦均明知未經主管機
  //  關許可，不得提供土地堆置廢棄物。陳榮陞、高文秀、楊智
  //  凱、劉中興、游忠銘等人竟均基於非法載運、清除、處理廢
  //  棄物之犯意聯絡，陳榮陞、高文秀、楊智凱另基於非法提供
  //  土地堆置之犯意聯絡，由陳榮陞、高文秀指示楊智凱，楊智
  //  凱再指示司機劉中興、游忠銘，於110年2月4日起至同年5月
  //  5日期間，由劉中興駕駛車牌號碼000-0000號大貨車、游忠
  //  銘駕駛車牌號碼000-0000號大貨車，分別至前開「松華畜牧
  //  場」、「鴻淯畜牧場」載運未經醱酵及脫水過程之袋裝及散
  //  裝粗糠混拌雞糞共計約220公噸至系爭土地上堆置。嗣因臺
  //  中市環境保護局(下稱臺中市環保局)於110年4月8日接獲民
  //  眾陳情生邑公司臺中廠內飄散臭味，至系爭土地稽查，始發
  //  現生邑公司臺中廠堆置大量散裝及袋裝之粗糠混雞糞後，由
  //  內政部警政署保安警察第七總隊第三大隊第二中隊，於110
  //  年6月22日10時許，持臺灣臺中地方法院(下稱臺中地院)核
  //  發之搜索票至生邑公司臺中廠、芳苑廠及臺北總公司搜索，
  //  扣得生邑公司租賃契約書1本、109至110年度有機資源物委
  //  外堆肥再利用計畫1本、高群環保再利用申報資料1本、高群
  //  環保顧問生邑實業委託及再利用申報及契約書1本、松華畜
  //  牧場委託生邑公司肉雞資料清除、再利用處理契約書2本、
  //  臺灣卜蜂廢棄物委託清運暨代處理契約書1本、卜蜂粗糠雞
  //  屎清運費110年1-5月1本、生邑實業股份有限公司銷貨明細
  //  表1本、生邑實業股份有限公司銷貨明細表1本、生邑實業股
  //  份有限公司華南商業銀行存摺2本、生邑實業股份有限公司
  //  股東名簿1本、生邑實業股份有限公司銷貨明細表1本、楊智
  //  凱所有之手機(IPHONZ0000000000號)1支等物，始查悉上情
  //  。
  //  二、案經本署檢察官指揮內政部警政署保安警察第七總隊第三大
  //  隊移送偵辦。
  //  　　　　證據並所犯法條
  //  一、證據清單及待證事實：
  //  編號證據名稱待證事實1被告陳榮陞、高文秀、楊智凱、劉中興、游忠銘等人於警詢及偵查中之供述。1.被告陳榮陞為生邑公司之負責人；被告高文秀為生邑公司之總經理，被告楊智凱為生邑公司芳苑廠及臺中廠之現場負責人，被告劉中興、游忠銘為生邑公司之司機，並各職司上開事務之事實。2.生邑公司芳苑廠領有再利用廢棄物許可文件，惟因水汙染問題，於110年1月27日遭勒令停工之事實。3.生邑公司臺中廠未領有再利用廢棄物許可文件，亦未領有廢棄物清除、處理、堆置等許可文件之事實。4.生邑公司臺中廠於110年5月5日、6日遭臺中市環保局查獲堆置粗糠混拌雞糞，且是由被告高文秀指示楊智凱轉而指示司機即被告劉中興、游忠銘至「松華畜牧場」、「鴻淯畜牧場」載運回到生邑公司臺中廠堆置之事實。5.遭查獲之袋裝、散裝粗糠混拌雞糞共計約220公噸之事實。2證人劉春夏、張添義、吳金龍、陳忠訓、葉秀涼、謝秀珠於警詢及偵查之證述。1.被告陳榮陞是生邑公司的董事長，之前有到生邑公司芳苑廠向伊等說明薪資的事情。2.生邑公司芳苑廠有取得再利用廢棄物許可證，但因水汙染問題，遭環保局勒令於110年1月27日停工之事實。3.生邑公司臺中廠是葉秀涼與被告高文秀於110年2月份簽約租賃的。4.被告楊智凱是臺中廠的現場負責人，依被告高文秀指示作技術研發、工人管理、肥料製程等項目、被告高文秀是生邑公司的技術總監，是總經理兼顧問、被告陳榮陞是生邑公司的董事長，會主持公司的董事會或股東會。5.被告高文秀會指示被告楊智凱轉指示被告劉中興、游忠銘至嘉義、南投等地載運粗糠拌雞糞至生邑公司臺中廠堆置之事實。3員警職務報告、通報案件資訊單、臺中市環保局陳情案件處理管制單、環境稽查紀錄表(110年5月5日、5月6日、6月22日)、稽查現場照片、經濟部商業司商工登記公示資料查詢服務、生邑公司與霑露精密科技有限公司之廠房租賃契約、車輛查詢清單報表、地磅單、生邑公司芳苑廠停工函(彰化縣政府110年1月27日府授環水字第1100031356號函)、生邑公司芳苑廠廢棄物清理計畫書、再利用檢核文件、工廠公示資料查詢系統、臺中市○○區○○段00地號土地建物查詢資料、生邑公司現場及粗糠雞糞堆置照片、車牌000-0000號大貨車之監視錄影翻拍照片、被告劉中興與證人陳忠訓之LINE對話截圖、被告劉中興與證人吳金龍之LINE對話截圖、被告劉中興與被告楊智凱之LINE對話截圖、廢棄物(粗糠混合雞糞)委託處理合約書、生邑公司芳苑廠廢棄物(植物性廢渣)再利用處理合約書、被告高文秀之名片影本、被告等人之勞健保資料、臺中市環保局110年12月27日中市環稽字第1100142322號函、搜索扣押筆錄、扣押物品目錄表、證人張添義與陳忠訓之LINE對話截圖、證人吳金龍與被告高文秀之LINE對話紀錄截圖。1.生邑公司芳苑廠有取得再利用廢棄物許可證，但因水汙染問題，遭環保局勒令於110年1月27日停工之事實。2.生邑公司臺中廠未領有再利用廢棄物許可文件，亦未領有廢棄物清除、處理、堆置等許可文件之事實。3.生邑公司臺中廠於110年5月5日、6日遭臺中市環保局查獲堆置粗糠混拌雞糞，且是由被告高文秀指示楊智凱轉而指示司機即被告劉中興、游忠銘至「松華畜牧場」、「鴻淯畜牧場」載運回到生邑公司臺中廠堆置之事實。4.遭查獲之袋裝、散裝粗糠混拌雞糞共計約220公噸之事實。
  //  二、被告陳榮陞為生邑公司之負責人，其代表生邑公司承租霑露
  //  精密科技有限公司所有之系爭土地及其上之建物廠房作為生
  //  邑公司臺中廠之廠址，而被告高文秀、楊智凱均為對生邑公
  //  司臺中廠有實際掌控指揮權利之人，是渠等均為系爭土地之
  //  管理人及使用人。故核被告陳榮陞、高文秀、楊智凱所為，
  //  均係犯廢棄物清理法第46條第3款之未經主管機關許可，提
  //  供土地堆置廢棄物及同條第4款前段之未依規定領有廢棄物
  //  清除、處理許可文件，從事廢棄物貯存、清除、處理等罪嫌
  //  ；核被告劉中興、游忠銘所為，係犯廢棄物清理法第46條第
  //  4款前段之未依規定領有廢棄物清除、處理許可文件，從事
  //  廢棄物貯存、清除、處理罪嫌。又被告生邑公司為法人，因
  //  其負責人、受雇人即被告陳榮陞等人執行業務犯同法第46條
  //  第3款、第4款前段之罪，依同法第47條規定，應科以同法第
  //  46條之罰金刑。被告陳榮陞、高文秀、楊智凱前開2犯行，
  //  係屬一行為觸犯數罪名，請從一重處斷。又被告陳榮陞、高
  //  文秀、楊智凱、劉中興、游忠銘就上開非法清除、處理廢棄
  //  物，有犯意聯絡及行為分擔，請論以共同正犯。再上開所扣
  //  押之被告楊智凱之手機，係被告楊智凱所有，且為犯罪所用
  //  之物，請依刑法第38條第2項之規定沒收之，其餘扣押之物
  //  ，因無法證明是供犯罪所用或為犯罪所得之物，爰不聲請沒
  //  收，附此敘明。
  //  三、依刑事訴訟法第251條第1項提起公訴。　　　　　
  //  　　此　致
  //  臺灣臺中地方法院
  //  中　　華　　民　　國　111　　年　　8　　月　　18　　日
  //  檢察官陳宜君
  //  本件正本證明與原本無異
  //  中　　華　　民　　國　111　年　　9　　月　9　日
  //  書記官卓宜嫻
  //  附錄本案所犯法條
  //  廢棄物清理法第46條
  //  有下列情形之一者，處1年以上5年以下有期徒刑，得併科新
  //  臺幣1千5百萬元以下罰金：
  //  一、任意棄置有害事業廢棄物。
  //  二、事業負責人或相關人員未依本法規定之方式貯存、清除、處
  //  理或再利用廢棄物，致污染環境。
  //  三、未經主管機關許可，提供土地回填、堆置廢棄物。
  //  四、未依第41條第1項規定領有廢棄物清除、處理許可文件
  //  ，從事廢棄物貯存、清除、處理，或未依廢棄物清除、處理
  //  許可文件內容貯存、清除、處理廢棄物。
  //  五、執行機關之人員委託未取得許可文件之業者，清除、處理一
  //  般廢棄物者；或明知受託人非法清除、處理而仍委託。
  //  六、公民營廢棄物處理機構負責人或相關人員、或執行機關之人
  //  員未處理廢棄物，開具虛偽證明。
  //  廢棄物清理法第47條
  //  法人之負責人、法人或自然人之代理人、受僱人或其他從業人員
  //  ，因執行業務犯前二條之罪者，除處罰其行為人外，對該法人或
  //  自然人亦科以各該條之罰金。`;

  // suptext = this.toptext + '\n' + this.buttontext;
}


