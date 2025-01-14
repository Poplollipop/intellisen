import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMainPageComponent } from './account-main-page.component';

describe('AccountMainPageComponent', () => {
  let component: AccountMainPageComponent;
  let fixture: ComponentFixture<AccountMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
