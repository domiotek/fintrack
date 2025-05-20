import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { RoutingService } from '../../../../core/services/routing/routing.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { ApiErrorCode } from '../../../../core/models/error-codes.enum';

@Component({
  selector: 'app-activate',
  imports: [MatCardModule, MatProgressBarModule, MatButtonModule, AlertPanelComponent],
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss', '../../styles/common.style.scss'],
})
export class ActivateComponent implements AfterViewInit {
  errorCode = signal<number | null>(null);
  submitting = signal(false);
  token = signal<string | null>(null);

  authService = inject(AuthService);
  routingService = inject(RoutingService);
  route = inject(ActivatedRoute);

  ngAfterViewInit(): void {
    const id = this.route.snapshot.paramMap.get('token');
    this.token.set(id);
    this.activateAccount();
  }

  activateAccount() {
    if (this.submitting()) return;

    if (this.token() === null) {
      this.errorCode.set(ApiErrorCode.VERIFICATION_CODE_EXPIRED);
      return;
    }

    this.errorCode.set(null);
    this.submitting.set(true);

    this.authService.activateAccount(this.token()!).subscribe({
      error: (err) => {
        this.errorCode.set(err.error.code);
        this.submitting.set(false);
      },
      complete: () => {
        this.submitting.set(false);
        this.routingService.navigate(['/login'], { ref: 'account-activated' });
      },
    });
  }
}
