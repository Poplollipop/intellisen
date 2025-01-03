import { SearchSessionService } from './../../../service/search-session.service';
import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CaseViewComponent } from '../../../component/case-view/case-view.component';
import { MatDialog } from '@angular/material/dialog';
import { HighchartsChartModule } from 'highcharts-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-case-details',
  imports: [
    HighchartsChartModule,
  ],
  templateUrl: './case-details.component.html',
  styleUrl: './case-details.component.scss'
})

export class CaseDetailsComponent {

  @Input() caseId!: string;
  @Input() showCaseDetail: boolean = false;
  displayData: any;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};  // 圖表配置

  constructor(
    private searchSessionService: SearchSessionService,
    public dialog: MatDialog,
    private router : Router,
  ) {
    this.updateChartOptions('pie');
   }

  ngOnChanges() {
    // 當 caseId 變更時更新資料
    this.displayCase();
    // 切換
    this.showCaseDetail;
  }

  displayCase() {
    if (this.caseId) {
      this.displayData = this.searchSessionService.tidyMap[this.caseId]
      this.searchSessionService.singleCaseDate = this.displayData
    }
  }

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

  // 查看全文
  viewFullText(){
    this.router.navigateByUrl('full-text');
  }

  // 圖表區

  // // 假資料
  // chartData = {
  //   pie: {
  //     type: 'pie',
  //     title: '刑種全貌圖',
  //     series: [
  //       { name: '有期徒刑', y: 45 },
  //       { name: '無期徒刑', y: 25 },
  //       { name: '罰金', y: 20 },
  //       { name: '其他', y: 10 }
  //     ]
  //   },
  //   bar: {
  //     type: 'column',
  //     title: '刑度年度統計圖',
  //     categories: ['90', '91', '92', '93'],
  //     series: [
  //       {
  //         name: '件數',
  //         data: [20, 35, 10, 20]
  //       }
  //     ]
  //   }
  // };

  // // 新增配色變數
  // colorPalette = {
  //   pie: ['#8157C3', '#4CAF50', '#FFCE56', '#36A2EB'], // 圓餅圖顏色
  //   bar: ['#6A1B9A', '#9C27B0', '#CE93D8', '#BA68C8'] // 長條圖顏色
  // };



  // // 渲染圖表
  // renderChart(type: 'pie' | 'bar'): void {
  //   const chartContainer = document.getElementById('chartContainer1') as HTMLElement;
  //   this.chartType = type;

  //   // 清除舊圖表
  //   if (this.chart) {
  //     this.chart.destroy();
  //   }

  //   console.log(chartContainer);  // 確保 chartContainer 正常獲取

  //   // 設定新的圖表
  //   this.chart = Highcharts.chart(chartContainer, {
  //     chart: {
  //       type: this.chartData[type].type,
  //       backgroundColor: undefined // 設定背景顏色為透明
  //     },
  //     title: {
  //       text: this.chartData[type].title
  //     },
  //     credits: {
  //       enabled: false // 禁用右下角的 Highcharts.com
  //     },
  //     legend: {
  //       enabled: false // 禁用圖例
  //     },
  //     accessibility: {
  //       enabled: false // 進用輔助
  //     },
  //     xAxis: type == 'bar' ? { categories: this.chartData.bar.categories, title: { text: '年度' } } : undefined,
  //     yAxis: type == 'bar' ? { title: { text: '數量' } } : undefined,
  //     plotOptions: {
  //       series: {
  //         dataLabels: {
  //           enabled: true, // 啟用標籤
  //           style: {
  //             color: '#000000', // 設定標籤顏色為黑色
  //             fontSize: '16px', // 設定字體大小
  //             fontWeight: 'bold' // 字體加粗
  //           },
  //           formatter: function () {
  //             return this.name || this.y; // 顯示標籤文字或數值
  //           }
  //         }
  //       }
  //     },
  //     series: [
  //       {
  //         type: this.chartData[type].type,
  //         name: this.chartData[type].type === 'pie' ? '比例' : this.chartData.bar.series[0].name,
  //         data: this.chartData[type].type === 'pie'
  //           ? this.chartData.pie.series.map((item, index) => ({
  //             name: item.name,
  //             y: item.y,
  //             color: this.colorPalette.pie[index] // 套用圓餅圖顏色
  //           }))
  //           : this.chartData.bar.series[0].data.map((value, index) => ({
  //             y: value,
  //             color: this.colorPalette.bar[index] // 套用長條圖顏色
  //           }))
  //       } as Highcharts.SeriesOptionsType
  //     ],
  //   });
  // }

  updateChartOptions(type: 'pie' | 'bar') {
    if (type == 'pie') {
      this.chartOptions = {
        chart: {
          type: 'pie',
          backgroundColor: undefined    // 設定背景顏色為透明
        },
        title: {
          text: '刑種全貌圖',
        },
        legend: {
          enabled: false    // 禁用圖例
        },
        accessibility: {
          enabled: false,
        },
        credits: {
          enabled: false    // 禁用右下角的 Highcharts.com
        },
        xAxis: {
          categories: undefined,
          title: undefined,
          lineWidth: 0,     // 隱藏 x 軸線
        },
        yAxis: {
          title: undefined,
        },
        series: [
          {
            type: 'pie',
            name: '比例',
            data: [
              { name: '有期徒刑', y: 45 },
              { name: '無期徒刑', y: 25 },
              { name: '罰金', y: 20 },
              { name: '其他', y: 10 },
            ],
          },
        ],
      };
    } if (type == 'bar') {
      this.chartOptions = {
        chart: {
          type: 'column',
          backgroundColor: undefined    // 設定背景顏色為透明
        },
        title: {
          text: '刑度年度統計圖',
        },
        accessibility: {
          enabled: false,
        },
        legend: {
          enabled: false // 禁用圖例
        },
        xAxis: {
          categories: ['90', '91', '92', '93'],
          title: { text: '年度' },
        },
        yAxis: {
          title: { text: '數量' },
        },
        series: [
          {
            type: 'column',
            name: '件數',
            data: [20, 35, 10, 20],
          },
        ],
      };
    }
  }

  renderChart(type: 'pie' | 'bar') {

    console.log(this.chartOptions.chart)

    // 更新圖表
    this.updateChartOptions(type);

    // 強制觸發 Angular 變更檢測
    this.chartOptions = { ...this.chartOptions };

  }


  // 件數跳出dialog
  // 開啟Dialog，並將「件數」作為參數傳遞
  openDialog(count: number): void {
    const dialogRef = this.dialog.open(CaseViewComponent, {
      maxWidth: '100vw',
      height: '80%',
      width: '80%',
      data: { count: count } // 傳入該行的件數
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }


}
