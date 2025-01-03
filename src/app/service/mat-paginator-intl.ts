import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

// 將 mat-table 中的英文切換成中文
@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
  }

  override itemsPerPageLabel = '每頁顯示筆數：';
  override nextPageLabel = '下一頁';
  override previousPageLabel = '上一頁';
  override firstPageLabel = '第一頁';
  override lastPageLabel = '最後一頁';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `第 0 筆，共 ${length} 筆`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;
    return `第 ${startIndex + 1} - ${endIndex} 筆，共 ${length} 筆`;
  };
}
