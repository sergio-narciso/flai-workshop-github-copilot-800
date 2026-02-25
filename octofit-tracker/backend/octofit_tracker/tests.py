from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import OctofitUser, Team, Activity, Leaderboard, Workout
import datetime


class OctofitUserModelTest(TestCase):
    def setUp(self):
        self.user = OctofitUser.objects.create(
            name='Tony Stark',
            email='ironman@marvel.com',
            age=42,
            fitness_level='elite',
        )

    def test_user_str(self):
        self.assertEqual(str(self.user), 'Tony Stark')

    def test_user_fields(self):
        self.assertEqual(self.user.email, 'ironman@marvel.com')
        self.assertEqual(self.user.fitness_level, 'elite')


class TeamModelTest(TestCase):
    def setUp(self):
        self.user = OctofitUser.objects.create(
            name='Steve Rogers', email='cap@marvel.com', age=105, fitness_level='elite'
        )
        self.team = Team.objects.create(name='Team Marvel')
        self.team.members.add(self.user)

    def test_team_str(self):
        self.assertEqual(str(self.team), 'Team Marvel')

    def test_team_members(self):
        self.assertIn(self.user, self.team.members.all())


class ActivityModelTest(TestCase):
    def setUp(self):
        self.user = OctofitUser.objects.create(
            name='Bruce Wayne', email='batman@dc.com', age=40, fitness_level='elite'
        )
        self.activity = Activity.objects.create(
            user=self.user,
            activity_type='Gotham Patrol',
            duration=120.0,
            date=datetime.date(2024, 1, 15),
        )

    def test_activity_str(self):
        self.assertEqual(str(self.activity), 'Bruce Wayne - Gotham Patrol')

    def test_activity_duration(self):
        self.assertEqual(self.activity.duration, 120.0)


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.user = OctofitUser.objects.create(
            name='Thor Odinson', email='thor@marvel.com', age=1500, fitness_level='god'
        )
        self.entry = Leaderboard.objects.create(user=self.user, score=9800)

    def test_leaderboard_str(self):
        self.assertEqual(str(self.entry), 'Thor Odinson: 9800')

    def test_leaderboard_score(self):
        self.assertEqual(self.entry.score, 9800)


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Avengers Assemble',
            description='Superhero-level training',
            exercises='Shield throws,Arc reactor push-ups',
        )

    def test_workout_str(self):
        self.assertEqual(str(self.workout), 'Avengers Assemble')


class OctofitUserAPITest(APITestCase):
    def setUp(self):
        self.user = OctofitUser.objects.create(
            name='Diana Prince', email='wonderwoman@dc.com', age=5000, fitness_level='god'
        )

    def test_list_users(self):
        url = reverse('octofituser-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user(self):
        url = reverse('octofituser-detail', args=[self.user.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Diana Prince')

    def test_create_user(self):
        url = reverse('octofituser-list')
        data = {'name': 'Clark Kent', 'email': 'superman@dc.com', 'age': 35, 'fitness_level': 'god'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class TeamAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Team DC')

    def test_list_teams(self):
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_team(self):
        url = reverse('team-detail', args=[self.team.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Team DC')


class ActivityAPITest(APITestCase):
    def setUp(self):
        self.user = OctofitUser.objects.create(
            name='Barry Allen', email='flash@dc.com', age=28, fitness_level='elite'
        )
        self.activity = Activity.objects.create(
            user=self.user,
            activity_type='Speed Running',
            duration=20.0,
            date=datetime.date(2024, 1, 16),
        )

    def test_list_activities(self):
        url = reverse('activity-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITest(APITestCase):
    def setUp(self):
        self.user = OctofitUser.objects.create(
            name='Clark Kent', email='superman@dc.com', age=35, fitness_level='god'
        )
        Leaderboard.objects.create(user=self.user, score=9750)

    def test_list_leaderboard(self):
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    def setUp(self):
        Workout.objects.create(
            name='Justice League Workout',
            description='DC heroes training',
            exercises='Gotham sprints,Kryptonian squats',
        )

    def test_list_workouts(self):
        url = reverse('workout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class APIRootTest(APITestCase):
    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_api_prefix_root(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
