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
import { CommonModule } from '@angular/common';
import Swal from "sweetalert2";

@Component({
  selector: 'app-home-page',
  imports: [
    MatDialogModule,
    MatButtonModule,
    NgxUiLoaderModule,
    MatTooltipModule,
    FormsModule,
    CommonModule,
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
  startYear: string = '89';
  endYear: string = '113';


  ngOnInit(): void {
    // 導入數據
    const sessionData = this.sessionService.getData();
    this.selectedCourts = sessionData.courts;
    this.selectedLaws = sessionData.laws;
    this.selectedCase = sessionData.case;
    this.startYear = sessionData.startYear;
    this.endYear = sessionData.endYear;
  }

  // 選擇法院
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

  // 確認在開啟法條的 dialog 前是否有選擇案件
  checkCaseSlected(): boolean {
    if (this.selectedCase === '') {
      return true;
    } else {
      return false;
    }
  }

  // 開啟選擇法條的 dialog
  openSelectLawDialog() {
    if (this.checkCaseSlected()) {
      Swal.fire({
        icon: "info",
        title: "<strong>請先選擇案件</strong>",
        showCloseButton: false,
        confirmButtonText: "確認"
      });
      return;
    }
    const dialogRef = this.dialog.open(SelectLawComponent, {
      width: '60vw',
      height: '75vh',
      // 發送用戶選擇的法律類型給 dialog
      data: this.selectedCase,
    });

    // 接收返回的資料
    dialogRef.afterClosed().subscribe((selectedLaws: string[]) => {
      this.selectedLaws = selectedLaws
    });
  }

  // 當開始年變更時的事件處理
  onStartYearChange(event: Event): void {
    const newStartYear = (event.target as HTMLSelectElement).value; // 取得新值
    if (parseInt(newStartYear) > parseInt(this.endYear)) {
      (event.target as HTMLSelectElement).value = this.startYear; // 恢復成舊的值
      Swal.fire({
        icon: "info",
        title: "<strong>開始年份需早於結束年份</strong>",
        showCloseButton: false,
        confirmButtonText: "確認"
      });
    } else {
      this.startYear = newStartYear; // 更新開始年
    }
  }

  // 當結束年變更時的事件處理
  onEndYearChange(event: Event): void {
    const newEndYear = (event.target as HTMLSelectElement).value; // 取得新值
    if (parseInt(newEndYear) < parseInt(this.startYear)) {
      (event.target as HTMLSelectElement).value = this.endYear; // 恢復成舊的值
      Swal.fire({
        icon: "info",
        title: "<strong>結束年份需晚於開始年份</strong>",
        showCloseButton: false,
        confirmButtonText: "確認"
      });
    } else {
      this.endYear = newEndYear; // 更新結束年
    }
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
    this.startYear = '89';     // 重置年份
    this.endYear = '113';       // 重置年份
    this.selectedCase = '';    // 重置案件選擇
    this.selectedCourts = [];  // 清空法院
    this.selectedLaws = [];    // 清空法條
    this.sessionService.clearData(); //清空 sessionService
  }

  // 確認並存入 Service
  confirmSelection() {
    if (this.selectedCourts.length === 0) {
      Swal.fire({
        icon: "info",
        title: "<strong>請先選擇法院</strong>",
        showCloseButton: false,
        confirmButtonText: "確認"
      });
      return;
    }
    if (this.selectedCase === '') {
      Swal.fire({
        icon: "info",
        title: "<strong>請先選擇案件和法條</strong>",
        showCloseButton: false,
        confirmButtonText: "確認"
      });
      return;
    }

    if (this.selectedLaws.length === 0) {
      Swal.fire({
        icon: "info",
        title: "<strong>請先選擇法條</strong>",
        showCloseButton: false,
        confirmButtonText: "確認"
      });
      return;
    }
    const criteria: SelectedData = {
      courts: this.selectedCourts,
      laws: this.selectedLaws,
      startYear: this.startYear,
      endYear: this.endYear,
      case: this.selectedCase,
    };
    this.sessionService.setData(criteria);
    // 接著導向下一頁
    this.router.navigate(['/result']);
  }
}
