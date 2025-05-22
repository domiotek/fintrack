import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { SendResetPasswordFormComponent } from '../../components/send-reset-password-form/send-reset-password-form.component';
import { ResetPasswordFormComponent } from '../../components/reset-password-form/reset-password-form.component';
import { FormProgressBarComponent } from '../../components/form-progress-bar/form-progress-bar.component';

@Component({
  selector: 'app-reset-password',
  imports: [
    MatCardModule,
    CommonModule,
    RouterLink,
    SendResetPasswordFormComponent,
    ResetPasswordFormComponent,
    FormProgressBarComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss', '../../styles/common.style.scss'],
})
export class ResetPasswordComponent implements OnInit {
  submitting = signal(false);
  token = signal<string | null>(null);

  route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('token');
    this.token.set(id);
  }
}
