package com.example.angulardashboard.dashboard.controller;

import com.example.angulardashboard.dashboard.dto.ActivityItemDto;
import com.example.angulardashboard.dashboard.dto.ChartSeriesDto;
import com.example.angulardashboard.dashboard.dto.KpiCardDto;
import com.example.angulardashboard.dashboard.service.DashboardService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Backs the Angular `features/dashboard/` screen. Any authenticated user may read these. */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/kpis")
    public List<KpiCardDto> kpis() {
        return dashboardService.getKpis();
    }

    @GetMapping("/sales-overview")
    public ChartSeriesDto salesOverview() {
        return dashboardService.getSalesOverview();
    }

    @GetMapping("/user-growth")
    public ChartSeriesDto userGrowth() {
        return dashboardService.getUserGrowth();
    }

    @GetMapping("/revenue-breakdown")
    public ChartSeriesDto revenueBreakdown() {
        return dashboardService.getRevenueBreakdown();
    }

    @GetMapping("/recent-activity")
    public List<ActivityItemDto> recentActivity() {
        return dashboardService.getRecentActivity();
    }
}
