from django.contrib import admin
from .models import OctofitUser, Team, Activity, Leaderboard, Workout


@admin.register(OctofitUser)
class OctofitUserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'age', 'fitness_level')
    search_fields = ('name', 'email')
    list_filter = ('fitness_level',)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    filter_horizontal = ('members',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'duration', 'date')
    search_fields = ('activity_type',)
    list_filter = ('activity_type', 'date')


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('user', 'score')
    ordering = ('-score',)


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
