# CRM MVP Release Notes

## Status
Offline-first CRM MVP is completed and fully verified.

## Implemented Features
- **Dexie v3 schema migration**: Safe automated migrations for older client structures.
- **Client CRUD**: Create, read, edit, and soft delete clients.
- **Recycle Bin**: Recover or permanently remove soft-deleted client data.
- **Search, Filters & Sorting**: Filter by status/service, search client notes/fields, and sort by budget/name/date.
- **Dashboard Stats**: Active clients, leads, pending synchronization, and total budget parses (handling `2k`, `od 1500`, range formats).
- **Client Tasks**: To-do checklist nested under individual clients with due dates.
- **Activity Timeline**: Notes, calls, meetings, proposals, and automatic logs for client status changes.
- **CSV & JSON Tools**:
  - Export active clients to CSV.
  - Full CRM database JSON backup export and schema-validating JSON backup import with duplicate prevention.
- **SyncManager**: Offline-ready component displaying connection status (online, offline, syncing, error) and manual sync trigger.
- **API Skeletons**: Route skeletons returning `501 Not Implemented` for `/api/crm/*`.

## Test Results
- **Unit & Integration tests**: 120 passing (Vitest).
- **E2E browser tests**: 76 passing (Playwright).
- **Production build**: Successfully compiled.

## Known Limitations
- Sync is simulated through `CRM_SIMULATED_SYNC = true`.
- API routes return 501 placeholders.
- No production user-level access control yet.
- Data is local to the browser's IndexedDB.

## Next Phase
Backend sync and authenticated multi-device CRM access.
