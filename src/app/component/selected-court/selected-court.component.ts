import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatDialogClose, MatDialogContent, MatDialogActions, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar'
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxUiLoaderService } from 'ngx-ui-loader';

enum court_code {
  TPD = "臺灣臺北地方法院",
  PCD = "臺灣新北地方法院",
  SLD = "臺灣士林地方法院",
  TYD = "臺灣桃園地方法院",
  SCD = "臺灣新竹地方法院",
  MLD = "臺灣苗栗地方法院",
  TCD = "臺灣臺中地方法院",
  NTD = "臺灣南投地方法院",
  CHD = "臺灣彰化地方法院",
  ULD = "臺灣雲林地方法院",
  CYD = "臺灣嘉義地方法院",
  TND = "臺灣臺南地方法院",
  CTD = "臺灣橋頭地方法院",
  KSD = "臺灣高雄地方法院",
  PTD = "臺灣屏東地方法院",
  TTD = "臺灣臺東地方法院",
  HLD = "臺灣花蓮地方法院",
  ILD = "臺灣宜蘭地方法院",
  KLD = "臺灣基隆地方法院",
  PHD = "臺灣澎湖地方法院",
  LCD = "福建連江地方法院",
  KMD = "福建金門地方法院",
}

@Component({
  selector: 'app-selected-court',
  imports: [
    MatToolbar,
    MatFormFieldModule,
    MatToolbarModule,
    MatIcon,
    MatIconButton,
    MatDialogClose,
    MatDialogContent,
    MatDialogModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatButton,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selected-court.component.html',
  styleUrl: './selected-court.component.scss'
})

export class SelectedCourtComponent {
  private readonly fb = inject(FormBuilder);

  constructor(
    public dialog: MatDialogRef<SelectedCourtComponent>,
    private ngxService: NgxUiLoaderService,
  ) { }

  // 法院代碼
  court_code = {
    TPD: "臺灣臺北地方法院",
    PCD: "臺灣新北地方法院",
    SLD: "臺灣士林地方法院",
    TYD: "臺灣桃園地方法院",
    SCD: "臺灣新竹地方法院",
    MLD: "臺灣苗栗地方法院",
    TCD: "臺灣臺中地方法院",
    NTD: "臺灣南投地方法院",
    CHD: "臺灣彰化地方法院",
    ULD: "臺灣雲林地方法院",
    CYD: "臺灣嘉義地方法院",
    TND: "臺灣臺南地方法院",
    CTD: "臺灣橋頭地方法院",
    KSD: "臺灣高雄地方法院",
    PTD: "臺灣屏東地方法院",
    TTD: "臺灣臺東地方法院",
    HLD: "臺灣花蓮地方法院",
    ILD: "臺灣宜蘭地方法院",
    KLD: "臺灣基隆地方法院",
    PHD: "臺灣澎湖地方法院",
    LCD: "福建連江地方法院",
    KMD: "福建金門地方法院",
  }


  selectCourtform: FormGroup = this.fb.group({
    toppings: this.fb.group({
      TPD: false,
      PCD: false,
      SLD: false,
      TYD: false,
      SCD: false,
      MLD: false,
      TCD: false,
      NTD: false,
      CHD: false,
      ULD: false,
      CYD: false,
      TND: false,
      CTD: false,
      KSD: false,
      PTD: false,
      TTD: false,
      HLD: false,
      ILD: false,
      KLD: false,
      PHD: false,
      LCD: false,
      KMD: false,
    }),
  });

  submit() {
    console.log(this.selectCourtform.value.toppings); // 印出選中的 checkbox 值
    this.dialog.close(this.selectCourtform.value.toppings); // 返回選中的值並關閉 dialog
  }


}
