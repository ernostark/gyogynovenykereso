import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebshopHomepageComponent } from './webshop-homepage.component';

describe('WebshopHomepageComponent', () => {
  let component: WebshopHomepageComponent;
  let fixture: ComponentFixture<WebshopHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebshopHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebshopHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
