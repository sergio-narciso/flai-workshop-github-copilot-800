from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_date
from octofit_tracker.models import OctofitUser, Team, Activity, Leaderboard, Workout


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        OctofitUser.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Creating superhero users...')
        users_data = [
            # Marvel heroes
            {'name': 'Tony Stark', 'email': 'ironman@marvel.com', 'age': 42, 'fitness_level': 'elite'},
            {'name': 'Steve Rogers', 'email': 'cap@marvel.com', 'age': 105, 'fitness_level': 'elite'},
            {'name': 'Thor Odinson', 'email': 'thor@marvel.com', 'age': 1500, 'fitness_level': 'god'},
            {'name': 'Natasha Romanoff', 'email': 'blackwidow@marvel.com', 'age': 38, 'fitness_level': 'elite'},
            {'name': 'Peter Parker', 'email': 'spiderman@marvel.com', 'age': 18, 'fitness_level': 'advanced'},
            # DC heroes
            {'name': 'Bruce Wayne', 'email': 'batman@dc.com', 'age': 40, 'fitness_level': 'elite'},
            {'name': 'Clark Kent', 'email': 'superman@dc.com', 'age': 35, 'fitness_level': 'god'},
            {'name': 'Diana Prince', 'email': 'wonderwoman@dc.com', 'age': 5000, 'fitness_level': 'god'},
            {'name': 'Barry Allen', 'email': 'flash@dc.com', 'age': 28, 'fitness_level': 'elite'},
            {'name': 'Hal Jordan', 'email': 'greenlantern@dc.com', 'age': 32, 'fitness_level': 'advanced'},
        ]
        users = {}
        for ud in users_data:
            user = OctofitUser.objects.create(**ud)
            users[ud['email']] = user
            self.stdout.write(f"  Created user: {ud['name']}")

        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(name='Team Marvel')
        team_marvel.members.set([
            users['ironman@marvel.com'],
            users['cap@marvel.com'],
            users['thor@marvel.com'],
            users['blackwidow@marvel.com'],
            users['spiderman@marvel.com'],
        ])

        team_dc = Team.objects.create(name='Team DC')
        team_dc.members.set([
            users['batman@dc.com'],
            users['superman@dc.com'],
            users['wonderwoman@dc.com'],
            users['flash@dc.com'],
            users['greenlantern@dc.com'],
        ])
        self.stdout.write('  Created Team Marvel and Team DC')

        self.stdout.write('Creating activities...')
        activities_data = [
            {'user': users['ironman@marvel.com'], 'activity_type': 'Iron Suit Training', 'duration': 90.0, 'date': parse_date('2024-01-15')},
            {'user': users['cap@marvel.com'], 'activity_type': 'Shield Throwing', 'duration': 60.0, 'date': parse_date('2024-01-15')},
            {'user': users['thor@marvel.com'], 'activity_type': 'Hammer Lifting', 'duration': 45.0, 'date': parse_date('2024-01-16')},
            {'user': users['blackwidow@marvel.com'], 'activity_type': 'Combat Training', 'duration': 75.0, 'date': parse_date('2024-01-16')},
            {'user': users['spiderman@marvel.com'], 'activity_type': 'Web Slinging', 'duration': 50.0, 'date': parse_date('2024-01-17')},
            {'user': users['batman@dc.com'], 'activity_type': 'Gotham Patrol', 'duration': 120.0, 'date': parse_date('2024-01-15')},
            {'user': users['superman@dc.com'], 'activity_type': 'Flying Drills', 'duration': 30.0, 'date': parse_date('2024-01-15')},
            {'user': users['wonderwoman@dc.com'], 'activity_type': 'Lasso Technique', 'duration': 60.0, 'date': parse_date('2024-01-16')},
            {'user': users['flash@dc.com'], 'activity_type': 'Speed Running', 'duration': 20.0, 'date': parse_date('2024-01-16')},
            {'user': users['greenlantern@dc.com'], 'activity_type': 'Ring Construct Training', 'duration': 55.0, 'date': parse_date('2024-01-17')},
        ]
        for ad in activities_data:
            Activity.objects.create(**ad)
        self.stdout.write(f'  Created {len(activities_data)} activities')

        self.stdout.write('Creating leaderboard entries...')
        leaderboard_data = [
            {'user': users['thor@marvel.com'], 'score': 9800},
            {'user': users['superman@dc.com'], 'score': 9750},
            {'user': users['wonderwoman@dc.com'], 'score': 9600},
            {'user': users['cap@marvel.com'], 'score': 9400},
            {'user': users['batman@dc.com'], 'score': 9200},
            {'user': users['ironman@marvel.com'], 'score': 9000},
            {'user': users['blackwidow@marvel.com'], 'score': 8800},
            {'user': users['flash@dc.com'], 'score': 8700},
            {'user': users['spiderman@marvel.com'], 'score': 8500},
            {'user': users['greenlantern@dc.com'], 'score': 8300},
        ]
        for ld in leaderboard_data:
            Leaderboard.objects.create(**ld)
        self.stdout.write(f'  Created {len(leaderboard_data)} leaderboard entries')

        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Avengers Assemble',
                'description': 'Superhero-level strength and agility training for Marvel heroes.',
                'exercises': 'Shield throws,Arc reactor push-ups,Mjolnir swings,Web crawls,Black widow kicks',
            },
            {
                'name': 'Justice League Workout',
                'description': 'High-intensity training regimen used by DC heroes.',
                'exercises': 'Gotham sprints,Kryptonian squats,Lasso lunges,Speed bursts,Ring constructs',
            },
            {
                'name': 'Hero Core Blast',
                'description': 'Core strength workout suitable for all superhero fitness levels.',
                'exercises': 'Plank holds,Super crunches,Cape flaps,Hero jumps,Iron planks',
            },
        ]
        for wd in workouts_data:
            Workout.objects.create(**wd)
        self.stdout.write(f'  Created {len(workouts_data)} workouts')

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
