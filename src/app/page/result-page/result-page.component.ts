import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolbarComponent } from '../../layouts/toolbar/toolbar.component';
import { SelectedData, SessionServiceService } from '../../service/session-service.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { CaseViewComponent } from '../../component/case-view/case-view.component';
import { Router } from '@angular/router';




declare var bootstrap: any;   // 引入 Bootstrap 類別


@Component({
  selector: 'app-result-page',
  imports: [
    MatTooltipModule,
    ToolbarComponent,
    CommonModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './result-page.component.html',
  styleUrl: './result-page.component.scss'
})

export class ResultPageComponent {

  // 初始化
  data: SelectedData = {
    courts: [],
    laws: [],
    startYear: '',
    endYear: '',
    case: '',
  };

  advancedOptions: string[] = ['緩刑', '加重減輕', '犯罪情節', '犯罪動機', '前案紀錄', '犯後態度'];
  selectedOptions: Set<string> = new Set();   // 用於標記模態框中已選中的選項
  appliedOptions: string[] = [];   // 用於顯示已套用的選項

  // 表格的動態數據，這裡的數據可以從 API 獲取
  items = [
    {
      type: '死刑',
      count: 3,
      min: '',
      max: '',
      avg: ''
    },
    {
      type: '有期徒刑',
      count: 30,
      min: '1年',
      max: '10年',
      avg: '5年'
    },
    {
      type: '無期徒刑',
      count: 40,
      min: '',
      max: '',
      avg: ''
    }
  ];


  constructor(
    private sessionService: SessionServiceService,
    public dialog: MatDialog,
    private router: Router,
  ) { }



  ngOnInit(): void {
    this.data = this.sessionService.getData();
  }

  removeCourt(index: number): void {
    this.data.courts.splice(index, 1);
  }

  removeLaw(index: number): void {
    this.data.laws.splice(index, 1);
  }

  // 將法院代碼換成法院名稱
  turn_code_to_name(code: string) {
    return this.sessionService.turn_code_to_name(code);
  }

  // 刪除已選擇的篩選條件
  removeOption(index: number): void {
    // 從 appliedOptions 中刪除該選項
    if (index > -1) {
      const option = this.appliedOptions[index]; // 獲取該選項
      this.appliedOptions.splice(index, 1); // 從 appliedOptions 中刪除該選項
      this.selectedOptions.delete(option); // 同時從 selectedOptions 中刪
    }
  }


  // 開啟 Modal
  openModal(): void {
    const modal = new bootstrap.Modal(document.getElementById('advancedFilterModal'));
    modal.show();
  }

  // 切換選項狀態
  toggleOption(option: string): void {
    if (this.selectedOptions.has(option)) {
      // 如果該選項已經選中，則取消選擇
      this.selectedOptions.delete(option);
    } else {
      // 如果該選項尚未選中，則新增到選擇清單中
      this.selectedOptions.add(option);
    }
  }

  // 檢查選項是否已選擇 (模態框中的選項)
  isSelected(option: string): boolean {
    return this.selectedOptions.has(option);
  }

  applyFilters(): void {
    // 將 selectedOptions 轉換成陣列，並顯示在畫面上
    this.appliedOptions = Array.from(this.selectedOptions);
  }




  // 圖表區


  Highcharts: typeof Highcharts = Highcharts; // Highcharts 實例
  chart: Highcharts.Chart | undefined; // 儲存圖表實例
  chartType: string = 'pie'; // 預設圖表類型

  // 假資料
  chartData = {
    pie: {
      type: 'pie',
      title: '刑種全貌圖',
      series: [
        { name: '有期徒刑', y: 45 },
        { name: '無期徒刑', y: 25 },
        { name: '罰金', y: 20 },
        { name: '其他', y: 10 }
      ]
    },
    bar: {
      type: 'column',
      title: '刑度年度統計圖',
      categories: ['90', '91', '92', '93'],
      series: [
        {
          name: '刑度',
          data: [20, 35, 10, 20]
        }
      ]
    }
  };

  // 新增配色變數
  colorPalette = {
    pie: ['#8157C3', '#4CAF50', '#FFCE56', '#36A2EB'], // 圓餅圖顏色
    bar: ['#6A1B9A', '#9C27B0', '#CE93D8', '#BA68C8'] // 長條圖顏色
  };

  // 初始化圖表
  ngAfterViewInit(): void {
    this.renderChart('pie');
  }

  // 渲染圖表
  renderChart(type: 'pie' | 'bar'): void {
    this.chartType = type;

    // 清除舊圖表
    if (this.chart) {
      this.chart.destroy();
    }

    const chartContainer = document.getElementById('chartContainer') as HTMLElement;

    // 設定新的圖表
    this.chart = Highcharts.chart(chartContainer, {
      chart: {
        type: this.chartData[type].type,
        backgroundColor: undefined // 設定背景顏色為透明
      },
      title: {
        text: this.chartData[type].title
      },
      credits: {
        enabled: false // 禁用右下角的 Highcharts.com
      },
      xAxis: type == 'bar' ? { categories: this.chartData.bar.categories, title: { text: '年度' } } : undefined,
      yAxis: type == 'bar' ? { title: { text: '數量' } } : undefined,
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true, // 啟用標籤
            style: {
              color: '#000000', // 設定標籤顏色為黑色
              fontSize: '14px', // 設定字體大小
              fontWeight: 'bold' // 字體加粗
            },
            formatter: function () {
              return this.name || this.y; // 顯示標籤文字或數值
            }
          }
        }
      },
      series: [
        {
          type: this.chartData[type].type,
          name: this.chartData[type].type === 'pie' ? '比例' : this.chartData.bar.series[0].name,
          data: this.chartData[type].type === 'pie'
            ? this.chartData.pie.series.map((item, index) => ({
              name: item.name,
              y: item.y,
              color: this.colorPalette.pie[index] // 套用圓餅圖顏色
            }))
            : this.chartData.bar.series[0].data.map((value, index) => ({
              y: value,
              color: this.colorPalette.bar[index] // 套用長條圖顏色
            }))
        } as Highcharts.SeriesOptionsType
      ],
    });
  }


  // 件數跳出dialog
  // 開啟Dialog，並將「件數」作為參數傳遞
  openDialog(count: number): void {
    const dialogRef = this.dialog.open(CaseViewComponent, {
      maxWidth: '100vw',
      height: '70vh',
      width: '400px',
      data: { count: count } // 傳入該行的件數
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }
  backToHome(){
    this.router.navigateByUrl('/home')
  }
}






