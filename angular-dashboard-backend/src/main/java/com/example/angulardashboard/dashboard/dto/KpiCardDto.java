package com.example.angulardashboard.dashboard.dto;

/** Mirrors the Angular {@code KpiCardData} interface (src/app/shared/models/dashboard.models.ts). */
public class KpiCardDto {

    private final String title;
    private final String value;
    private final String icon;
    private final double changePercent;
    private final String trend;
    private final String accent;

    public KpiCardDto(String title, String value, String icon, double changePercent, String trend, String accent) {
        this.title = title;
        this.value = value;
        this.icon = icon;
        this.changePercent = changePercent;
        this.trend = trend;
        this.accent = accent;
    }

    public String getTitle() {
        return title;
    }

    public String getValue() {
        return value;
    }

    public String getIcon() {
        return icon;
    }

    public double getChangePercent() {
        return changePercent;
    }

    public String getTrend() {
        return trend;
    }

    public String getAccent() {
        return accent;
    }
}
