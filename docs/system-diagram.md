# System Diagram

```mermaid
flowchart LR
  A["Lead sources<br/>forms, missed calls, DMs, GBP"] --> B["Lead intake table"]
  B --> C["Risk scoring<br/>age, value, stage, source"]
  C --> D["Daily follow-up queue"]
  D --> E["Draft response<br/>email, SMS, call note"]
  D --> F["Owner task<br/>deadline and next step"]
  E --> G["Client tool<br/>Gmail, Sheets, Airtable, CRM"]
  F --> G
  G --> H["Weekly report<br/>open, booked, stale, recovered"]
```

## Implementation Notes

- The prototype uses static fictional data so it can be reviewed without credentials.
- A client version can start with Google Sheets or Airtable before adding CRM integrations.
- The first paid build should stay narrow: one intake source, one queue, three to five follow-up rules, and one weekly report.
