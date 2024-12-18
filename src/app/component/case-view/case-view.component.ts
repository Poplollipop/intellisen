import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-case-view',
  imports: [],
  templateUrl: './case-view.component.html',
  styleUrl: './case-view.component.scss'
})
export class CaseViewComponent {

  constructor(
    public dialogRef: MatDialogRef<CaseViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // 接收主元件的數據
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
