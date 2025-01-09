import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullTextDialogComponent } from './full-text-dialog.component';

describe('FullTextDialogComponent', () => {
  let component: FullTextDialogComponent;
  let fixture: ComponentFixture<FullTextDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullTextDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullTextDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
