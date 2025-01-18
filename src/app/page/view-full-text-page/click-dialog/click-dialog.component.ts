import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-click-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule
  ],
  templateUrl: './click-dialog.component.html',
  styleUrl: './click-dialog.component.scss'
})
export class ClickDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ClickDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  // 關閉對話框
  closeDialog(): void {
    this.dialogRef.close();
  }
}
