<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

    public function up(): void
    {
        Schema::table('credential_activities', function (Blueprint $table) {
            $table->string('credential_title')->nullable();
            $table->string('website_name')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('credential_activities', function (Blueprint $table) {
            $table->dropColumn([
                'credential_title',
                'website_name',
            ]);
        });
    }
};
