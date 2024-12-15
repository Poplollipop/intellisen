import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogClose, MatDialogContent, MatDialogActions, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
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

  constructor(
    public dialog: MatDialogRef<SelectLawComponent>,
    private ngxService: NgxUiLoaderService,
  ) {}

  selectLawform: FormGroup = this.fb.group({
    toppings: this.fb.group({
      pepperoni: [false],
      extracheese: [false],
      mushroom: [false],
    }),
  });

  submit() {
    console.log(this.selectLawform.value.toppings); // 印出選中的 checkbox 值
    this.dialog.close(this.selectLawform.value.toppings); // 返回選中的值並關閉 dialog
  }

}
