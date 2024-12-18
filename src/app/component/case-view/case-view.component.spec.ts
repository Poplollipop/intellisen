import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseViewComponent } from './case-view.component';

describe('CaseViewComponent', () => {
  let component: CaseViewComponent;
  let fixture: ComponentFixture<CaseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
