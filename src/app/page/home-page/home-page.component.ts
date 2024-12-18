import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { SelectedData, SessionServiceService } from '../../service/session-service.service';
import { Router } from '@angular/router';
import { SelectedCourtComponent } from '../../component/selected-court/selected-court.component';
import { SelectLawComponent } from '../../component/select-law/select-law.component';
import { log } from 'node:console';

@Component({
  selector: 'app-home-page',
  imports: [
    MatDialogModule,
    MatButtonModule,
    NgxUiLoaderModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  constructor(
    private dialog: MatDialog,
    private sessionService: SessionServiceService,
    private router: Router,
  ) { }

  // 已選擇的項目
  selectedCourts: string[] = [];
  selectedLaws: string[] = [];
  selectedCase: string = '';
  startYear: string = '';
  endYear: string = '';

  ngOnInit(): void {
    if(this.sessionService.getData()){
      const sessionData = this.sessionService.getData();
      this.selectedCourts = sessionData.courts;
      this.selectedLaws = sessionData.laws;
      this.selectedCase = sessionData.case;
      this.startYear = sessionData.startYear;
      this.endYear = sessionData.endYear;
    }

  }

  openSelectCourtDialog() {
    const dialogRef = this.dialog.open(SelectedCourtComponent, {
      width: '60vw',
      height: '75vh',
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

  // 將法院代碼換成法院名稱
  turnCodeToName(code: string) {
    return this.sessionService.turnCodeToName(code);
  }


  openSelectLawDialog() {
    const dialogRef = this.dialog.open(SelectLawComponent, {
      width: '60vw',
      height: '75vh',
      // 發送用戶選擇的法律類型給 dialog
      data: this.selectedCase,
    });

    // 接收返回的資料
    dialogRef.afterClosed().subscribe((result) => {
     console.log(result)
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

  // 清空條件方法
  clearSelection() {
    this.startYear = '';     // 重置年份
    this.endYear = '';       // 重置年份
    this.selectedCase = '';    // 重置案件選擇
    this.selectedCourts = [];  // 清空法院
    this.selectedLaws = [];    // 清空法條
    this.sessionService.clearData(); //清空 sessionService
  }


  // 確認並存入 Service
  confirmSelection() {
    const criteria: SelectedData = {
      courts: this.selectedCourts,
      laws: this.selectedLaws,
      startYear: this.startYear,
      endYear: this.endYear,
      case: this.selectedCase,
    };
    this.sessionService.setData(criteria);
    console.log('已存入 Service:', criteria);
    this.router.navigate(['/result']);
    // 接著導向下一頁
  }
}
