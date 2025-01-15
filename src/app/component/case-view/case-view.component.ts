import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-case-view',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './case-view.component.html',
  styleUrl: './case-view.component.scss'
})
export class CaseViewComponent {
  displayedColumns: string[] = ['id', 'verdictYear', 'charge', 'judge', 'lawyer', 'url'];
  dataSource!: MatTableDataSource<caseData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    public dialogRef: MatDialogRef<CaseViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // 接收主元件的數據
  ) {
    this.dataSource = new MatTableDataSource(cases);
  }
  yeardescription: string = '依年度遠到近排序'

  ngAfterViewInit() {
    // 設置排序
    this.dataSource.sort = this.sort;

    // 設置分頁器
    this.dataSource.paginator = this.paginator;
  }
  change(check : boolean){
    if(this.yeardescription == '依年度近到遠排序'){
      check = false
    }
    if(check){
      this.yeardescription = '依年度近到遠排序'
    }else{
      this.yeardescription = '依年度遠到近排序'
    }
  }

  applyFilter(event: Event) {
    // 從事件中獲取過濾條件
    const filterValue = (event.target as HTMLInputElement).value;

    // 設置資料源的過濾條件，將過濾條件轉換為小寫並去掉兩側空格
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // 如果資料源有分頁功能（Paginator），則跳轉到表格的第一頁
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}



export interface caseData {
  id: string;
  verdictYear: string;
  charge: string;
  judge: string;
  lawyer: string;
  url: string;
}

// 有期徒刑案件一覽表
const cases: caseData[] = [
  { id: '111年度原易字第51號刑事判決', verdictYear: '111', charge: '竊盜', judge: '曾耀緯', lawyer: '無', url: 'http://localhost:4200/full-text/111%E5%B9%B4%E5%BA%A6%E5%8E%9F%E6%98%93%E5%AD%97%E7%AC%AC51%E8%99%9F&id%3D111%E5%B9%B4%E5%BA%A6%E5%8E%9F%E6%98%93%E5%AD%97%E7%AC%AC51%E8%99%9F&court%3DTYD' },
  { id: '112年度原易字第103號刑事判決', verdictYear: '112', charge: '竊盜', judge: '曹智恒', lawyer: '阮慶文', url: 'http://localhost:4200/full-text/112%E5%B9%B4%E5%BA%A6%E5%8E%9F%E6%98%93%E5%AD%97%E7%AC%AC103%E8%99%9F&id%3D112%E5%B9%B4%E5%BA%A6%E5%8E%9F%E6%98%93%E5%AD%97%E7%AC%AC103%E8%99%9F&court%3DHLD' },
  { id: '112年度易字第1404號刑事判決', verdictYear: '112', charge: '竊盜', judge: '粘凱庭', lawyer: '無', url: 'http://localhost:4200/full-text/112%E5%B9%B4%E5%BA%A6%E6%98%93%E5%AD%97%E7%AC%AC1404%E8%99%9F&id%3D112%E5%B9%B4%E5%BA%A6%E6%98%93%E5%AD%97%E7%AC%AC1404%E8%99%9F&court%3DPCD' },
  { id: '113年度上易字第58號刑事判決', verdictYear: '113', charge: '竊盜', judge: '陳慧珊', lawyer: '陳浩華', url: 'http://localhost:4200/full-text/113%E5%B9%B4%E5%BA%A6%E4%B8%8A%E6%98%93%E5%AD%97%E7%AC%AC58%E8%99%9F&id%3D113%E5%B9%B4%E5%BA%A6%E4%B8%8A%E6%98%93%E5%AD%97%E7%AC%AC58%E8%99%9F&court%3DTCH' },
  { id: '112年度原易字第38號刑事判決', verdictYear: '112', charge: '竊盜', judge: '李辛茹', lawyer: '楊大維', url: 'http://localhost:4200/full-text/112%E5%B9%B4%E5%BA%A6%E5%8E%9F%E6%98%93%E5%AD%97%E7%AC%AC38%E8%99%9F&id%3D112%E5%B9%B4%E5%BA%A6%E5%8E%9F%E6%98%93%E5%AD%97%E7%AC%AC38%E8%99%9F&court%3DKLD' },
];
