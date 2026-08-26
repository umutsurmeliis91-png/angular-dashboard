import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { KpiCardData } from '../../models/dashboard.models';

@Component({
  selector: 'app-kpi-card',
  imports: [TagModule],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
})
export class KpiCard {
  readonly data = input.required<KpiCardData>();

  readonly trendIcon = computed(() =>
    this.data().trend === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down',
  );
  readonly trendSeverity = computed(() => (this.data().trend === 'up' ? 'success' : 'danger'));
}
