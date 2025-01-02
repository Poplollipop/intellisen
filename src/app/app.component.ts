import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "./layouts/toolbar/toolbar.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToolbarComponent,
    MatDialogModule,
    MatButtonModule,
    NgxUiLoaderModule,
    MatTooltipModule,
    FormsModule,
    NgxUiLoaderHttpModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {

  constructor(
    private ngxService: NgxUiLoaderService,
    protected router: Router,
  ) { }

  ngOnInit(): void {
    this.ngxService.start(); // 啟動加載器
    setTimeout(() => {
      this.ngxService.stop(); // 例如 2 秒後停止
    }, 2000);
  }

}
