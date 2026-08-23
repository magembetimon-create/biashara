from django.core.management.base import BaseCommand

from stoku.views import backfill_picha_vision_terms


class Command(BaseCommand):
    help = "Pitisha picha zilizohifadhiwa kwenye Google Vision na usave terms kwenye picha_hash"

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=0, help='Idadi ya picha (0 = zote)')
        parser.add_argument('--force', action='store_true', help='Rudia hata zilizo na text tayari')

    def handle(self, *args, **options):
        result = backfill_picha_vision_terms(limit=options['limit'], force=options['force'])
        self.stdout.write(self.style.SUCCESS(
            f"Done. total={result['total']} updated={result['updated']} "
            f"pending={result['pending']} failed={result['failed']}"
        ))
        for err in result.get('errors') or []:
            self.stderr.write(err)
