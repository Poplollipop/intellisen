import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidevavComponent } from './sidevav.component';

describe('SidevavComponent', () => {
  let component: SidevavComponent;
  let fixture: ComponentFixture<SidevavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidevavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidevavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
