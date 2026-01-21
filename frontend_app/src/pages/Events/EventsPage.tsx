import React from "react";
import { PageShell } from "../../components/PageShell/PageShell";
import styles from "./EventsPage.module.css";

type EventItem = {
  id: string;
  title: string;
  dateLabel: string;
};

const MOCK_EVENTS: EventItem[] = [
  { id: "evt_1", title: "Quarterly Review", dateLabel: "Feb 10" },
  { id: "evt_2", title: "Team Offsite Planning", dateLabel: "Mar 02" },
  { id: "evt_3", title: "Product Launch Readiness", dateLabel: "Mar 18" }
];

// PUBLIC_INTERFACE
export function EventsPage(): React.JSX.Element {
  /** Protected events placeholder page. */
  return (
    <PageShell title="Events" subtitle="Protected list of events (placeholder data).">
      <ul className={styles.list}>
        {MOCK_EVENTS.map((evt) => (
          <li key={evt.id} className={styles.item}>
            <div className={styles.itemTitle}>{evt.title}</div>
            <div className={styles.itemMeta}>{evt.dateLabel}</div>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
