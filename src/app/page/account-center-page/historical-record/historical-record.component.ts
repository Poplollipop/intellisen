import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { SessionServiceService } from '../../../service/session-service.service';

@Component({
  selector: 'app-historical-record',
  imports: [],
  templateUrl: './historical-record.component.html',
  styleUrl: './historical-record.component.scss'
})
export class HistoricalRecordComponent {

  private readonly platformId = inject(PLATFORM_ID); // 確保程式碼在瀏覽器上執行

  historicalRecord: Array<{
    id: string, groupId: string, court: string,
    year: number, month: number, date: number
  }> = new Array();// 觀看紀錄列表


  constructor(
    private router: Router,
    private sessionServiceService : SessionServiceService,
  ) { }

  ngOnInit(): void {
    // 確保程式碼在瀏覽器上執行
    if (isPlatformBrowser(this.platformId)) {
      // 從localStorage取得觀看紀錄
      const record = localStorage.getItem('historicalRecord_' + sessionStorage.getItem('email'))

      // 判斷有沒有觀看紀錄,有就轉成類別，沒有就為空陣列
      this.historicalRecord = record ? JSON.parse(record) : new Array();
    }

  }

  // 觀看全文
  checkContent(groupId: string, id: string, court: string) {
    // 將網址與案件 id 綁在一起
    this.router.navigateByUrl('full-text/' + groupId + '&id=' + id + '&court=' + court);
    this.sessionServiceService.url = this.router.url;
  }

}
