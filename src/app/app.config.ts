import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, } from 'ngx-ui-loader';
import { routes } from './app.routes';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomPaginatorIntl } from './service/mat-paginator-intl';

// 設定 loading 樣式
const ngx: NgxUiLoaderConfig = {
  text: "載入中...",
  textColor: "#FFFFFF",
  textPosition: "center-center",
  bgsColor: "#FFFFFF",
  fgsColor: "#FFFFFF",
  fgsType: "circle",
  fgsSize: 100,
  // hasProgressBar: false // 進度條
}


export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, MatPaginatorModule, NgxUiLoaderModule.forRoot(ngx)),  // 替代 imports
    // 更改 MatPaginator 樣式，詳細內容在 compnent : CustomPaginatorIntl 內
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),
    provideHttpClient(withFetch())

  ]
};

