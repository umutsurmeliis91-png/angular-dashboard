package com.example.angulardashboard.dashboard.dto;

/** Mirrors the Angular {@code ActivityItem} interface (src/app/shared/models/dashboard.models.ts). */
public class ActivityItemDto {

    private final long id;
    private final String user;
    private final String action;
    private final String time;
    private final String icon;
    private final String accent;

    public ActivityItemDto(long id, String user, String action, String time, String icon, String accent) {
        this.id = id;
        this.user = user;
        this.action = action;
        this.time = time;
        this.icon = icon;
        this.accent = accent;
    }

    public long getId() {
        return id;
    }

    public String getUser() {
        return user;
    }

    public String getAction() {
        return action;
    }

    public String getTime() {
        return time;
    }

    public String getIcon() {
        return icon;
    }

    public String getAccent() {
        return accent;
    }
}
