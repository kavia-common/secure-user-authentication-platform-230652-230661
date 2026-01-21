import React, { useMemo, useState } from "react";
import { PageShell } from "../../components/PageShell/PageShell";
import { Pagination } from "../../components/Pagination/Pagination";
import styles from "./EventsPage.module.css";

type EventItem = {
  id: string;
  title: string;
  dateLabel: string;
};

const MOCK_EVENTS: EventItem[] = [
  { id: "evt_1", title: "Quarterly Review", dateLabel: "Feb 10" },
  { id: "evt_2", title: "Team Offsite Planning", dateLabel: "Mar 02" },
  { id: "evt_3", title: "Product Launch Readiness", dateLabel: "Mar 18" },
  { id: "evt_4", title: "Security Posture Check-in", dateLabel: "Apr 01" },
  { id: "evt_5", title: "Customer Advisory Board", dateLabel: "Apr 17" },
  { id: "evt_6", title: "Design System Sync", dateLabel: "May 06" }
];

// PUBLIC_INTERFACE
export function EventsPage(): React.JSX.Element {
  /** Protected events page with mock data and a pagination placeholder. */
  const [page] = useState(1);
  const pageSize = 5;

  const pagedEvents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return MOCK_EVENTS.slice(start, start + pageSize);
  }, [page, pageSize]);

  return (
    <PageShell title="Events" subtitle="Protected list of events (placeholder data).">
      <ul className={styles.list} aria-label="Events list">
        {pagedEvents.map((evt) => (
          <li key={evt.id} className={styles.item}>
            <div className={styles.itemTitle}>{evt.title}</div>
            <div className={styles.itemMeta}>{evt.dateLabel}</div>
          </li>
        ))}
      </ul>

      <Pagination page={page} pageSize={pageSize} totalItems={MOCK_EVENTS.length} />
    </PageShell>
  );
}
