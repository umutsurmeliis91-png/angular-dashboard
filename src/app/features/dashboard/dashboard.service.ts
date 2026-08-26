import { Injectable } from '@angular/core';
import type { ChartData, ChartOptions } from 'chart.js';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ActivityItem, KpiCardData } from '../../shared/models/dashboard.models';

const MOCK_LATENCY_MS = 400;

/**
 * All dashboard data is mocked for now. Once the Spring Boot backend exists,
 * only the bodies of these methods change (e.g. `this.http.get<KpiCardData[]>(
 * `${environment.apiUrl}/dashboard/kpis`)`) — components keep calling the
 * same service methods.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  getKpis(): Observable<KpiCardData[]> {
    const kpis: KpiCardData[] = [
      {
        title: 'Total Users',
        value: '1,248',
        icon: 'pi pi-users',
        changePercent: 8.2,
        trend: 'up',
        accent: 'primary',
      },
      {
        title: 'Active Users',
        value: '1,089',
        icon: 'pi pi-user-plus',
        changePercent: 4.6,
        trend: 'up',
        accent: 'success',
      },
      {
        title: 'Orders',
        value: '3,542',
        icon: 'pi pi-shopping-cart',
        changePercent: 2.4,
        trend: 'down',
        accent: 'warning',
      },
      {
        title: 'Revenue',
        value: '$48,290',
        icon: 'pi pi-dollar',
        changePercent: 12.1,
        trend: 'up',
        accent: 'danger',
      },
    ];

    return of(kpis).pipe(delay(MOCK_LATENCY_MS));
  }

  getSalesOverview(): Observable<ChartData<'bar'>> {
    const data: ChartData<'bar'> = {
      labels: ['Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu'],
      datasets: [
        {
          label: 'Satışlar',
          data: [28, 34, 31, 42, 38, 47],
          backgroundColor: '#6366f1',
          borderRadius: 6,
          barThickness: 22,
        },
      ],
    };

    return of(data).pipe(delay(MOCK_LATENCY_MS));
  }

  getUserGrowth(): Observable<ChartData<'line'>> {
    const data: ChartData<'line'> = {
      labels: ['Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu'],
      datasets: [
        {
          label: 'Kullanıcılar',
          data: [820, 902, 951, 1020, 1145, 1248],
          fill: true,
          tension: 0.4,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
        },
      ],
    };

    return of(data).pipe(delay(MOCK_LATENCY_MS));
  }

  getRevenueBreakdown(): Observable<ChartData<'doughnut'>> {
    const data: ChartData<'doughnut'> = {
      labels: ['Abonelik', 'Tek seferlik', 'Hizmet'],
      datasets: [
        {
          data: [54, 28, 18],
          backgroundColor: ['#6366f1', '#22c55e', '#f59e0b'],
          hoverOffset: 6,
        },
      ],
    };

    return of(data).pipe(delay(MOCK_LATENCY_MS));
  }

  getRecentActivity(): Observable<ActivityItem[]> {
    const activity: ActivityItem[] = [
      {
        id: 1,
        user: 'John Doe',
        action: 'yeni bir sipariş oluşturdu',
        time: '5 dakika önce',
        icon: 'pi pi-shopping-cart',
        accent: 'primary',
      },
      {
        id: 2,
        user: 'Jane Smith',
        action: 'profilini güncelledi',
        time: '22 dakika önce',
        icon: 'pi pi-user-edit',
        accent: 'success',
      },
      {
        id: 3,
        user: 'Admin',
        action: 'yeni bir kullanıcı oluşturdu',
        time: '1 saat önce',
        icon: 'pi pi-user-plus',
        accent: 'warning',
      },
      {
        id: 4,
        user: 'Michael Lee',
        action: 'ödemesini tamamladı',
        time: '3 saat önce',
        icon: 'pi pi-check-circle',
        accent: 'success',
      },
    ];

    return of(activity).pipe(delay(MOCK_LATENCY_MS));
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
