import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLawComponent } from './select-law.component';

describe('SelectLawComponent', () => {
  let component: SelectLawComponent;
  let fixture: ComponentFixture<SelectLawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectLawComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectLawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
