from django.test import TestCase
from django.contrib.auth.models import User

from management.models import Anatumia, Interprise, InterprisePermissions, UserExtend, Workers
from staff.views import _ensure_interprise_permission


class BranchPermissionHelperTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='owner', email='owner@example.com', password='secret123')
        self.user_extend = UserExtend.objects.create(
            user=self.user,
            regstatue=1,
            simu1='0710000000',
            simu2='0710000001',
        )
        self.business = Interprise.objects.create(
            name='Branch One',
            owner=self.user_extend,
            Intp_code='BR1',
            currencii='TZS',
            Interprise=True,
        )
        self.second_business = Interprise.objects.create(
            name='Branch Two',
            owner=self.user_extend,
            Intp_code='BR2',
            currencii='TZS',
            Interprise=True,
        )

    def test_helper_creates_and_removes_permission_rows_across_branches(self):
        worker = Workers.objects.create(
            Interprise=self.business,
            jina='Test Worker',
            address='Main Street',
            code='123456',
            simu1='0711111111',
            kazi='Cashier',
        )
        linked_account = Anatumia.objects.create(where=self.business)
        worker.diactive = linked_account
        worker.save(update_fields=['diactive'])

        permission = _ensure_interprise_permission(
            worker,
            self.business,
            self.user_extend,
            allow_state=True,
            role='allow',
            admin_user=self.user,
            added=True,
        )

        self.assertIsNotNone(permission)
        self.assertTrue(permission.Allow)
        self.assertFalse(permission.waiter_counter)
        self.assertTrue(
            InterprisePermissions.objects.filter(
                Interprise=self.business,
                user=self.user_extend,
                fanyakazi=worker,
            ).exists()
        )

        waiter_permission = _ensure_interprise_permission(
            worker,
            self.second_business,
            self.user_extend,
            allow_state=True,
            waiter_state=True,
            role='waiter',
            admin_user=self.user,
            added=True,
        )

        self.assertTrue(waiter_permission.Allow)
        self.assertTrue(waiter_permission.waiter_counter)

        _ensure_interprise_permission(
            worker,
            self.second_business,
            self.user_extend,
            allow_state=False,
            waiter_state=False,
            role='waiter',
            admin_user=self.user,
            added=False,
        )

        self.assertFalse(
            InterprisePermissions.objects.filter(
                Interprise=self.second_business,
                user=self.user_extend,
                fanyakazi=worker,
            ).exists()
        )
