// @ts-ignore
import styles from './Dashboard.module.css';

interface Activity {
  id: number;
  user: string;
  action: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

const activities: Activity[] = [
  { id: 1, user: 'Project Alpha', action: 'Build Successful', date: '2 mins ago', status: 'Completed' },
  { id: 2, user: 'Project Beta', action: 'Deployment', date: '1 hour ago', status: 'Pending' },
  { id: 3, user: 'Legacy Tool', action: 'Security Patch', date: 'Yesterday', status: 'Failed' },
];

const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>System Overview</h1>
        <p>Real-time performance and project status.</p>
      </header>

      <section className={styles.statsGrid}>
        {[
          { label: 'Active Projects', value: '12', color: '#3b82f6' },
          { label: 'Uptime', value: '99.9%', color: '#10b981' },
          { label: 'System Load', value: '24%', color: '#f59e0b' },
        ].map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <p className={styles.statLabel}>{stat.label}</p>
            <p className={styles.statValue} style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2>Recent Activity</h2>
          <button style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}>
            View All
          </button>
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Source</th>
              <th>Action</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((item) => (
              <tr key={item.id} className={styles.row}>
                <td style={{ color: 'white', fontWeight: 500 }}>{item.user}</td>
                <td>{item.action}</td>
                <td style={{ fontSize: '0.875rem' }}>{item.date}</td>
                <td>
                  <span className={`${styles.badge} ${styles[item.status.toLowerCase()]}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;