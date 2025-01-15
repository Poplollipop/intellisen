import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-management-page',
  imports: [
    CommonModule
  ],
  templateUrl: './management-page.component.html',
  styleUrl: './management-page.component.scss'
})
export class ManagementPageComponent {

  members = [
    { name: '王大明', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 8, clients: 8, status: '已結案'},
    { name: '王大湳', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 2, clients: 2, status: '進行中'},
    { name: '王大梅', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 6, clients: 6, status: '未聯絡'},
    { name: '王大立', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 9, clients: 9, status: '已聯絡'},
    { name: '王大千', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 8, clients: 8, status: '進行中'},
    { name: '王大至', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 5, clients: 5, status: '已結案'}
  ];
  
}
