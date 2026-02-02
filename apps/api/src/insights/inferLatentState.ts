motivation =
  avg(habit_completion_7d) * 0.6 +
  avg(mit_completion_7d) * 0.4;

fatigue =
  (1 - avg(sleep_quality_7d)) * 0.7 +
  (avg(overcommitment_7d)) * 0.3;
