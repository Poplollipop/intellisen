import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickDialogComponent } from './click-dialog.component';

describe('ClickDialogComponent', () => {
  let component: ClickDialogComponent;
  let fixture: ComponentFixture<ClickDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClickDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClickDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
