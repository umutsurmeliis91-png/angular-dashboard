package com.example.angulardashboard.dashboard.dto;

import java.util.List;

/**
 * Chart-library-agnostic series: labels + one numeric series. The Angular
 * DashboardService (not this backend) wraps this into the Chart.js-specific
 * {@code ChartData} shape (colors, bar thickness, etc.) — the backend has no
 * business knowing about frontend chart styling.
 */
public class ChartSeriesDto {

    private final List<String> labels;
    private final List<Integer> data;

    public ChartSeriesDto(List<String> labels, List<Integer> data) {
        this.labels = labels;
        this.data = data;
    }

    public List<String> getLabels() {
        return labels;
    }

    public List<Integer> getData() {
        return data;
    }
}
