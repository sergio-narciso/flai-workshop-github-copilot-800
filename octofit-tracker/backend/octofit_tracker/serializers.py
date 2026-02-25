from rest_framework import serializers
from .models import OctofitUser, Team, Activity, Leaderboard, Workout


class OctofitUserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    teams = serializers.SerializerMethodField()
    team_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = OctofitUser
        fields = ['id', 'name', 'username', 'email', 'age', 'fitness_level', 'teams', 'team_ids']

    def get_id(self, obj):
        return str(obj.pk)

    def get_teams(self, obj):
        return [{'id': str(t.pk), 'name': t.name} for t in obj.teams.all()]

    def update(self, instance, validated_data):
        team_ids = validated_data.pop('team_ids', None)
        instance = super().update(instance, validated_data)
        if team_ids is not None:
            for team in Team.objects.all():
                if team.pk in team_ids:
                    team.members.add(instance)
                else:
                    team.members.remove(instance)
        return instance


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
