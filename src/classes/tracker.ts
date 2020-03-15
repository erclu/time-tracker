class Tracker {
  private intervals: TrackerInterval[] = [];
  private summary: TrackerSummary;

  constructor(private readonly name: string) {}
}

interface TrackerSummary {
  rawTotal: number;
  getTotal(): Date;

  // XXX needs to know trackerRows?
  rawTodayTotal: number;
  getTodayTotal(): Date;

  getLastSessionDate(): Date;
  getLastSessionDuration(): Date;
}

interface TrackerInterval {
  readonly formTimestamp: Date;
  readonly startTime: number;
  readonly endTime: number;
  logged: boolean;
}

interface TrackerIntervalWithEvent extends TrackerInterval {
  hasEvent: boolean;
  eventId: string;
}
