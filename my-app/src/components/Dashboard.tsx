import type { Session } from '../types';

interface DashboardProps {
  darkMode: boolean;
  sessions: Session[];
}

export default function Dashboard({ darkMode, sessions }: DashboardProps) {
  const cardBg = darkMode ? 'bg-dark-surface' : 'bg-light-surface';
  const cardBorder = darkMode ? 'border-dark-card' : 'border-gray-200';
  const muted = darkMode ? 'text-dark-muted' : 'text-light-muted';

  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const avgImprovement =
    totalSessions > 0
      ? sessions.reduce((acc, s) => acc + (s.preAnxietyLevel - s.postAnxietyLevel), 0) / totalSessions
      : 0;

  // Last 7 sessions for the chart
  const recentSessions = sessions.slice(-7);

  return (
    <div className="flex-1 flex flex-col gap-6 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Your Progress</h1>
        <p className={muted}>Track how your sessions are helping</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          darkMode={darkMode}
          label="Sessions"
          value={totalSessions.toString()}
          cardBg={cardBg}
          cardBorder={cardBorder}
        />
        <StatCard
          darkMode={darkMode}
          label="Minutes"
          value={totalMinutes.toString()}
          cardBg={cardBg}
          cardBorder={cardBorder}
        />
        <StatCard
          darkMode={darkMode}
          label="Avg. Drop"
          value={avgImprovement > 0 ? `-${avgImprovement.toFixed(1)}` : '—'}
          cardBg={cardBg}
          cardBorder={cardBorder}
        />
      </div>

      {/* Simple bar chart of recent anxiety levels */}
      {recentSessions.length > 0 ? (
        <div className={`rounded-2xl border p-6 space-y-4 ${cardBg} ${cardBorder}`}>
          <h2 className="text-lg font-semibold">Recent Sessions</h2>
          <div className="flex items-end gap-2 h-40">
            {recentSessions.map((s) => {
              const preHeight = (s.preAnxietyLevel / 7) * 100;
              const postHeight = (s.postAnxietyLevel / 7) * 100;
              return (
                <div key={s.id} className="flex-1 flex gap-1 items-end h-full">
                  <div
                    className="flex-1 bg-red-400/60 rounded-t-md transition-all"
                    style={{ height: `${preHeight}%` }}
                    title={`Before: ${s.preAnxietyLevel}`}
                  />
                  <div
                    className="flex-1 bg-green-400/60 rounded-t-md transition-all"
                    style={{ height: `${postHeight}%` }}
                    title={`After: ${s.postAnxietyLevel}`}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 justify-center text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-400/60 inline-block" /> Before
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-400/60 inline-block" /> After
            </span>
          </div>
        </div>
      ) : (
        <div className={`rounded-2xl border p-8 text-center ${cardBg} ${cardBorder}`}>
          <p className="text-4xl mb-3">&#128202;</p>
          <p className="font-semibold text-lg">No sessions yet</p>
          <p className={`${muted}`}>
            Complete your first session to start tracking your progress!
          </p>
        </div>
      )}

      {/* Session history */}
      {sessions.length > 0 && (
        <div className={`rounded-2xl border p-6 space-y-3 ${cardBg} ${cardBorder}`}>
          <h2 className="text-lg font-semibold">Session History</h2>
          {[...sessions].reverse().slice(0, 10).map((s) => {
            const improvement = s.preAnxietyLevel - s.postAnxietyLevel;
            const date = new Date(s.date);
            return (
              <div
                key={s.id}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  darkMode ? 'bg-dark-card/50' : 'bg-light-card'
                }`}
              >
                <div>
                  <p className="font-medium capitalize">{s.techniques.join(', ')}</p>
                  <p className={`text-sm ${muted}`}>
                    {date.toLocaleDateString()} &middot; {s.duration} min
                  </p>
                </div>
                <div
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    improvement > 0
                      ? 'bg-green-500/10 text-green-400'
                      : improvement === 0
                        ? darkMode ? 'bg-dark-card text-dark-muted' : 'bg-light-card text-light-muted'
                        : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {improvement > 0 ? `-${improvement}` : improvement === 0 ? '=' : `+${Math.abs(improvement)}`}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  cardBg,
  cardBorder,
}: {
  darkMode: boolean;
  label: string;
  value: string;
  cardBg: string;
  cardBorder: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 text-center ${cardBg} ${cardBorder}`}>
      <p className="text-2xl font-bold text-calm-400">{value}</p>
      <p className="text-sm font-medium mt-1">{label}</p>
    </div>
  );
}
