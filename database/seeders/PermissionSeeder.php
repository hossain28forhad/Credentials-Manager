<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'dashboard.view',

            'manager.view',
            'manager.create',
            'manager.edit',
            'manager.delete',

            'website.view',
            'website.create',
            'website.edit',
            'website.delete',

            'credential.view',
            'credential.create',
            'credential.edit',
            'credential.delete',
            'credential.copy',
            'credential.password.view',

            'activity.view',

            'login-activity.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $superAdmin = Role::findByName('super-admin', 'web');

        // Super Admin gets all permissions
        $superAdmin->givePermissionTo(Permission::all());

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
