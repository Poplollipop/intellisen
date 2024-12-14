import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "./layouts/toolbar/toolbar.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SelectedCourtComponent } from './component/selected-court/selected-court.component';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToolbarComponent,
    MatDialogModule,
    MatButtonModule,
    NgxUiLoaderModule,
    MatTooltipModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    private dialog: MatDialog,
  ) { }


  selectCourt() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "600px",
      dialogConfig.height = "600px"
    this.dialog.open(SelectedCourtComponent, dialogConfig);
  }

}
