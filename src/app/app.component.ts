import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "./layouts/toolbar/toolbar.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SelectedCourtComponent } from './component/selected-court/selected-court.component';
import { SelectLawComponent } from './component/select-law/select-law.component';
import { SelectedCriteria, SessionServiceService } from './service/session-service.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToolbarComponent,
    MatDialogModule,
    MatButtonModule,
    NgxUiLoaderModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  // 已選擇的項目
  selectedCourts: string[] = [];
  selectedLaws: string[] = [];
  selectedCase: string = '';
  startYear: string = '89';
  endYear: string = '89';

  constructor(
    private dialog: MatDialog,
    private sessionService: SessionServiceService
  ) { }


  openSelectCourtDialog() {
    const dialogRef = this.dialog.open(SelectedCourtComponent, {
      width: '600px',
      height: '600px',
    });

    // 接收返回的資料
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // 將選中的項目轉為陣列，並儲存
        this.selectedCourts = Object.keys(result).filter(
          (key) => result[key]
        );
      }
    });
  }


  openSelectLawDialog() {
    const dialogRef = this.dialog.open(SelectLawComponent, {
      width: '600px',
      height: '600px',
    });

    // 接收返回的資料
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // 將選中的項目轉為陣列，並儲存
        this.selectedLaws = Object.keys(result).filter(
          (key) => result[key]
        );
      }
    });
  }

  // 移除指定索引的法院
  removeCourt(index: number) {
    this.selectedCourts.splice(index, 1);
  }

  // 移除指定索引的法條
  removeLaw(index: number) {
    this.selectedLaws.splice(index, 1);
  }

  // 確認並存入 Service
  confirmSelection() {
    const criteria: SelectedCriteria = {
      courts: this.selectedCourts,
      laws: this.selectedLaws,
      startYear: this.startYear,
      endYear: this.endYear,
      case: this.selectedCase,
    };
    this.sessionService.setCriteria(criteria);
    console.log('已存入 Service:', criteria);
    // 接著導向下一頁
  }

}
