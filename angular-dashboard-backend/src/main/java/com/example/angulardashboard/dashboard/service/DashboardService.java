package com.example.angulardashboard.dashboard.service;

import com.example.angulardashboard.dashboard.dto.ActivityItemDto;
import com.example.angulardashboard.dashboard.dto.ChartSeriesDto;
import com.example.angulardashboard.dashboard.dto.KpiCardDto;
import com.example.angulardashboard.user.repository.UserRepository;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

/**
 * "Total Users" / "Active Users" are computed from the real `users` table.
 * There is no orders/revenue domain in this project yet, so those figures —
 * and the chart series / recent-activity feed — are illustrative constants
 * served from the backend instead of Angular's old mock. Replace them once a
 * real orders/billing module exists.
 */
@Service
public class DashboardService {

    private final UserRepository userRepository;

    public DashboardService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<KpiCardDto> getKpis() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByEnabledTrue();

        return List.of(
            new KpiCardDto("Total Users", format(totalUsers), "pi pi-users", 8.2, "up", "primary"),
            new KpiCardDto("Active Users", format(activeUsers), "pi pi-user-plus", 4.6, "up", "success"),
            new KpiCardDto("Orders", "3,542", "pi pi-shopping-cart", 2.4, "down", "warning"),
            new KpiCardDto("Revenue", "$48,290", "pi pi-dollar", 12.1, "up", "danger"));
    }

    public ChartSeriesDto getSalesOverview() {
        return new ChartSeriesDto(
            List.of("Mar", "Nis", "May", "Haz", "Tem", "Ağu"),
            List.of(28, 34, 31, 42, 38, 47));
    }

    public ChartSeriesDto getUserGrowth() {
        return new ChartSeriesDto(
            List.of("Mar", "Nis", "May", "Haz", "Tem", "Ağu"),
            List.of(820, 902, 951, 1020, 1145, (int) userRepository.count()));
    }

    public ChartSeriesDto getRevenueBreakdown() {
        return new ChartSeriesDto(
            List.of("Abonelik", "Tek seferlik", "Hizmet"),
            List.of(54, 28, 18));
    }

    public List<ActivityItemDto> getRecentActivity() {
        return List.of(
            new ActivityItemDto(1, "John Doe", "yeni bir sipariş oluşturdu", "5 dakika önce", "pi pi-shopping-cart", "primary"),
            new ActivityItemDto(2, "Jane Smith", "profilini güncelledi", "22 dakika önce", "pi pi-user-edit", "success"),
            new ActivityItemDto(3, "Admin", "yeni bir kullanıcı oluşturdu", "1 saat önce", "pi pi-user-plus", "warning"),
            new ActivityItemDto(4, "Michael Lee", "ödemesini tamamladı", "3 saat önce", "pi pi-check-circle", "success"));
    }

    private static String format(long value) {
        return NumberFormat.getIntegerInstance(Locale.US).format(value);
    }
}
