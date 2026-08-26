import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { ChartOptions } from 'chart.js';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { KpiCard } from '../../../shared/components/kpi-card/kpi-card';
import { baseChartOptions, DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [ChartModule, SkeletonModule, TableModule, DividerModule, KpiCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);

  readonly kpis = toSignal(this.dashboardService.getKpis());
  readonly salesData = toSignal(this.dashboardService.getSalesOverview());
  readonly userGrowthData = toSignal(this.dashboardService.getUserGrowth());
  readonly revenueData = toSignal(this.dashboardService.getRevenueBreakdown());
  readonly recentActivity = toSignal(this.dashboardService.getRecentActivity());

  readonly barOptions: ChartOptions = baseChartOptions();
  readonly lineOptions: ChartOptions = baseChartOptions();
  readonly doughnutOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
    },
  };
}
