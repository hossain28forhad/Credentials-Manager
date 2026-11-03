<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        Role::firstOrCreate([
            'name' => 'super-admin',
            'guard_name' => 'web',
        ]);

        Role::firstOrCreate([
            'name' => 'manager',
            'guard_name' => 'web',
        ]);

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('Admin@123456'),
            ]
        );

        $admin->assignRole('super-admin');
    }
}