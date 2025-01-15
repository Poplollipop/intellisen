import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountProfilePageComponent } from './account-profile-page.component';

describe('AccountProfilePageComponent', () => {
  let component: AccountProfilePageComponent;
  let fixture: ComponentFixture<AccountProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountProfilePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
