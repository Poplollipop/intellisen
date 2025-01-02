import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, } from 'ngx-ui-loader';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient } from '@angular/common/http';

// const ngx: NgxUiLoaderConfig = {
//   text: "載入中...",
//   textColor: "#FFFFFF",
//   textPosition: "center-center",
//   bgsColor: "#FFFFFF",
//   fgsColor: "#FFFFFF",
//   fgsType: "circle",
//   fgsSize: 100,
//   hasProgressBar: false
// }


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    // importProvidersFrom(NgxUiLoaderModule.forRoot(ngx)),
    provideAnimationsAsync(),
    providePrimeNG({theme: {preset: Aura}}),
    provideHttpClient()

  ]
};

