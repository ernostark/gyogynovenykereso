import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../../../shared/services/cart-service.service';
import { AuthService } from '../../../shared/services/auth.service';
import { environment } from '../../../../environments/environment.development';

interface ShippingMethod {
  id: number;
  name: string;
  description: string;
  cost: number;
  estimated_delivery_days: number;
}

interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})

export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: any[] = [];
  subtotal: number = 0;
  shippingCost: number = 0;
  total: number = 0;
  loading: boolean = true;
  submitting: boolean = false;
  error: string | null = null;
  orderSuccess: boolean = false;
  orderNumber: string = '';

  shippingMethods: ShippingMethod[] = [];
  paymentMethods: PaymentMethod[] = [];

  storageUrl = environment.storageUrl || '/storage/';

  currentStep: number = 1;
  totalSteps: number = 3;

  freeShippingThreshold: number = 15000;

  isLoggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {

    this.cartService.resetCartRequest();

    this.checkoutForm = this.fb.group({
      billing_name: ['', [Validators.required]],
      billing_email: ['', [Validators.required, Validators.email]],
      billing_phone: ['', [Validators.pattern('[0-9+\\-\\s]{6,15}')]],
      billing_country: ['Magyarország', [Validators.required]],
      billing_postal_code: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      billing_city: ['', [Validators.required]],
      billing_street: ['', [Validators.required]],
      billing_address_line_2: [''],

      same_as_billing: [true],

      shipping_name: [''],
      shipping_phone: [''],
      shipping_country: ['Magyarország'],
      shipping_postal_code: [''],
      shipping_city: [''],
      shipping_street: [''],
      shipping_address_line_2: [''],

      shipping_method_id: ['', [Validators.required]],
      payment_method_id: ['', [Validators.required]],

      notes: [''],

      terms_accepted: [false, [Validators.requiredTrue]]
    });

    this.onSameAsBillingChange();

    this.isLoggedIn = !!localStorage.getItem('auth_token');
  }

  ngOnInit(): void {
    this.loadCartData();
    this.loadShippingMethods();
    this.loadPaymentMethods();

    if (this.isLoggedIn) {
      this.loadUserData();
    }

    this.checkoutForm.get('same_as_billing')?.valueChanges.subscribe(value => {
      this.onSameAsBillingChange();
    });

    this.checkoutForm.get('shipping_method_id')?.valueChanges.subscribe(value => {
      this.updateShippingCost();
    });
  }

  loadCartData(): void {
    this.loading = true;
    this.cartService.loadCart().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.cartItems = response.cart.items || [];
          this.subtotal = response.subtotal || 0;
          this.updateTotals();

          if (this.cartItems.length === 0) {
            this.router.navigate(['/cart']);
          }
        } else {
          this.error = 'Hiba történt a kosár betöltése során.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Hiba történt a kosár betöltése során. Kérjük, próbálja újra később!';
        this.loading = false;
        console.error('Kosár betöltési hiba:', err);
      }
    });
  }

  loadShippingMethods(): void {
    this.http.get<ShippingMethod[]>(`${environment.apiUrl}/shipping-methods`).subscribe({
      next: (methods) => {
        this.shippingMethods = methods;

        if (this.shippingMethods.length > 0) {
          this.checkoutForm.patchValue({
            shipping_method_id: this.shippingMethods[0].id
          });
          this.updateShippingCost();
        }
      },
      error: (err) => {
        console.error('Szállítási módok betöltési hiba:', err);
      }
    });
  }

  loadPaymentMethods(): void {
    this.http.get<PaymentMethod[]>(`${environment.apiUrl}/payment-methods`).subscribe({
      next: (methods) => {
        this.paymentMethods = methods;

        if (this.paymentMethods.length > 0) {
          this.checkoutForm.patchValue({
            payment_method_id: this.paymentMethods[0].id
          });
        }
      },
      error: (err) => {
        console.error('Fizetési módok betöltési hiba:', err);
        this.paymentMethods = [
          { id: 1, name: 'Banki átutalás', description: 'Előre utalás bankszámlára', icon: 'bank' },
          { id: 2, name: 'Utánvét', description: 'Fizetés átvételkor', icon: 'cash' },
          { id: 3, name: 'Bankkártya', description: 'Online bankkártyás fizetés', icon: 'credit-card' }
        ];
        this.checkoutForm.patchValue({
          payment_method_id: this.paymentMethods[0].id
        });
      }
    });
  }

  loadUserData(): void {
    this.authService.getUserProfile().subscribe({
      next: (response: any) => {
        if (response && response.success && response.user) {
          const user = response.user;

          this.checkoutForm.patchValue({
            billing_name: user.name || '',
            billing_email: user.email || '',
            billing_phone: user.phone || '',
            billing_country: user.country || 'Magyarország',
            billing_postal_code: user.postal_code || '',
            billing_city: user.city || '',
            billing_street: user.street || '',
            billing_address_line_2: user.address_line_2 || ''
          });

          if (user.shipping_street || user.shipping_city) {
            this.checkoutForm.patchValue({
              same_as_billing: false,
              shipping_name: user.shipping_name || user.name || '',
              shipping_phone: user.shipping_phone || user.phone || '',
              shipping_country: user.shipping_country || user.country || 'Magyarország',
              shipping_postal_code: user.shipping_postal_code || user.postal_code || '',
              shipping_city: user.shipping_city || user.city || '',
              shipping_street: user.shipping_street || user.street || '',
              shipping_address_line_2: user.shipping_address_line_2 || user.address_line_2 || ''
            });
          }
        }
      },
      error: (err) => {
        console.error('Felhasználói adatok betöltési hiba:', err);
      }
    });
  }

  updateShippingCost(): void {
    const selectedMethodId = +this.checkoutForm.get('shipping_method_id')?.value;
    const selectedMethod = this.shippingMethods.find(m => m.id === selectedMethodId);

    if (selectedMethod) {
      this.shippingCost = this.subtotal >= this.freeShippingThreshold ? 0 : selectedMethod.cost;
      this.updateTotals();
    }
  }

  updateTotals(): void {
    this.total = this.subtotal + this.shippingCost;
  }

  onSameAsBillingChange(): void {
    const sameAsBilling = this.checkoutForm.get('same_as_billing')?.value;

    const shippingControls = [
      'shipping_name',
      'shipping_country',
      'shipping_postal_code',
      'shipping_city',
      'shipping_street'
    ];

    shippingControls.forEach(controlName => {
      const control = this.checkoutForm.get(controlName);
      if (control) {
        if (sameAsBilling) {
          control.clearValidators();
        } else {
          control.setValidators([Validators.required]);
        }
        control.updateValueAndValidity();
      }
    });
  }

  goToStep(step: number): void {
    if (step < this.currentStep || this.validateCurrentStep()) {
      this.currentStep = step;
      window.scrollTo(0, 0);
    }
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
      window.scrollTo(0, 0);
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  validateCurrentStep(): boolean {
    let isValid = true;

    if (this.currentStep === 1) {
      const billingControls = [
        'billing_name',
        'billing_email',
        'billing_country',
        'billing_postal_code',
        'billing_city',
        'billing_street'
      ];

      billingControls.forEach(controlName => {
        const control = this.checkoutForm.get(controlName);
        if (control && control.invalid) {
          control.markAsTouched();
          isValid = false;
        }
      });

      if (!this.checkoutForm.get('same_as_billing')?.value) {
        const shippingControls = [
          'shipping_name',
          'shipping_country',
          'shipping_postal_code',
          'shipping_city',
          'shipping_street'
        ];

        shippingControls.forEach(controlName => {
          const control = this.checkoutForm.get(controlName);
          if (control && control.invalid) {
            control.markAsTouched();
            isValid = false;
          }
        });
      }
    } else if (this.currentStep === 2) {
      const controls = [
        'shipping_method_id',
        'payment_method_id'
      ];

      controls.forEach(controlName => {
        const control = this.checkoutForm.get(controlName);
        if (control && control.invalid) {
          control.markAsTouched();
          isValid = false;
        }
      });
    }

    return isValid;
  }

  submitOrder(): void {
    if (this.checkoutForm.invalid) {
      Object.keys(this.checkoutForm.controls).forEach(key => {
        const control = this.checkoutForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.submitting = true;
    this.error = null;

    this.cartService.checkout(this.checkoutForm.value).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.orderSuccess = true;
          this.orderNumber = response.order_number;
          this.cartItems = [];
          this.subtotal = 0;
          this.shippingCost = 0;
          this.total = 0;
        } else {
          this.error = response.message || 'Hiba történt a rendelés feldolgozása során.';
        }
        this.submitting = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Hiba történt a rendelés feldolgozása során. Kérjük, próbálja újra később!';
        this.submitting = false;
        console.error('Rendelés feldolgozási hiba:', err);
      }
    });
  }

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  get f() {
    return this.checkoutForm.controls;
  }

}