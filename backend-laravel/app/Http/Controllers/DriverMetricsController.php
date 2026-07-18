<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DriverMetricsController extends Controller
{
    // WEEKLY SUMMARY 
    public function weeklySummary(Request $request)
    {
        $start = $request->query('start', '2025-01-01');
        $end   = $request->query('end',   '2025-03-31');

        $cacheKey = "weekly_summary:{$start}:{$end}";

        $data = Cache::remember($cacheKey, 300, function () use ($start, $end) {
            return DB::table('driver_profiles')
                ->select(
                    DB::raw("date_trunc('week', date) as week"),
                    DB::raw('COUNT(*) as trip_count'),
                    DB::raw('SUM(delays_minutes) as total_delays'),
                    DB::raw('SUM(violations_count) as total_violations'),
                    DB::raw('SUM(aggressive_incidents_count) as total_aggressive_incidents'),
                    DB::raw('AVG(rating) as avg_rating')
                )
                ->whereBetween('date', [$start, $end])
                ->groupBy('week')
                ->orderBy('week')
                ->get();
        });

        return response()->json($data);
    }

    // DRIVER PROFILES 
    public function driverProfiles(Request $request)
    {
        $sort = $request->query('sort', 'avg_rating');
        $order = $request->query('order', 'desc');
        $limit = $request->query('limit', null);
        $filter = $request->query('filter', null);
        $start = $request->query('start', '2025-01-01');
        $end = $request->query('end', '2025-03-31');

        $cacheKey = "driver_profiles:{$sort}:{$order}:{$limit}:{$filter}:{$start}:{$end}";

        $data = Cache::remember($cacheKey, 300, function () use ($sort, $order, $limit, $filter, $start, $end) {
            $query = DB::table('driver_profiles')
                ->select(
                    'driver_id',
                    'driver_name',
                    DB::raw('COUNT(*) as trip_count'),
                    DB::raw('AVG(delays_minutes) as avg_delay'),
                    DB::raw('SUM(violations_count) as total_violations'),
                    DB::raw('SUM(aggressive_incidents_count) as total_aggressive_incidents'),
                    DB::raw('AVG(rating) as avg_rating')
                )
                ->whereBetween('date', [$start, $end])
                ->groupBy('driver_id', 'driver_name');

            // filter: interventions = drivers with 2+ accidents
            if ($filter === 'interventions') {
                $query->having(DB::raw('SUM(aggressive_incidents_count)'), '>=', 2);
            }

            // sort
            $allowedSorts = ['avg_rating', 'avg_delay', 'total_violations', 'total_aggressive_incidents', 'trip_count'];
            $sortCol = in_array($sort, $allowedSorts) ? $sort : 'avg_rating';
            $query->orderBy(DB::raw($sortCol), $order === 'asc' ? 'asc' : 'desc');

            // limit (for top performers)
            if ($limit) {
                $query->limit((int) $limit);
            }

            return $query->get();
        });

        return response()->json($data);
    }

    // SINGLE DRIVER DETAIL
    public function driverDetail(Request $request, $driverId)
    {
        $start = $request->query('start', '2025-01-01');
        $end   = $request->query('end',   '2025-03-31');

        $cacheKey = "driver_detail:{$driverId}:{$start}:{$end}";

        $data = Cache::remember($cacheKey, 300, function () use ($driverId, $start, $end) {
            return DB::table('driver_profiles')
                ->select(
                    'driver_id',
                    'driver_name',
                    'date',
                    'shift',
                    'delays_minutes',
                    'violations_count',
                    'aggressive_incidents_count',
                    'rating'
                )
                ->where('driver_id', $driverId)
                ->whereBetween('date', [$start, $end])
                ->orderBy('date')
                ->get();
        });

        return response()->json($data);
    }

    // BY SHIFT 
    public function byShift(Request $request)
    {
        $start = $request->query('start', '2025-01-01');
        $end   = $request->query('end', '2025-03-31');

        $cacheKey = "by_shift:{$start}:{$end}";

        $data = Cache::remember($cacheKey, 300, function () use ($start, $end) {
            return DB::table('driver_profiles')
                ->select(
                    'shift',
                    DB::raw('AVG(delays_minutes) as avg_delay'),
                    DB::raw('SUM(violations_count) as total_violations'),
                    DB::raw('SUM(aggressive_incidents_count) as total_aggressive_incidents'),
                    DB::raw('AVG(rating) as avg_rating')
                )
                ->whereBetween('date', [$start, $end])
                ->groupBy('shift')
                ->orderBy('avg_rating', 'desc')
                ->get();
        });

        return response()->json($data);
    }

    // DRIVER LIST
    public function driverList()
    {
        $data = Cache::remember('driver_list', 600, function () {
            return DB::table('driver_profiles')
                ->select('driver_id', 'driver_name')
                ->distinct()
                ->orderBy('driver_id')
                ->get();
        });

        return response()->json($data);
    }
}
