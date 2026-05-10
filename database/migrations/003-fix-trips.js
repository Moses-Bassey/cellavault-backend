// Todo: 

// -- Speeds up the GROUP BY riderId + MAX(completedAt) in getStatsByRiderIds
// CREATE INDEX IF NOT EXISTS idx_trips_rider_completed
//   ON trips (riderId, completedAt DESC);