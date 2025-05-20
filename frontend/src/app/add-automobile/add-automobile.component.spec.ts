import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAutomobileComponent } from './add-automobile.component';

describe('AddAutomobileComponent', () => {
  let component: AddAutomobileComponent;
  let fixture: ComponentFixture<AddAutomobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAutomobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAutomobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
