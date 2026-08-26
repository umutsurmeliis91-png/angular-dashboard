import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, ButtonModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  private readonly authService = inject(AuthService);

  readonly homeLink = this.authService.isAuthenticated() ? '/dashboard' : '/login';
}
