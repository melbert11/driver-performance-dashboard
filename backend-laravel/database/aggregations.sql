-- DRIVER PROFILE (grouped by driver_id) 
SELECT 
    driver_id,
    driver_name,
    COUNT(*) AS trip_count,
    SUM(delays_minutes) AS total_delays,
    AVG(delays_minutes) AS avg_delay,
    SUM(violations_count) AS total_violations,
    SUM(aggressive_incidents_count) AS total_aggressive_incidents,
    AVG(rating) AS avg_rating
FROM driver_profiles
GROUP BY driver_id, driver_name
ORDER BY avg_rating DESC;


-- WEEKLY SUMMARY (grouped by week)  
SELECT
    date_trunc('week', date) AS week,
    COUNT(*) AS trip_count,
    SUM(delays_minutes) AS total_delays,
    AVG(delays_minutes) AS avg_delay,
    SUM(violations_count) AS total_violations,
    SUM(aggressive_incidents_count) AS total_aggressive_incidents,
    AVG(rating) AS avg_rating
FROM driver_profiles
GROUP BY week
ORDER BY week;


-- BY SHIFT  
SELECT
    shift,
    COUNT(*) AS trip_count,
    AVG(delays_minutes) AS avg_delay,
    SUM(violations_count) AS total_violations,
    SUM(aggressive_incidents_count) AS total_aggressive_incidents,
    AVG(rating) AS avg_rating
FROM driver_profiles
GROUP BY shift
ORDER BY avg_rating DESC;