import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogClose, MatDialogContent, MatDialogActions, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-select-law',
  imports: [
    MatToolbar,
    MatFormFieldModule,
    MatToolbarModule,
    MatIcon,
    MatIconButton,
    MatDialogClose,
    MatDialogContent,
    MatDialogModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatButton,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select-law.component.html',
  styleUrl: './select-law.component.scss'
})

export class SelectLawComponent {
  constructor(
    public dialog: MatDialogRef<SelectLawComponent>,
    private ngxService: NgxUiLoaderService,
  ) { }

  private readonly fb = inject(FormBuilder);
  // 接收用戶選擇的法律類型
  readonly selectedCase = inject<string>(MAT_DIALOG_DATA);

  low = {
    // 殺人罪
    murder: [
      { name: "刑法第271條:普通殺人罪", selected: false },
      { name: "刑法第272條:殺直系血親尊親屬罪", selected: false },
      { name: "刑法第273條:義憤殺人罪", selected: false },
      { name: "刑法第274條:母殺嬰兒罪", selected: false },
      { name: "刑法第275條:加工自殺罪", selected: false },
      { name: "刑法第276條:過失致死罪", selected: false },
    ],
    // 搶奪暨強盜
    robbery: [
      { name: "刑法第320條:普通竊盜罪", selected: false },
      { name: "刑法第321條:加重竊盜罪", selected: false },
      { name: "刑法第325條:普通搶奪罪", selected: false },
      { name: "刑法第326條:加重搶奪罪", selected: false },
      { name: "刑法第328條:普通強盜罪", selected: false },
      { name: "刑法第329條:準強盜罪", selected: false },
      { name: "刑法第330條:加重強盜罪", selected: false },
      { name: "刑法第332條:強盜結合罪", selected: false },
    ],
    // 傷害罪
    injury: [
      { name: "刑法第277條:普通傷害罪", selected: false },
      { name: "刑法第278條:重傷罪", selected: false },
      { name: "刑法第279條:義憤傷害罪", selected: false },
      { name: "刑法第280條:傷害直系血親尊親屬罪", selected: false },
      { name: "刑法第281條:加暴行於直系血親尊親屬罪", selected: false },
      { name: "刑法第282條:加工自傷罪", selected: false },

    ],
    // 不能安全駕駛案件
    drive: [
      { name: "刑法第185條:妨害公眾往來安全罪", selected: false },
      { name: "刑法第185條之3第1項:不能安全駕駛罪", selected: false },
      { name: "刑法第185條之3第2項前段:致人於死", selected: false },
      { name: "刑法第185條之3第2項後段:致人於重傷", selected: false },
      { name: "刑法第185條之3第3項後段:致人於死", selected: false },
      { name: "刑法第185條之3第3項後段:致人於重傷", selected: false },
    ],
    // 肇事逃逸
    escape: [
      { name: "刑法第185條之4:肇事逃逸罪", selected: false },
      { name: "刑法第185條之4第1項前段:致人傷害而逃逸", selected: false },
      { name: "刑法第185條之4第1項後段:致人於死或重傷而逃逸", selected: false },
    ],
    // 詐欺
    fraud: [
      { name: "刑法第30條、刑法第339條第1項:幫助詐欺罪", selected: false },
      { name: "刑法第339條:詐欺罪", selected: false },
      { name: "刑法第339條之2:違法由自動付款設備取得他人之物之處罰", selected: false },
      { name: "刑法第339條之4第1項:加重詐欺罪", selected: false },
      { name: "刑法第339條之4第2項:加重詐欺未遂罪", selected: false },
    ],
    // 竊盜
    theft: [
      { name: "刑法第320條:竊盜罪", selected: false },
      { name: "刑法第321條:加重竊盜罪", selected: false },
      { name: "森林法第50條:竊取森林主、副產物罪", selected: false },
      { name: "森林法第52條:加重竊取森林主、副產物罪", selected: false },
      { name: "電業法第105條:供電設備之竊盜", selected: false },
      { name: "電業法第106條:竊電", selected: false },
      { name: "自來水法第98條:竊水", selected: false },
      { name: "電信法第56條:盜接或盜用電信設備罪", selected: false },
      { name: "陸海空軍刑法第76條第1項第8款:在營區、艦艇或其他軍事處所、建築物所犯之竊盜罪", selected: false },
    ],
    //毒品
    drug: [
      { name: "毒品危害防制條例第4條:製造、運輸、販賣毒品罪", selected: false },
      { name: "毒品危害防制條例第5條:意圖販賣而持有毒品罪", selected: false },
      { name: "毒品危害防制條例第6條:以強迫或欺瞞使人施用毒品罪", selected: false },
      { name: "毒品危害防制條例第7條:引誘他人施用毒品罪", selected: false },
      { name: "毒品危害防制條例第8條:轉讓毒品罪", selected: false },
      { name: "毒品危害防制條例第11條:持有毒品罪", selected: false },
      { name: "毒品危害防制條例第12條:栽種罌粟、古柯、大麻罪", selected: false },
      { name: "藥事法第83條第1項:轉讓禁藥罪", selected: false },
    ],
    // 槍砲
    gun: [
      { name: "槍砲彈藥刀械管制條例第7條:關於重型槍砲之罪", selected: false },
      { name: "槍砲彈藥刀械管制條例第8條:關於輕型槍砲之罪", selected: false },
      { name: "槍砲彈藥刀械管制條例第9條:關於魚槍之罪", selected: false },
      { name: "槍砲彈藥刀械管制條例第12條:關於子彈之罪", selected: false },
      { name: "槍砲彈藥刀械管制條例第13條:關於槍砲彈藥之主要組成零件之罪", selected: false },
      { name: "槍砲彈藥刀械管制條例第14條:關於刀械之罪", selected: false },
      { name: "槍砲彈藥刀械管制條例第15條:未經許可攜帶刀械", selected: false },
    ],
    // 性侵
    sexual_assault: [
      { name: "刑法第221條第1項:強制性交罪", selected: false },
      { name: "刑法第224條:強制猥褻罪", selected: false },
      { name: "刑法第225條:乘機性交猥褻罪", selected: false },
      { name: "刑法第226條:強制性交猥褻罪之加重結果犯", selected: false },
      { name: "刑法第228條:利用權勢性交或猥褻罪", selected: false },
      { name: "刑法第229條第1項:詐術性交罪", selected: false },
      { name: "刑法第348條第2項第1款:擄人勒贖罪而強制性交罪", selected: false },
    ]
  }

  submit() {
    this.dialog.close(this.low);
  }

}
