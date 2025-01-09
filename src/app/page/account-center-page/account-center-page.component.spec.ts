import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCenterPageComponent } from './account-center-page.component';

describe('AccountCenterPageComponent', () => {
  let component: AccountCenterPageComponent;
  let fixture: ComponentFixture<AccountCenterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCenterPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountCenterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
