import { SearchSessionService } from './../../../service/search-session.service';
import { Component, Input } from '@angular/core';
import Highcharts from 'highcharts';

@Component({
  selector: 'app-case-details',
  imports: [],
  templateUrl: './case-details.component.html',
  styleUrl: './case-details.component.scss'
})
export class CaseDetailsComponent {

  @Input() caseId: string | null = null;
  displayData: any;


  constructor(
    private searchSessionService: SearchSessionService
  ) { }

  ngOnInit() {
    // 模擬案件資料查詢
    if (this.caseId) {
      this.displayData = this.searchSessionService.tidyMap[this.caseId]
        // judgeName: this.displayData.judgeName,
        // defendantName: this.displayData.defendantName,
        // charge: this.displayData.charge,
        // verdictDate: this.displayData.verdictDate,
        // court:  this.displayData.court,
        // docType: this.displayData.docType,
        // content: this.displayData.content
      }
    }


  ngOnChanges() {
    // 當 caseId 變更時更新資料
    this.ngOnInit();
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
          name: '件數',
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
      legend: {
        enabled: false // 禁用圖例
      },
      xAxis: type == 'bar' ? { categories: this.chartData.bar.categories, title: { text: '年度' } } : undefined,
      yAxis: type == 'bar' ? { title: { text: '數量' } } : undefined,
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true, // 啟用標籤
            style: {
              color: '#000000', // 設定標籤顏色為黑色
              fontSize: '16px', // 設定字體大小
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





}
