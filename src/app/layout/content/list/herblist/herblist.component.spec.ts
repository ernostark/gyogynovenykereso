import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HerblistComponent } from './herblist.component';

describe('HerblistComponent', () => {
  let component: HerblistComponent;
  let fixture: ComponentFixture<HerblistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HerblistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HerblistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
