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
  private readonly fb = inject(FormBuilder);
  // 接收用戶選擇的法律類型
  readonly selectedCase = inject<string>(MAT_DIALOG_DATA);
  // 法條
  case = [
    {name: "刑法第271條:普通殺人罪", selected: false},
    {name: "刑法第272條:殺直系血親尊親屬罪", selected: false},
  ];

  constructor(
    public dialog: MatDialogRef<SelectLawComponent>,
    private ngxService: NgxUiLoaderService,
  ) { }

  selectLawform: FormGroup = this.fb.group({
    toppings: this.fb.group({
      case271: false,
      case272: false,
      case273: false,
      case274: false,
      case275: false,
    }),
  });

  submit() {
    console.log(this.selectLawform.value.toppings); // 印出選中的 checkbox 值
    this.dialog.close(this.selectLawform.value.toppings); // 返回選中的值並關閉 dialog
  }

}
