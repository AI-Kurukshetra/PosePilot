alter table public.practice_sessions drop constraint if exists practice_sessions_pose_key_check;

alter table public.practice_sessions
  add constraint practice_sessions_pose_key_check
  check (pose_key in ('warrior', 'armpress', 'chair'));
