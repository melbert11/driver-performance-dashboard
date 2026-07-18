import pandas as pd
import numpy as np
import random

np.random.seed(42)
random.seed(42)

# ── CONFIG ──────────────────────────────────────────
N            = 500
drivers      = {f"D{str(i).zfill(3)}": f"Driver_{i}" for i in range(1, 21)}
driver_ids   = list(drivers.keys())
routes       = [f"R{i}" for i in range(1, 6)]
vehicles     = [f"V{i}" for i in range(1, 11)]
shifts       = ["morning", "afternoon", "night"]
dates        = pd.date_range("2025-01-01", "2025-03-31", freq="D")

# ── STEP 1: Generate raw telematics data ────────────
raw_rows = []
for _ in range(N):
    driver_id   = random.choice(driver_ids)
    date        = random.choice(dates)
    # telematics fields
    trip_distance  = round(random.uniform(5, 50), 1)       # km
    trip_duration  = int(random.uniform(15, 90))            # minutes
    speed          = round(random.uniform(20, 90), 1)       # km/h avg
    braking_events = np.random.poisson(1.5)                 # sudden brakes
    harsh_turns    = np.random.poisson(1.0)                 # sharp turns

    raw_rows.append({
        "driver_id":      driver_id,
        "driver_name":    drivers[driver_id],
        "date":           date.strftime("%Y-%m-%d"),
        "route_id":       random.choice(routes),
        "vehicle_id":     random.choice(vehicles),
        "shift":          random.choice(shifts),
        "trip_distance":  trip_distance,
        "trip_duration":  trip_duration,
        "speed":          speed,
        "braking_events": int(braking_events),
        "harsh_turns":    int(harsh_turns),
    })

raw_df = pd.DataFrame(raw_rows)
raw_df.to_csv("../data/raw/raw_telematics.csv", index=False)
print(f"Raw telematics CSV saved: {len(raw_df)} rows")
print(raw_df.head(3))