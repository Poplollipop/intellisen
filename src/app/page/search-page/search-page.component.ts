import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectItemGroup } from 'primeng/api';
import { DatePicker } from 'primeng/datepicker';


@Component({
  selector: 'app-search-page',
  imports: [
    MatIconModule,
    MatExpansionModule,
    AccordionModule,
    AvatarModule,
    BadgeModule,
    InputTextModule,
    FormsModule,
    MultiSelectModule,
    DatePicker,

  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {

  readonly panelOpenState = signal(false);

  selectedButton: string | null = null;
  value: string | undefined;
  startDate: Date[] | undefined;
  endDate: Date[] | undefined;
  year: Date[] | undefined;


  toggleButton(buttonType: string): void {
    this.selectedButton = this.selectedButton == buttonType ? null : buttonType;
  }

  groupedCities!: SelectItemGroup[];
  selectedCities!: Cities[];

  constructor() {
      this.groupedCities = [
          {
              label: '北部',
              value: 'N',
              items: [
                  { label: '臺灣臺北地方法院', value: 'SL' },
                  { label: '臺灣新北地方法院', value: 'Frankfurt' },
                  { label: '臺灣士林地方法院', value: 'Hamburg' },
                  { label: '臺灣桃園地方法院', value: 'Munich' },
                  { label: '臺灣桃園地方法院', value: 'Munich' },
                  { label: '臺灣基隆地方法院', value: 'Munich' },

              ]
          },
          {
              label: '中部',
              value: 'M',
              items: [
                  { label: '臺灣苗栗地方法院', value: 'Chicago' },
                  { label: '臺灣臺中地方法院', value: 'Los Angeles' },
                  { label: '臺灣南投地方法院', value: 'New York' },
                  { label: '臺灣彰化地方法院', value: 'San Francisco' },
                  { label: '臺灣雲林地方法院', value: 'San Francisco' },
              ]
          },
          {
              label: '南部',
              value: 'S',
              items: [
                  { label: '臺灣嘉義地方法院', value: 'Kyoto' },
                  { label: '臺灣臺南地方法院', value: 'Osaka' },
                  { label: '臺灣橋頭地方法院', value: 'Tokyo' },
                  { label: '臺灣高雄地方法院', value: 'Yokohama' },
                  { label: '臺灣高雄地方法院', value: 'Yokohama' },
                  { label: '臺灣屏東地方法院', value: 'Yokohama' },
              ]
          },
          {
            label: '東部',
            value: 'E',
            items: [
                { label: '臺灣臺東地方法院', value: 'Kyoto' },
                { label: '臺灣花蓮地方法院', value: 'Osaka' },
                { label: '臺灣宜蘭地方法院', value: 'Tokyo' },
            ]
          },
          {
            label: '離島',
            value: 'O',
            items: [
                { label: '臺灣澎湖地方法院', value: 'Kyoto' },
                { label: '福建連江地方法院', value: 'Osaka' },
                { label: '福建金門地方法院', value: 'Tokyo' },
            ]
          },
      ];
  }

  test(){
    console.log(this.selectedCities)
  }



}

interface Cities {
  name: string,
  code: string
}


