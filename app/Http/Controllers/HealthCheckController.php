<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class HealthCheckController extends Controller
{
    /**
     * Perform application health checks for Kubernetes probes & CI/CD smoke tests.
     */
    public function __invoke(): JsonResponse
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'storage' => $this->checkStorage(),
        ];

        $allHealthy = collect($checks)->every(fn (array $check) => $check['status'] === 'ok');

        $statusCode = $allHealthy ? 200 : 503;

        return response()->json([
            'status' => $allHealthy ? 'healthy' : 'unhealthy',
            'timestamp' => now()->toIso8601String(),
            'environment' => config('app.env'),
            'checks' => $checks,
        ], $statusCode);
    }

    /**
     * Check if the primary database connection is operational.
     *
     * @return array{status: string, message?: string}
     */
    protected function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();

            return ['status' => 'ok'];
        } catch (Throwable $e) {
            Log::error('Health check database error: '.$e->getMessage());

            return [
                'status' => 'failed',
                'message' => 'Unable to connect to database.',
            ];
        }
    }

    /**
     * Check if the storage disk is writable.
     *
     * @return array{status: string, message?: string}
     */
    protected function checkStorage(): array
    {
        try {
            $testFileName = 'health-check-'.uniqid().'.tmp';
            Storage::disk('public')->put($testFileName, 'health');
            Storage::disk('public')->delete($testFileName);

            return ['status' => 'ok'];
        } catch (Throwable $e) {
            Log::error('Health check storage error: '.$e->getMessage());

            return [
                'status' => 'failed',
                'message' => 'Storage disk is not writable.',
            ];
        }
    }
}
