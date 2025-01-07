import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'app-full-text-dialog',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogTitle
  ],
  templateUrl: './full-text-dialog.component.html',
  styleUrl: './full-text-dialog.component.scss'
})
export class FullTextDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FullTextDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // 返回確定操作
  }

  onCancel(): void {
    this.dialogRef.close(false); // 返回取消操作
  }

}
