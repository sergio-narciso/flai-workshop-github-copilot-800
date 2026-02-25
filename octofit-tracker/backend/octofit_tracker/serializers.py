from rest_framework import serializers
from .models import OctofitUser, Team, Activity, Leaderboard, Workout


class OctofitUserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = OctofitUser
        fields = '__all__'

    def get_id(self, obj):
        return str(obj.pk)


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    members = OctofitUserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = '__all__'

    def get_id(self, obj):
        return str(obj.pk)


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = '__all__'

    def get_id(self, obj):
        return str(obj.pk)


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user = OctofitUserSerializer(read_only=True)

    class Meta:
        model = Leaderboard
        fields = '__all__'

    def get_id(self, obj):
        return str(obj.pk)


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = '__all__'

    def get_id(self, obj):
        return str(obj.pk)
