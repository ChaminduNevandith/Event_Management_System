# Feature Progress (Traceability Matrix)

| Feature ID | Feature | Status | Notes |
|---|---|---|---|
| 31.1.1 | User registration | Not started | |
| 31.1.2 | Email verification | Not started | |
| 31.1.3 | Secure login | Not started | |
| 31.1.4 | Social login | Deferred | Optional per PRD |
| 31.1.5 | Password strength guidance | Not started | |
| 31.1.6 | Show or hide password | Not started | |
| 31.1.7 | Forgot password | Not started | |
| 31.1.8 | Change password | Done | |
| 31.1.9 | Active session list | Not started | |
| 31.1.10 | Remote session logout | Not started | |
| 31.1.11 | Optional multi-factor authentication | Deferred | |
| 31.1.12 | Optional passkey support | Deferred | |
| 31.1.13 | Automatic session expiry | Not started | |
| 31.1.14 | Account deactivation | Not started | |
| 31.1.15 | Account deletion | Not started | |
| 31.2.1 | Profile photo | Done | |
| 31.2.2 | Display name | Done | |
| 31.2.3 | Unique username | Done | |
| 31.2.4 | Short biography | Done | |
| 31.2.5 | Home timezone | Done | |
| 31.2.6 | Preferred currency | Done | |
| 31.2.7 | Measurement units | Done | |
| 31.2.8 | Date and time format | Done | |
| 31.2.9 | Language preference | Done | |
| 31.2.10 | Light and dark themes | Done | |
| 31.2.11 | Reduced motion | Done | |
| 31.2.12 | Travel interests | Done | |
| 31.2.13 | Travel pace | Done | |
| 31.2.14 | Dietary preferences | Done | |
| 31.2.15 | Accessibility preferences | Done | |
| 31.2.16 | Privacy settings | Done | |
| 31.3.1 | Friend search | Done | |
| 31.3.2 | Friend request | Done | |
| 31.3.3 | Accept friend request | Done | |
| 31.3.4 | Decline friend request | Done | |
| 31.3.5 | Cancel sent request | Not started | |
| 31.3.6 | Pending request list | Done | |
| 31.3.7 | Friends list | Done | |
| 31.3.8 | Unfriend user | Done | |
| 31.3.9 | Mute friend activity | Not started | |
| 31.3.10 | Block user | Done | |
| 31.3.11 | Report user | Not started | |
| 31.3.12 | Travel circles | Done | |
| 31.3.13 | Circle name and image | Done | |
| 31.3.14 | Circle membership management | Done | |
| 31.3.15 | Shared trip history | Done | |
| 31.3.16 | Optional presence status | Done | |
| 31.4.1 | In-app invitation | Done | |
| 31.4.2 | Email invitation | Done | |
| 31.4.3 | WhatsApp invitation | Done | |
| 31.4.4 | Copy invitation link | Done | |
| 31.4.5 | QR code invitation | Done | |
| 31.4.6 | Personal invitation note | Done | |
| 31.4.7 | Role selection | Done | |
| 31.4.8 | Invitation expiry | Done | |
| 31.4.9 | Usage limit | Done | |
| 31.4.10 | Approval-required link | Done | |
| 31.4.11 | Invitation preview | Done | |
| 31.4.12 | Accept invitation | Done | |
| 31.4.13 | Decline invitation | Done | |
| 31.4.14 | Revoke invitation | Done | |
| 31.4.15 | Invitation status tracking | Done | |
| 31.4.16 | Duplicate invitation prevention | Done | |
| 31.4.17 | Return after registration | Done | |
| 31.5.1 | Quick trip creation | Done | |
| 31.5.2 | Trip title | Done | |
| 31.5.3 | Trip cover image | Done | |
| 31.5.4 | Approximate dates | Done | |
| 31.5.5 | Fixed dates | Done | |
| 31.5.6 | Trip timezone | Done | |
| 31.5.7 | Trip description | Done | |
| 31.5.8 | Trip status | Done | |
| 31.5.9 | Trip overview dashboard | Not started | |
| 31.5.10 | Trip readiness checklist | Not started | |
| 31.5.11 | Trip progress indicator | Not started | |
| 31.5.12 | Trip ownership | Done | |
| 31.5.13 | Transfer ownership | Done | |
| 31.5.14 | Trip roles | Done | |
| 31.5.15 | Member management | Done | |
| 31.5.16 | Trip activity history | Done | |
| 31.5.17 | Duplicate trip | Not started | |
| 31.5.18 | Archive trip | Done | |
| 31.5.19 | Restore trip | Done | |
| 31.5.20 | Cancel trip | Done | |
| 31.5.21 | Delete trip | Done | |

## Phase 4: Destinations and Places (Sprint 12)
**Status:** Completed 🟢

### ✅ 1. Sprint 12: Destinations & Saved Places
- [x] Create `Destination` and `Place` Prisma models.
- [x] Build Kanban-style Destination Candidate Board (Proposed/Approved/Rejected).
- [x] Add upvote/downvote actions for destinations.
- [x] Build Saved Places grid with filtering and categorization.
- [x] Create API endpoints and schemas for Destinations and Places.

| 31.6.1 | Destination search | Done | |
| 31.6.2 | Manual destination | Done | |
| 31.6.3 | Destination candidate board | Done | |
| 31.6.4 | Destination cards | Done | |
| 31.6.5 | Multi-destination trip | Done | |
| 31.6.6 | Destination ordering | Done | |
| 31.6.7 | Destination date range | Done | |
| 31.6.8 | Saved places | Done | |
| 31.6.9 | Place categories | Done | |
| 31.6.10 | Place notes | Done | |
| 31.6.11 | Place tags | Done | |
| 31.6.12 | Place images | Done | |
| 31.6.13 | Duplicate place detection | Not started | |
| 31.6.14 | Destination comparison | Not started | |
| 31.6.15 | Destination suggestion | Not started | |
| 31.6.16 | Destination approval | Not started | |
## Phase 5: Decision Room and Polling (Sprint 13)
**Status:** Completed 🟢

### ✅ 1. Sprint 13: Decision Room
- [x] Create `Poll`, `PollOption`, `PollVote` Prisma models.
- [x] Build Decision Room frontend.
- [x] Create API endpoints for creating polls, voting, and real-time visualization.
- [x] Implement voting rules (single choice vs multiple choice).

| 31.7.1 | Decision room | Done | |
| 31.7.2 | Create proposal | Done | |
| 31.7.3 | Single-choice poll | Done | |
| 31.7.4 | Multiple-choice poll | Done | |
| 31.7.18 | Decision result | Done | |

## Phase 6: Itinerary & Scheduling (Sprint 14)
**Status:** Completed 🟢

### ✅ 1. Sprint 14: Daily Itinerary
- [x] Create `ItineraryItem` Prisma model.
- [x] Build Daily Itinerary frontend view with day grouping and timeline visual.
- [x] Create API endpoints for CRUD itinerary items.
- [x] Map UI icons/colors to standard event types (FLIGHT, TRAIN, ACCOMMODATION, etc.).

| 31.8.1 | Daily itinerary | Done | |
| 31.8.3 | List view | Done | |
| 31.8.5 | Create itinerary item | Done | |
| 31.8.6 | Event types | Done | |
| 31.8.7 | Start and end time | Done | |
| 31.8.10 | Delete item | Done | |
| 31.8.2 | Timeline view | Not started | |
| 31.8.4 | Calendar view | Not started | |
| 31.8.5 | Map split view | Not started | |
| 31.8.6 | Unscheduled ideas | Not started | |
| 31.8.8 | Duration and buffer | Not started | |
| 31.8.9 | All-day item | Not started | |
| 31.8.10 | Multi-day item | Not started | |
| 31.8.11 | Drag and drop | Not started | |
| 31.8.12 | Keyboard move controls | Not started | |
| 31.8.13 | Undo itinerary change | Not started | |
| 31.8.14 | Overlap detection | Not started | |
| 31.8.15 | Transfer-time warning | Not started | |
| 31.8.16 | Timezone warning | Not started | |
| 31.8.17 | Opening-hours warning | Not started | |
| 31.8.18 | Alternative activity | Not started | |
| 31.8.19 | Locked itinerary item | Not started | |
| 31.8.20 | Item assignees | Not started | |
| 31.8.21 | Item attendees and RSVP | Not started | |
| 31.8.22 | Event capacity | Not started | |
| 31.8.23 | Recurring preparation event | Not started | |
| 31.8.24 | Event-specific chat | Not started | |
| 31.8.25 | Event cancellation | Not started | |
| 31.8.26 | Calendar export | Not started | |
| 31.8.27 | Calendar import | Not started | |
| 31.8.28 | External free/busy connection | Not started | |
| 31.8.29 | Change summary | Not started | |

## Phase 7: Accommodations & Transport (Sprints 15 & 16)
**Status:** Completed 🟢

### ✅ 1. Sprints 15 & 16: Accommodations & Transport
- [x] Create `Accommodation` and `Transport` Prisma models.
- [x] Build backend APIs for CRUD operations.
- [x] Integrate Frontend UI tabs on trip dashboard.

| 31.9.1 | Accommodation record | Done | |
| 31.9.2 | Accommodation candidate list | Not started | |
| 31.9.3 | Stay comparison | Not started | |
| 31.9.4 | Check-in and check-out | Done | |
| 31.9.5 | Property address and map | Done | |
| 31.9.6 | Property contact details | Done | |
| 31.9.7 | Booking reference | Done | |
| 31.9.8 | Booking document | Not started | |
| 31.9.9 | Cancellation deadline | Not started | |
| 31.9.10 | Deposit record | Not started | |
| 31.9.11 | Room types | Not started | |
| 31.9.12 | Room allocation | Not started | |
| 31.9.13 | Stay coverage warning | Not started | |
| 31.9.14 | Arrival transport link | Not started | |
| 31.9.15 | Stay itinerary link | Not started | |
| 31.10.1 | Flight record | Done | |
| 31.10.2 | Train record | Done | |
| 31.10.3 | Bus record | Done | |
| 31.10.4 | Ferry record | Done | |
| 31.10.5 | Taxi or ride record | Done | |
| 31.10.6 | Rental vehicle record | Done | |
| 31.10.7 | Private vehicle | Done | |
| 31.10.8 | Walking or local transit leg | Not started | |
| 31.10.9 | Multi-leg journey | Not started | |
| 31.10.10 | Origin and destination | Done | |
| 31.10.11 | Local time and timezone | Done | |
| 31.10.12 | Traveler assignment | Not started | |
| 31.10.13 | Seat assignment | Done | |
| 31.10.14 | Baggage information | Not started | |
| 31.10.15 | Booking reference and files | Done | |
| 31.10.16 | Transport status | Not started | |
| 31.10.17 | Status source and time | Not started | |
| 31.10.18 | Connection warning | Not started | |
| 31.10.19 | External booking link | Not started | |
| 31.10.20 | Navigation link | Not started | |

## Phase 8: Interactive Trip Map (Sprint 18)
**Status:** In Progress 🟡

### 🚧 Sprint 18: Map View
- [ ] Install leaflet and react-leaflet
- [ ] Build Frontend Map View with markers

| 31.11.1 | Interactive trip map | Done | |
| 31.11.2 | Numbered itinerary pins | Done | |
| 31.11.3 | Map clustering | Deferred | |
| 31.11.4 | Map filters | Deferred | |
| 31.11.5 | Map and itinerary synchronization | Deferred | |
| 31.11.6 | Place search on map | Deferred | |
| 31.11.7 | Route estimate | Deferred | |
| 31.11.8 | Travel-mode routes | Deferred | |
| 31.11.9 | Route optimization preview | Deferred | |
| 31.11.10 | Old and new route comparison | Deferred | |
| 31.11.11 | Manual travel duration | Deferred | |
| 31.11.12 | Weather summary | Deferred | |
| 31.11.13 | Weather refresh time | Deferred | |
| 31.11.14 | Stale weather warning | Deferred | |
| 31.11.15 | Local destination time | Deferred | |
| 31.11.16 | Map attribution | Deferred | |

## Phase 9: Trip Budget & Ledger (Sprint 17)
**Status:** In Progress 🟡

### 🚧 Sprint 17: Trip Budget
- [ ] Create `ExpensesModule` in NestJS
- [ ] Build Frontend Budget tab
- [ ] Implement group balance calculations

| 31.12.1 | Trip budget | Done | |
| 31.12.2 | Per-person budget | Not started | |
| 31.12.3 | Category budgets | Not started | |
| 31.12.4 | Destination budgets | Not started | |
| 31.12.5 | Daily budget | Not started | |
| 31.12.6 | Planned amount | Not started | |
| 31.12.7 | Committed amount | Not started | |
| 31.12.8 | Actual amount | Not started | |
| 31.12.9 | Budget progress | Not started | |
| 31.12.10 | Budget warning | Not started | |
| 31.12.11 | Contribution goal | Not started | |
| 31.12.12 | Contribution pledge | Not started | |
| 31.12.13 | Contribution record | Not started | |
| 31.12.14 | Private budget band | Not started | |
| 31.12.15 | Add expense | Done | |
| 31.12.16 | Multiple currencies | Not started | |
| 31.12.17 | Stored exchange rate | Not started | |
| 31.12.18 | Manual exchange rate | Not started | |
| 31.12.19 | Single payer | Done | |
| 31.12.20 | Multiple payers | Not started | |
| 31.12.21 | Equal split | Done | |
| 31.12.22 | Exact amount split | Not started | |
| 31.12.23 | Percentage split | Not started | |
| 31.12.24 | Share-based split | Not started | |
| 31.12.25 | Itemized split | Not started | |
| 31.12.26 | Excluded participant | Done | |
| 31.12.27 | Couple or unit split | Not started | |
| 31.12.28 | Expense category | Done | |
| 31.12.29 | Receipt attachment | Not started | |
| 31.12.30 | Expense comments | Not started | |
| 31.12.31 | Expense edit history | Not started | |
| 31.12.32 | Expense reversal | Not started | |
| 31.12.33 | Personal balance | Done | |
| 31.12.34 | Group balance | Done | |
| 31.12.35 | Simplified settlements | Not started | |
| 31.12.36 | External settlement record | Not started | |
| 31.12.37 | Settlement confirmation | Not started | |
| 31.12.38 | Close ledger | Not started | |
| 31.12.39 | Reopen ledger | Not started | |
| 31.12.40 | Financial export | Not started | |
## Phase 10: Trip Tasks & Checklists (Sprint 19)
**Status:** In Progress 🟡

### 🚧 Sprint 19: Tasks & Checklists
- [ ] Create `Task` Prisma Model
- [ ] Build `TasksModule` in Backend
- [ ] Build Frontend Tasks Dashboard

| 31.13.1 | Trip tasks | Done | |
| 31.13.2 | Task assignment | Done | |
| 31.13.3 | Task priority | Done | |
| 31.13.4 | Task status | Done | |
| 31.13.5 | Task reminder | Deferred | |
| 31.13.6 | Packing list | Done | |
| 31.13.7 | Booking checklist | Done | |
| 31.13.8 | Visa and document checklist | Done | |
| 31.13.9 | Shopping list | Done | |
| 31.13.10 | Reusable checklist template | Deferred | |
| 31.13.11 | Secure file upload | Not started | |
| 31.13.12 | File preview | Not started | |
| 31.13.13 | File visibility | Not started | |
| 31.13.14 | File expiry | Not started | |
| 31.13.15 | Emergency contacts | Not started | |
| 31.13.16 | Emergency meeting point | Not started | |
| 31.13.17 | Essential local numbers | Not started | |
| 31.13.18 | Offline essential files | Not started | |
| 31.13.19 | Redacted trip summary | Not started | |
| 31.13.20 | Printable travel pack | Not started | |
## Phase 11: Trip Group Chat (Sprint 20)
**Status:** Completed 🟢

### ✅ Sprint 20: Group Chat
- [x] Implement `ChatModule` Backend
- [x] Build Frontend Chat UI
- [x] Test Socket.io real-time chat

| 31.14.1 | Trip group chat | Done | |
| 31.14.2 | Contextual comments | Deferred | |
| 31.14.3 | Threaded replies | Deferred | |
| 31.14.4 | User mentions | Not started | |
| 31.14.5 | Message reactions | Not started | |
| 31.14.6 | Edit message | Not started | |
| 31.14.7 | Delete message | Not started | |
| 31.14.8 | Pin message | Not started | |
| 31.14.9 | Share links | Not started | |
| 31.14.10 | Chat attachments | Not started | |
| 31.14.11 | Chat search | Not started | |
| 31.14.12 | Typing indicator | Not started | |
| 31.14.13 | Read status | Not started | |
| 31.14.14 | Live collaborator presence | Not started | |
| 31.14.15 | Create item from message | Not started | |
| 31.14.16 | Concurrent edit warning | Not started | |
| 31.14.17 | Change comparison | Not started | |
| 31.14.18 | Trip activity feed | Not started | |
| 31.15.1 | Notification inbox | Not started | |
| 31.15.2 | In-app notification | Not started | |
| 31.15.3 | Email notification | Not started | |
| 31.15.4 | Web push notification | Not started | |
| 31.15.5 | Invitation notification | Not started | |
| 31.15.6 | Friend request notification | Not started | |
| 31.15.7 | Mention notification | Not started | |
| 31.15.8 | Vote notification | Not started | |
| 31.15.9 | Schedule change notification | Not started | |
| 31.15.10 | Booking deadline reminder | Not started | |
| 31.15.11 | Task reminder | Not started | |
| 31.15.12 | Budget notification | Not started | |
| 31.15.13 | Critical travel alert | Not started | |
| 31.15.14 | Notification deep link | Not started | |
| 31.15.15 | Actionable notification | Not started | |
| 31.15.16 | Mark as read | Not started | |
| 31.15.17 | Notification archive | Not started | |
| 31.15.18 | Notification preferences | Not started | |
| 31.15.19 | Quiet hours | Not started | |
| 31.15.20 | Notification digest | Not started | |
| 31.15.21 | Duplicate prevention | Not started | |
| 31.16.1 | Responsive layout | In progress | |
| 31.16.2 | Installable web app | Not started | |
| 31.16.3 | Mobile travel mode | Not started | |
| 31.16.4 | Offline app shell | Not started | |
| 31.16.5 | Offline itinerary | Not started | |
| 31.16.6 | Offline accommodation | Not started | |
| 31.16.7 | Offline transport | Not started | |
| 31.16.8 | Offline documents | Not started | |
| 31.16.9 | Offline checklist updates | Not started | |
| 31.16.10 | Offline expense entry | Not started | |
| 31.16.11 | Offline status banner | Not started | |
| 31.16.12 | Last synchronization time | Not started | |
| 31.16.13 | Visible sync queue | Not started | |
| 31.16.14 | Automatic reconnection | Not started | |
| 31.16.15 | Duplicate-safe synchronization | Not started | |
| 31.16.16 | Conflict detection | Not started | |
| 31.16.17 | Conflict resolution | Not started | |
| 31.16.18 | Offline storage controls | Not started | |
| 31.16.19 | App update notice | Not started | |
| 31.17.1 | Draft itinerary generation | Deferred | |
| 31.17.2 | Group-aware suggestions | Deferred | |
| 31.17.3 | Saved-place recommendations | Deferred | |
| 31.17.4 | Route improvement suggestion | Deferred | |
| 31.17.5 | Schedule conflict repair | Deferred | |
| 31.17.6 | Chat summary | Deferred | |
| 31.17.7 | Action extraction | Deferred | |
| 31.17.8 | Preference explanation | Deferred | |
| 31.17.9 | Cost estimation assistance | Deferred | |
| 31.17.10 | Trip readiness suggestions | Deferred | |
| 31.17.11 | Stale information warning | Deferred | |
| 31.17.12 | Human approval | Deferred | |
| 31.17.13 | Locked-item protection | Deferred | |
| 31.17.14 | AI feedback | Deferred | |
| 31.17.15 | Disable AI personalization | Deferred | |
| 31.18.1 | Modern visual design | In progress | |
| 31.18.2 | Desktop command center | Not started | |
| 31.18.3 | Mobile bottom navigation | Not started | |
| 31.18.4 | Loading skeletons | Not started | |
| 31.18.5 | Custom loading animation | Not started | |
| 31.18.6 | Drag lift animation | Not started | |
| 31.18.7 | Drop preview | Not started | |
| 31.18.8 | Smooth item movement | Not started | |
| 31.18.9 | Success animation | Not started | |
| 31.18.10 | Route animation | Not started | |
| 31.18.11 | Realtime change highlight | Not started | |
| 31.18.12 | Optional celebration | Not started | |
| 31.18.13 | Reduced-motion mode | Not started | |
| 31.18.14 | Tooltips | Not started | |
| 31.18.15 | Help popovers | Not started | |
| 31.18.16 | Inline validation | Not started | |
| 31.18.17 | Error summary | Not started | |
| 31.18.18 | Custom success messages | Not started | |
| 31.18.19 | Undo action | Not started | |
| 31.18.20 | Empty states | Not started | |
| 31.18.21 | Permission states | Not started | |
| 31.18.22 | Keyboard navigation | In progress | |
| 31.18.23 | Visible keyboard focus | In progress | |
| 31.18.24 | Screen-reader labels | Not started | |
| 31.18.25 | Accessible drag and drop | Not started | |
| 31.18.26 | Accessible maps | Not started | |
| 31.18.27 | Accessible charts | Not started | |
| 31.18.28 | Color-independent states | Not started | |
| 31.18.29 | Large touch targets | Not started | |
| 31.18.30 | Zoom and reflow | Not started | |
| 31.19.1 | Admin dashboard | Not started | |
| 31.19.2 | User support lookup | Not started | |
| 31.19.3 | Abuse report queue | Not started | |
| 31.19.4 | Invite rate limiting | Not started | |
| 31.19.5 | Login rate limiting | Not started | |
| 31.19.6 | Search anti-enumeration | Not started | |
| 31.19.7 | Server-side authorization | Not started | |
| 31.19.8 | Role-based access control | Not started | |
| 31.19.9 | Granular file access | Not started | |
| 31.19.10 | Secure file scanning | Not started | |
| 31.19.11 | Encrypted connections | Not started | |
| 31.19.12 | Protected stored data | Not started | |
| 31.19.13 | Security event logging | Not started | |
| 31.19.14 | Trip audit history | Not started | |
| 31.19.15 | Privacy classifications | Not started | |
| 31.19.16 | Share preview | Not started | |
| 31.19.17 | Revocable access | Not started | |
| 31.19.18 | Consent records | Not started | |
| 31.19.19 | Data minimization | Not started | |
| 31.19.20 | Data export | Not started | |
| 31.19.21 | Retention controls | Not started | |
| 31.19.22 | Incident response | Not started | |
| 31.19.23 | Backup and restore | Not started | |
| 31.19.24 | Monitoring and alerts | Not started | |
| 31.20.1 | Completed trip view | Not started | |
| 31.20.2 | Trip memory timeline | Not started | |
| 31.20.3 | Final expense summary | Not started | |
| 31.20.4 | Trip feedback | Not started | |
| 31.20.5 | Place notes after travel | Not started | |
| 31.20.6 | Reusable trip template | Not started | |
| 31.20.7 | Copy to new trip | Not started | |
| 31.20.8 | Privacy-safe copying | Not started | |
| 31.20.9 | Trip PDF export | Not started | |
| 31.20.10 | Calendar export | Not started | |
| 31.20.11 | Financial CSV export | Not started | |
| 31.20.12 | Data archive | Not started | |
| 31.20.13 | Restore archived trip | Not started | |
| 31.20.14 | Shareable recap | Not started | |
| 31.20.15 | Future public templates | Deferred | |
