import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoekatamarineComponent } from './koekatamarine.component';

describe('KoekatamarineComponent', () => {
  let component: KoekatamarineComponent;
  let fixture: ComponentFixture<KoekatamarineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoekatamarineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoekatamarineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
