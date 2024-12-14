import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogClose, MatDialogContent, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
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
    ReactiveFormsModule,
    MatDialogActions,
    MatButton,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select-law.component.html',
  styleUrl: './select-law.component.scss'
})
export class SelectLawComponent {
  submit() {
    throw new Error('Method not implemented.');
  }
  private readonly fb = inject(FormBuilder);

  constructor(
    public dialog: MatDialogRef<SelectLawComponent>,
    private ngxService: NgxUiLoaderService,
  ) { }

  selectLawform: any = FormGroup;
  readonly toppings = this.fb.group({
    pepperoni: false,
    extracheese: false,
    mushroom: false,
  });

}
