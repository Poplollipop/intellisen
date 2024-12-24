import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-search-page',
  imports: [
    MatIconModule,
    MatExpansionModule,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {

  readonly panelOpenState = signal(false);

  selectedButton: string | null = null;

  toggleButton(buttonType: string): void {
    this.selectedButton = this.selectedButton == buttonType ? null : buttonType;
  }


}
