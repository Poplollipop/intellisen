import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-case-view',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //顯示頁數、將預設顯示的英文更改成中文
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = "顯示筆數:";
    this.dataSource.paginator._intl.firstPageLabel = "第一頁:";
    this.dataSource.paginator._intl.previousPageLabel = "上一頁";
    this.dataSource.paginator._intl.nextPageLabel = "下一頁";
    this.dataSource.paginator._intl.lastPageLabel = "最後一頁";
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

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
  { id: '112年度訴字第123號刑事判決', verdictYear: '112', charge: '傷害', judge: '李大明', lawyer: '陳小明', url:'http://...' },
  { id: '112年度訴字第151號刑事判決', verdictYear: '112', charge: '竊盜', judge: '王曉明', lawyer: '陳大明', url:'http://...' },
  { id: '112年度訴字第126號刑事判決', verdictYear: '111', charge: '竊盜', judge: '王曉明', lawyer: '陳大明', url:'http://...' },
  { id: '112年度訴字第152號刑事判決', verdictYear: '111', charge: '竊盜', judge: '王曉明', lawyer: '陳大明', url:'http://...' },
  { id: '112年度訴字第157號刑事判決', verdictYear: '110', charge: '竊盜', judge: '王曉明', lawyer: '陳大明', url:'http://...' },
  { id: '112年度訴字第142號刑事判決', verdictYear: '109', charge: '竊盜', judge: '王曉明', lawyer: '陳大明', url:'http://...' },
  { id: '112年度訴字第18號刑事判決', verdictYear: '108', charge: '竊盜', judge: '王曉明', lawyer: '陳大明', url:'http://...' },
  { id: '112年度訴字第12號刑事判決', verdictYear: '107', charge: '竊盜', judge: '王曉明', lawyer: '陳大明', url:'http://...' },
  { id: '112年度訴字第65號刑事判決', verdictYear: '106', charge: '竊盜', judge: '王曉明', lawyer: '陳大明', url:'http://...' },
  { id: '112年度訴字第89號刑事判決', verdictYear: '104', charge: '竊盜', judge: '王曉明', lawyer: '陳大明', url:'http://...' }
];
