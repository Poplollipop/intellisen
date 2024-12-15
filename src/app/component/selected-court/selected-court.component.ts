import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatDialogClose, MatDialogContent, MatDialogActions, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar'
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-selected-court',
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
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selected-court.component.html',
  styleUrl: './selected-court.component.scss'
})

export class SelectedCourtComponent {
  private readonly fb = inject(FormBuilder);

  constructor(
    public dialog: MatDialogRef<SelectedCourtComponent>,
    private ngxService: NgxUiLoaderService,
  ) {}

  selectCourtform: FormGroup = this.fb.group({
    toppings: this.fb.group({
      pepperoni: [false],
      extracheese: [false],
      mushroom: [false],
    }),
  });

  submit() {
    console.log(this.selectCourtform.value.toppings); // 印出選中的 checkbox 值
    this.dialog.close(this.selectCourtform.value.toppings); // 返回選中的值並關閉 dialog
  }


}
