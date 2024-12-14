import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatDialogClose, MatDialogContent, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar'
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { JsonPipe } from '@angular/common';


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
    MatInput,
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
  templateUrl: './selected-court.component.html',
  styleUrl: './selected-court.component.scss'
})
export class SelectedCourtComponent {
  private readonly fb = inject(FormBuilder);

  constructor(
    public dialog: MatDialogRef<SelectedCourtComponent>,
    private ngxService: NgxUiLoaderService,
  ) { }

  selectCourtform: any = FormGroup;
  readonly toppings = this.fb.group({
    pepperoni: false,
    extracheese: false,
    mushroom: false,
  });




  submit() {

  }




}
