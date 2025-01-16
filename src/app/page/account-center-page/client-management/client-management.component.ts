import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-client-management',
  imports: [
    CommonModule,
    PaginatorModule
  ],
  templateUrl: './client-management.component.html',
  styleUrl: './client-management.component.scss'
})
export class ClientManagementComponent {
  ngOnInit(): void {
    this.totalRecords = this.clients.length; // 初始化總筆數
    this.updateVisibleCases(); // 初始化顯示的資料
  }

  clients = [
    { id: 1, type:'個人', name: '王大明', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 8, status: '已結案'},
    { id: 2, type:'企業', name: '王大湳', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 2, status: '進行中'},
    { id: 3, type:'個人', name: '王大梅', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 6, status: '未聯絡'},
    { id: 4, type:'企業', name: '王大立', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 9, status: '已聯絡'},
    { id: 5, type:'企業', name: '王大千', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 8, status: '進行中'},
    { id: 6, type:'個人', name: '王大至', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 5, status: '已結案'}
  ];

  // 頁籤
  itemsPerPage: number = 10; // 每頁顯示的筆數
  totalRecords: number = 0; // 總筆數
  first: number = 0; // 當前的起始那一筆的索引
  visibleCases: any[] = []; // 當前頁面顯示的案件數據

  onPageChange(event: any): void {
    this.first = event.first; // 更新起始那一筆的索引
    this.itemsPerPage = event.rows; // 更新每頁筆數
    this.updateVisibleCases(); // 更新顯示的筆數
  }

  // 更新顯示資料
  updateVisibleCases(): void {
    const start = this.first;   // 更新起始的那一筆的 index
    const end = this.first + this.itemsPerPage;   // 更新結束的那一筆的 index
    this.visibleCases = this.clients.slice(start, end);    // 只取該頁要顯示的筆數的 index
  }
  
}
