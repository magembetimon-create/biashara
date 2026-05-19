from django.urls import path
from . import views

urlpatterns = [
    path('all', views.all_staff, name='all_staff'),
    path('add', views.add_staff, name='add_staff'),
    path('toggle-shift-management', views.set_shift_management_status, name='toggle_shift_management'),
    path('view', views.view_staff, name='view_staff'),
    path('with-access', views.staff_with_access, name='staff_with_access'),
    path('waiters', views.waiters, name='staff_waiters'),
    path('shifts', views.staff_shifts, name='staff_shifts'),
    path('shifts/new', views.new_shift, name='staff_new_shift'),
    path('shifts/view', views.shift_view, name='staff_shift_view'),
    path('shifts/actor-sales', views.shift_actor_sales, name='staff_shift_actor_sales'),
    path('shifts/close', views.close_shift, name='staff_close_shift'),
    path('shifts/print', views.print_shift, name='staff_print_shift'),
    path('grant-role', views.grant_role, name='staff_grant_role'),
    path('general-permissions', views.update_general_permissions, name='staff_general_permissions'),
]
