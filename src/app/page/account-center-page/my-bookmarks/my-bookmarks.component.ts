import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ScrollTop } from 'primeng/scrolltop';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionServiceService } from '../../../service/session-service.service';
import { HttpClientService } from '../../../service/http-client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-bookmarks',
  imports: [MatTabsModule, MatIconModule, ScrollTop, CommonModule],
  templateUrl: './my-bookmarks.component.html',
  styleUrl: './my-bookmarks.component.scss',
})
export class MyBookmarksComponent implements OnInit {
  constructor(
    private router: Router,
    protected sessionServiceService: SessionServiceService,
    private http: HttpClientService
  ) {}
  email!: any;

  // 螢光筆書籤容器
  apiResponse: any[] = [];

  // 書籤容器
  bookmarks: any[] = [];

  ngOnInit(): void {
    // this.email = this.sessionServiceService.getEmail();
    // this.getBookmarksApi(this.email);
    this.getHighlightersApi(this.email);
    this.bookmarks = this.getBookmarks(); // 取得書籤
  }

  checkContent(groupId: string, id: string, court: string) {
    this.router.navigateByUrl(
      'full-text/' + groupId + '&id=' + id + '&court=' + court
    );
    this.sessionServiceService.url = this.router.url;
  }
  // =======================================================================================

  // // 我的書籤假資料
  // myBookmarks = [
  //   {
  //     groupId: "113年度中簡字第1265號",
  //     id: "113年度中簡字第1265號",
  //     court: "臺灣臺中地方法院",
  //     verdictDate: "2024-05-31",
  //     url: "https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TCDM%2c113%2c中簡%2c1265%2c20240531%2c1",
  //     charge: "毒品危害防制條例",
  //     content: "臺灣臺中地方法院刑事簡易判決\r\n113年度中簡字第1265號\r\n聲請人臺灣臺中地方檢察署檢察官\r\n被告黃仁助\r\n\r\n籍設高雄市○○區○○○路000號（即高雄○○○○○○○○）\r\n\r\n上列被告因違反毒品危害防制條例案件，經檢察官聲請以簡易判\r\n決處刑（113年度毒偵字第1174號），本院判決如下：\r\n主文\r\n乙○○施用第二級毒品，累犯，處有期徒刑伍月，如易科罰金，以\r\n新臺幣壹仟元折算壹日。\r\n犯罪事實及理由\r\n一、本案犯罪事實及證據，均引用檢察官聲請簡易判決處刑書之\r\n記載（如附件）。\r\n二、論罪科刑：\r\n(一)按觀察、勒戒或強制戒治執行完畢釋放後，3年內再犯第10\r\n條之罪者，檢察官或少年法院（地方法院少年法庭）應依法\r\n追訴或裁定交付審理，毒品危害防制條例條第23條第2項定\r\n有明文。查，被告乙○○前因施用毒品案件，經依臺灣高雄地\r\n方法院裁定令入勒戒處所觀察、勒戒後，認無繼續施用毒品\r\n之傾向，於民國111年9月1日釋放，並經臺灣臺中地方檢察\r\n署檢察官以111年度毒偵字第37、197號為不起訴處分確定，\r\n有該不起訴處分書及臺灣高等法院被告前案紀錄表各1份附\r\n卷可稽。是檢察官就被告再犯本案施用第二級毒品甲基安非\r\n他命之犯行聲請簡易判決處刑，核與毒品危害防制條例第23\r\n條第2項之規定相合。\r\n(二)次按甲基安非他命係毒品危害防制條例第2條第2項第2款所\r\n規定之第二級毒品，不得非法施用、持有。是核被告所為，\r\n係犯毒品危害防制條例第10條第2項之施用第二級毒品罪。\r\n其為供施用第二級毒品而持有該級毒品（無證據證明已達毒\r\n品危害防制條例第11條第4項所定第二級毒品純質淨重20公\r\n克以上）之低度行為，應為施用之高度行為所吸收，不另論\r\n罪。\r\n(三)又被告前因施用第一級、第二級毒品犯行，分別經臺灣高雄\r\n地方法院各判決判處有期徒刑9月、5月、6月確定，再經同\r\n院以110年度聲字第843號裁定應執行有期徒刑1年5月確定，\r\n於110年7月20日假釋付保護管束出監，惟嗣經撤銷假釋，執\r\n行殘刑9月4日，於112年4月23日徒刑執行完畢，有臺灣高等\r\n法院被告前案紀錄表在卷可參。是被告受徒刑之執行完畢後\r\n，5年以內故意再犯本件有期徒刑以上之罪，為累犯。上開\r\n構成累犯之事實，業經檢察官於聲請簡易判決處刑書載明，\r\n並提出臺灣高雄地方法院110年度聲字第843號刑事裁定及刑\r\n案資料查註紀錄表各1份為據，且於聲請簡易判決處刑書敘\r\n明被告應依刑法第47條第1項規定加重其刑之理由，堪認檢\r\n察官已就上開構成累犯之事實及加重量刑事項，已盡主張舉\r\n證及說明責任。本院審酌被告於上開有期徒執行完畢後5年\r\n內，仍故意為相同犯罪類型之本案犯罪，可見其主觀上有特\r\n別惡性，且對刑罰反應力薄弱，前所受科刑處分，尚不足使\r\n被告警惕，認依關於累犯之規定加重其刑，並無過苛之情，\r\n爰依刑法第47條第1項之規定加重其刑。　　　\r\n(四)爰審酌被告曾因施用毒品犯行接受觀察、勒戒，猶未能從中\r\n記取教訓，深切體認毒品危害己身健康之鉅，反而於本案再\r\n次施用第二級毒品甲基安非他命，顯見被告自制能力尚有未\r\n足，所為應予非難。復考量被告於偵查中已坦承犯行之犯罪\r\n後態度，及被告除構成累犯之案件外，尚曾因妨害自由、違\r\n反動產擔保交易法、竊盜、多次施用毒品等案件，經法院判\r\n決判處罪刑確定之前科素行狀況，有臺灣高等法院被告前案\r\n紀錄表附卷可稽，並衡以被告所自陳之智識程度、家庭經濟\r\n狀況（見毒偵3638卷第43頁被告警詢筆錄受詢問人欄中之記\r\n載）等一切情狀，量處如主文所示之刑，並諭知易科罰金之\r\n折算標準。\r\n三、據上論斷，依刑事訴訟法第449條第1項前段、第3項、第454\r\n條第2項，毒品危害防制條例第10條第2項，刑法第11條前段\r\n、第47條第1項、第41條第1項前段，逕以簡易判決處刑如主\r\n文。\r\n四、如不服本判決，應於本判決送達後20日內，向本院提出上訴\r\n狀（應附繕本），並敘述具體理由，上訴於本院第二審合議\r\n庭。\r\n本案經檢察官甲○○聲請簡易判決處刑。",
  //     content2: "中　　華　　民　　國　　113　年　　5　　月　　31　　日\n臺中簡易庭法官曹錫泓\r\n以上正本證明與原本無異。\r\n書記官黃毅皓\r\n中　　華　　民　　國　　113　年　　5　　月　　31　　日\r\n附錄論罪科刑法條：\r\n毒品危害防制條例第10條第2項\r\n施用第二級毒品者，處3年以下有期徒刑。\r\n附件：\r\n臺灣臺中地方檢察署檢察官聲請簡易判決處刑書\r\n113年度毒偵字第1174號\r\n　　被　　　告　乙○○　男　46歲（民國00年0月00日生）\r\n　　　　　　　　　　　　住○○市○○區○○路00巷00號\r\n　　　　　　　　　　　　居臺中市○○區○○巷00○00號\r\n　　　　　　　　　　　　國民身分證統一編號：Z000000000號\r\n上列被告因違反毒品危害防制條例案件，業經偵查終結，認宜聲\r\n請以簡易判決處刑，茲將犯罪事實及證據並所犯法條分敘如下：\r\n　　　　犯罪事實\r\n一、乙○○前因違反毒品危害防制條例等多起案件，分別經臺灣高\r\n雄地方法院法院判處有期徒刑9月、5月、6月確定，嗣經同\r\n法院以110年度聲字第843號定應合併執行有期徒刑1年5月確\r\n定，經接續執行，於民國112年4月23日執行完畢出監。又前\r\n因施用毒品案件，經依法院裁定送觀察、勒戒後，認無繼續\r\n施用毒品之傾向，於111年9月1日執行完畢釋放，並由臺灣\r\n高雄地方檢察署檢察官以111年度毒偵字第37號、第197號為\r\n不起訴處分確定。詎猶不知悔改，於前揭觀察、勒戒執行完\r\n畢釋放之3年內，復基於施用第二級毒品之犯意，於112年8\r\n月27日18時至19時許間，在高雄市○○區○○路00巷00號住所內\r\n，以將第二級毒品甲基安非他命放入玻璃球燒烤後吸食煙霧\r\n之方式，施用第二級毒品甲基安非他命1次。嗣於112年8月3\r\n0日17時58分許，為警持臺灣高雄地方檢察署檢察官核發之\r\n強制到場(強制採驗尿液)許可書及經其同意後採集其尿液送\r\n檢驗，結果呈甲基安非他命陽性反應而查悉上情。\r\n二、案經臺中市政府警察局第六分局報告偵辦。\r\n　　　　證據並所犯法條\r\n一、上揭犯罪事實，業據被告乙○○於偵查中坦承不諱，復有欣生\r\n生物科技股份有限公司濫用藥物尿液檢驗報告、臺中市政府\r\n警察局第六分局偵辦毒品案件尿液檢體對照表、委託鑑驗尿\r\n液代號與真實姓名對照表、自願受採尿同意書、臺灣高雄地\r\n方檢察署檢察官核發之強制到場(強制採驗尿液)許可書等各\r\n1份在卷可稽，足認被告之任意性自白核與事實相符，其犯\r\n嫌堪以認定。\r\n二、核被告所為，係犯毒品危害防制條例第10條第2項之施用第\r\n第二級毒品罪嫌。其施用第二級毒品甲基安非他命前後持有\r\n該毒品之低度行為，應為施用毒品之高度行為所吸收，不另\r\n論罪。又被告於有期徒刑執行完畢5年以內，故意再犯本件\r\n有期徒刑以上之罪，有本署刑案資料查註紀錄表、上開法院\r\n刑事裁定各1份等在卷可稽，依刑法第47條第1項之規定應論\r\n以累犯。又依司法官大法官會議釋字第775號解釋及最高法\r\n院110年度台上大字第5660號裁定意旨，累犯是否加重其刑\r\n，應考量累犯者是否具有「特別惡性」及「對刑罰反應力薄\r\n弱」等立法理由。經查，本件被告所犯前案與本案之罪質相\r\n同、犯罪類型、侵害法益種類相同、惡性程度非輕，且前案\r\n執行完畢距本案案發時間僅不到1年，是足認被告對先前所\r\n受刑之執行顯然欠缺感知、刑罰反應力薄弱而有特別惡性，\r\n再被告亦無刑法第59條所定犯罪之情狀顯可憫恕，認科以最\r\n低度刑仍嫌過重之情形，爰請依前揭解釋及裁定意旨，審酌\r\n加重其刑。\r\n三、依毒品危害防制條例第23條第2項、刑事訴訟法第451條第1\r\n項聲請逕以簡易判決處刑。\r\n　　此　致\r\n臺灣臺中地方法院\r\n中　　華　　民　　國　113　　年　　4　　月　　22　日\r\n　　　　　　　　　　　　　檢　察　官甲○○\r\n本件正本證明與原本無異\r\n中　　華　　民　　國　113　　年　　5　　月　　6　　日\r\n書記官王宥筑\r\n附錄本案所犯法條全文\r\n毒品危害防制條例第10條\r\n施用第一級毒品者，處6月以上5年以下有期徒刑。\r\n施用第二級毒品者，處3年以下有期徒刑。",
  //     defendantName: "黃仁助",
  //     judgeName: "曹錫泓",
  //     law: "毒品危害防制條例第23條第2項;毒品危害防制條例第2條第2項;毒品危害防制條例第10條第2項;毒品危害防制條例第11條第4項;刑法第47條第1項;刑法第47條第1項;毒品危害防制條例第10條第2項;刑法第11條;毒品危害防制條例第10條第2項;毒品危害防制條例第10條第2項;刑法第47條第1項;刑法第59條;毒品危害防制條例第23條第2項;毒品危害防制條例第10條",
  //     caseType: "刑事",
  //     docType: "判決"
  //   },
  //   {
  //     groupId: "113年度中簡字第1267號",
  //     id: "113年度中簡字第1267號",
  //     court: "臺灣臺中地方法院",
  //     verdictDate: "2024-05-31",
  //     url: "https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TCDM%2c113%2c中簡%2c1267%2c20240531%2c1",
  //     charge: "竊盜",
  //     content: "臺灣臺中地方法院刑事簡易判決\r\n113年度中簡字第1267號\r\n聲請人臺灣臺中地方檢察署檢察官\r\n被告魏柏章\r\n\r\n\r\n上列被告因竊盜案件，經檢察官聲請以簡易判決處刑（113年度\r\n速偵字第1774號），本院判決如下：\r\n主文\r\n魏柏章犯竊盜罪，處拘役壹拾日，如易科罰金，以新臺幣壹仟元\r\n折算壹日。\r\n犯罪事實及理由\r\n一、本件犯罪事實及證據，除證據並所犯法條欄一、應增列「臺\r\n中市政府警察局太平分局太平派出所受（處）理案件證明單\r\n、被告提出之中華民國身心障礙證明、臺中市太平區低收入\r\n戶證明書」之外，其餘均引用檢察官聲請簡易判決處刑書之\r\n記載（如附件）。\r\n二、核被告魏柏章所為，均係犯刑法第320條第1項之竊盜罪。\r\n三、爰以行為人之責任為基礎，審酌被告不思循正當管道獲取自\r\n身所需，竟為滿足一己私慾，任意竊取他人財物，欠缺尊重\r\n他人財產權之觀念，所為誠屬不當，復審酌被告所竊取之財\r\n物價值，且已發還告訴人，有贓物認領保管單在卷可佐(見\r\n偵卷第47頁)，並衡酌被告坦承犯行之犯後態度、被告自陳\r\n國中畢業、無業、家庭經濟狀況貧寒及個人之健康狀況（參\r\n見被告警詢調查筆錄受詢問人欄之記載、被告提出之中華民\r\n國身心障礙證明、臺中市太平區低收入戶證明書），再佐以\r\n本案之犯罪動機、目的、手段、情節及犯罪所生之危害等一\r\n切情狀，量處如主文所示之刑，並諭知易科罰金之折算標準\r\n，以資懲儆。\r\n四、按犯罪所得屬於犯罪行為人者，沒收之；於全部或一部不能\r\n沒收或不宜執行沒收時，追徵其價額；犯罪所得已實際合法\r\n發還被害人者，不予宣告沒收或追徵，刑法第38條之1第1項\r\n前段、第3項及第5項分別定有明文。查，本件被告竊得之豬\r\n五花肉條1盒及澳洲牛肩里肌火鍋肉片1盒，業經告訴人領回\r\n，有贓物認領保管單在卷可佐(見偵卷第47頁)，則被告本件\r\n犯罪所得既已實際合法發還被害人，爰不予宣告沒收。\r\n五、依刑事訴訟法第449條第1項前段、第3項、第454條第2項，\r\n刑法第320條第1項、第41條第1項前段，刑法施行法第1條之\r\n1第1項，逕以簡易判決處刑如主文。\r\n六、如不服本判決，得自收受送達判決書之日起20日內，向本院\r\n提出上訴書狀（應附繕本），上訴於管轄之本院合議庭。\r\n本案經檢察官王靖夫聲請以簡易判決處刑。",
  //     content2: "中　　華　　民　　國　　113　年　　5　　月　　31　　日\n臺中簡易庭法官吳孟潔\r\n以上正本證明與原本無異。\r\n如不服本判決，應於收受送達後20日內向本院提出上訴書狀（應\r\n附繕本）。\r\n告訴人或被害人如不服判決，應備理由具狀向檢察官請求上訴，\r\n上訴期間之計算，以檢察官收受判決正本之日起算。\r\n　　　　　　　　　　　　　書記官林育蘋\r\n　　　　　　　　　　　　　　\r\n中　　華　　民　　國　　113　年　　6　　月　　3　　日\r\n　　　　　　　　　　　　　\r\n附錄本案論罪科刑法條全文\r\n中華民國刑法第320條\r\n意圖為自己或第三人不法之所有，而竊取他人之動產者，為竊盜\r\n罪，處5年以下有期徒刑、拘役或50萬元以下罰金。\r\n意圖為自己或第三人不法之利益，而竊佔他人之不動產者，依前\r\n項之規定處斷。\r\n前二項之未遂犯罰之。\r\n\r\n附件：\r\n臺灣臺中地方檢察署檢察官聲請簡易判決處刑書\r\n113年度速偵字第1774號\r\n　　被　　　告　魏柏章　男　47歲（民國00年00月00日生）\r\n　　　　　　　　　　　　住○○市○○區○○○○街00號3樓\r\n　　　　　　　　　　　　國民身分證統一編號：Z000000000號\r\n選任辯護人王晨瀚律師（法律扶助基金會律師，已於民國\r\n113年5月8日終止委任）\r\n上列被告因竊盜案件，業經偵查終結，認為宜聲請以簡易判決處\r\n刑，茲將犯罪事實及證據並所犯法條分敘如下：　\r\n　　　　犯罪事實\r\n一、魏柏章意圖為自己不法之所有，基於竊盜之犯意，於民國11\r\n3年5月8日10時13分許，前往址設臺中市○○區○○路000號之全\r\n聯福利中心太平中平門市，徒手竊取該店店長蔣雅玲所管領\r\n之豬五花肉條1盒及澳洲牛肩里肌火鍋肉片1盒（價值新臺幣\r\n305元），得手後，將上開竊取物品藏放於隨身攜帶之黑色\r\n塑膠袋內，未經結帳逕自離去，因警報器響起，店員追出攔\r\n阻，蔣雅玲報警處理。經警到場扣得上開豬五花肉條1盒及\r\n澳洲牛肩里肌火鍋肉片1盒（已發還）而查獲。\r\n二、案經蔣雅玲訴由臺中市政府警察局太平分局報告偵辦。\r\n　　　　證據並所犯法條\r\n一、上揭犯罪事實，業據被告魏柏章於警詢時及偵查中坦承不諱\r\n，核與告訴人蔣雅玲於警詢中之指訴情節相符，復有員警職\r\n務報告、臺中市政府警察局太平分局扣押筆錄、扣押物品目\r\n錄表、贓物認領保管單及現場照片9張在卷可佐，足認被告\r\n之自白與事實相符，其犯嫌應堪認定。\r\n二、核被告所為，係犯刑法第320條第1項之竊盜罪嫌。就本案犯\r\n罪所得即豬五花肉條1盒及澳洲牛肩里肌火鍋肉片1盒，因已\r\n實際發還告訴人，爰不聲請宣告沒收，併予敘明。\r\n三、依刑事訴訟法第451條第1項聲請逕以簡易判決處刑。\r\n　　此　致\r\n臺灣臺中地方法院\r\n中　　華　　民　　國　113　　年　　5　　月　　15　　日\r\n　　　　　　　　　　　　　　檢察官　王靖夫\r\n本件正本證明與原本無異\r\n中　　華　　民　　國　113　　年　　5　　月　　16　　日\r\n　　　　　　　　　　　　　　　書　記　官　陳　箴",
  //     defendantName: "魏柏章",
  //     judgeName: "吳孟潔",
  //     law: "刑法第320條第1項;刑法第38條;刑法第320條第1項;刑法第320條;刑法第320條第1項",
  //     caseType: "刑事",
  //     docType: "判決"
  //   },
  // ];
  // =====================================================================================================================================

  // 取得書籤資料
  getBookmarks(): any[] {
    const storedBookmarks = sessionStorage.getItem('myBookmarks');
    return storedBookmarks ? JSON.parse(storedBookmarks) : [];
  }

  // 清除單一書籤
  removeBookmark(bookmarkId: string): void {
    const storedBookmarks = sessionStorage.getItem('myBookmarks');
    let bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];

    // 過濾掉要刪除的書籤
    bookmarks = bookmarks.filter((bookmark: any) => bookmark.id != bookmarkId);
    // 更新 sessionStorage
    sessionStorage.setItem('myBookmarks', JSON.stringify(bookmarks));
    Swal.fire({
      title: '移除書籤成功!',
      icon: 'success',
      confirmButtonText: '確定',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload(); // 在按下「確定」後執行刷新
      }
    });
    
    // console.log('已刪除書籤:', bookmarkId);
  }

  // 清除所有書籤
  clearBookmarks(): void {
    this.sessionServiceService.clearBookmarks();
    this.bookmarks = [];
  }

  // =====================================================================================================================================
  // 取得該email的所有儲存書籤
  getBookmarksApi(email: string) {
    this.http
      .getApi(
        'http://localhost:8080/accountSystem/email-all-bookmark?email=' + email
      )
      .subscribe((res: any) => {
        console.log(res);
      });
  }
  // 取得該email的所有螢光筆書籤
  getHighlightersApi(email: string) {
    this.http
      .getApi(
        'http://localhost:8080/accountSystem/email-all-highlighte?email=' +
          email
      )
      .subscribe((res: any) => {
        // 提取 highlighteList
        const highlighteList = res.highlighteList;

        if (!highlighteList) {
          console.error('No highlighteList found in response:', res);
          return;
        }

        // 轉換資料格式
        const groupedData = highlighteList.reduce((acc: any, item: any) => {
          // 找到對應 groupId 的群組
          let group = acc.find((g: any) => g.groupId === item.group_id);

          // 如果群組不存在，新增一個
          if (!group) {
            group = {
              groupId: item.group_id,
              id: item.id,
              court: item.court,
              content: [],
            };
            acc.push(group);
          }

          // 加入高亮細節到群組的 content
          group.content.push({
            startOffset: item.start_offset,
            endOffset: item.end_offset,
            text: item.Select_text,
            color: item.highlighter_color,
          });

          return acc;
        }, []);

        // 賦值給 apiResponse
        this.apiResponse = groupedData;

        // Debug: 顯示結果
        console.log(this.apiResponse);
      });
  }
}

// 螢光筆書籤假資料

// apiResponse = [
//   {
//     groupId: "113年度中簡字第1265號",
//     id: "113年度中簡字第1265號",
//     court: "TCD",
//     content: [
//       { startOffset: 83, endOffset: 92, text: '列被告因公共危險案', color: 'yellow' },
//       { startOffset: 132, endOffset: 145, text: '中華民國113年7月31日', color: 'lightgreen' },
//     ],
//   },
//   {
//     groupId: "113年度中簡字第1267號",
//     id: "113年度中簡字第1267號",
//     court: "TCD",
//     content: [
//       { startOffset: 200, endOffset: 220, text: '判決中的其他重點部分', color: 'lightblue' },
//     ],
//   },
// ];
