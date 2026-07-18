import pandas as pd
import numpy as np
import random

np.random.seed(42)
random.seed(42)

def engineer_features(row):
    # expected duration in minutes given distance and speed
    expected_duration = (row["trip_distance"] / row["speed"]) * 60

    # delays: how many minutes over expected
    delays = max(0, int(row["trip_duration"] - expected_duration))

    # behavioral problems = direct from braking events
    behavioral = row["braking_events"]

    # violations = speeding (speed > 60) counts as 1 + harsh turns
    speeding = 1 if row["speed"] > 60 else 0
    violations = speeding + row["harsh_turns"]

    # accidents = 1 if both high braking AND high speed, else 0 (rare)
    accidents = 1 if (row["braking_events"] >= 3 and row["speed"] > 70) else 0

    # rating: start at 5.0, deduct penalties
    rating = 5.0
    rating -= delays       * 0.03   # each delay minute costs 0.03
    rating -= behavioral   * 0.2    # each braking event costs 0.2
    rating -= violations   * 0.15   # each violation costs 0.15
    rating -= accidents    * 0.5    # each accident costs 0.5
    rating += np.random.normal(0, 0.1)  # small noise
    rating = round(max(1.0, min(5.0, rating)), 2)

    return pd.Series({
        "delays_minutes":      delays,
        "behavioral_problems": behavioral,
        "violations_count":    violations,
        "accidents_count":     accidents,
        "rating":              rating,
    })

# load raw data
raw_df = pd.read_csv("../data/raw/raw_telematics.csv")

engineered = raw_df.apply(engineer_features, axis=1)
final_df   = pd.concat([raw_df, engineered], axis=1)

# ── STEP 3: Save final CSV (task schema) ────────────
 
final_df.to_csv("../data/cleaned/driver_profiles.csv", index=False)
print(f"Final driver_profiles.csv saved: {len(final_df)} rows")
print(final_df.head(3))