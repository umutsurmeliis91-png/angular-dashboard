import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { ChartData, ChartOptions } from 'chart.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ActivityItem, KpiCardData } from '../../shared/models/dashboard.models';

/** What the backend's `/api/dashboard/*` chart endpoints return — plain, chart-library-agnostic. */
interface ChartSeriesResponse {
  labels: string[];
  data: number[];
}

/**
 * Talks to the Spring Boot dashboard API. The backend only knows about plain
 * label/value series (`ChartSeriesResponse`) — wrapping that into the
 * Chart.js-specific `ChartData` shape (colors, bar thickness, …) happens here
 * so the backend stays free of frontend charting details.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getKpis(): Observable<KpiCardData[]> {
    return this.http.get<KpiCardData[]>(`${environment.apiUrl}/dashboard/kpis`);
  }

  getSalesOverview(): Observable<ChartData<'bar'>> {
    return this.http.get<ChartSeriesResponse>(`${environment.apiUrl}/dashboard/sales-overview`).pipe(
      map((series) => ({
        labels: series.labels,
        datasets: [
          {
            label: 'Satışlar',
            data: series.data,
            backgroundColor: '#6366f1',
            borderRadius: 6,
            barThickness: 22,
          },
        ],
      })),
    );
  }

  getUserGrowth(): Observable<ChartData<'line'>> {
    return this.http.get<ChartSeriesResponse>(`${environment.apiUrl}/dashboard/user-growth`).pipe(
      map((series) => ({
        labels: series.labels,
        datasets: [
          {
            label: 'Kullanıcılar',
            data: series.data,
            fill: true,
            tension: 0.4,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
          },
        ],
      })),
    );
  }

  getRevenueBreakdown(): Observable<ChartData<'doughnut'>> {
    return this.http.get<ChartSeriesResponse>(`${environment.apiUrl}/dashboard/revenue-breakdown`).pipe(
      map((series) => ({
        labels: series.labels,
        datasets: [
          {
            data: series.data,
            backgroundColor: ['#6366f1', '#22c55e', '#f59e0b'],
            hoverOffset: 6,
          },
        ],
      })),
    );
  }

  getRecentActivity(): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(`${environment.apiUrl}/dashboard/recent-activity`);
  }
}

export function baseChartOptions(): ChartOptions {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(148, 163, 184, 0.15)' } },
    },
  };
}
