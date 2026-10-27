<?php

use Illuminate\Support\Facades\DB;

test('health check returns 200 ok when all systems are healthy', function () {
    $response = $this->get(route('health'));

    $response->assertOk()
        ->assertJson([
            'status' => 'healthy',
            'checks' => [
                'database' => ['status' => 'ok'],
                'storage' => ['status' => 'ok'],
            ],
        ]);
});

test('health check returns 503 service unavailable when database is unreachable', function () {
    // Force database connection failure
    DB::shouldReceive('connection->getPdo')
        ->andThrow(new Exception('Database connection lost'));

    $response = $this->get(route('health'));

    $response->assertStatus(503)
        ->assertJson([
            'status' => 'unhealthy',
            'checks' => [
                'database' => [
                    'status' => 'failed',
                    'message' => 'Unable to connect to database.',
                ],
            ],
        ]);
});
