import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFullTextPageComponent } from './view-full-text-page.component';

describe('ViewFullTextPageComponent', () => {
  let component: ViewFullTextPageComponent;
  let fixture: ComponentFixture<ViewFullTextPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFullTextPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFullTextPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
