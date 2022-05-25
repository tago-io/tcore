import { IAction } from "@tago-io/tcore-sdk/types";
import { DateTime } from "luxon";
import cronParser from "cron-parser";
import { parseRelativeDate } from "../Helpers/Time";
import { getActionList, triggerAction } from "./Action";

let interval: ReturnType<typeof setInterval>;

function getLastRunTime(item: IAction): Date {
  return new Date(item.last_triggered || item.updated_at || DateTime.utc().minus({ minute: 1 }).toJSDate());
}

async function getActionsToRun(): Promise<{ intervals: any[]; schedules: any[] }> {
  const actions = await getActionList({
    filter: { active: true },
    fields: ["trigger", "updated_at", "last_triggered", "type"],
    amount: 999999,
  });

  const intervals: any[] = [];
  const schedules: any[] = [];

  for (const action of actions) {
    const triggers = Array.isArray(action?.trigger) ? action?.trigger : [];
    for (const item of triggers) {
      if (item.interval) {
        intervals.push({
          id: action.id,
          interval: item.interval,
          last_triggered: action.last_triggered,
          updated_at: action.updated_at,
        });
      } else if (item.cron) {
        schedules.push({
          cron: item.cron,
          id: action.id,
          last_triggered: action.last_triggered,
          timezone: item.timezone,
          updated_at: action.updated_at,
        });
      }
    }
  }

  return { intervals, schedules };
}

async function triggerActions() {
  const { intervals, schedules } = await getActionsToRun();
  const actionsToRun = new Set<string>();

  // check intervals
  for (const item of intervals) {
    const lastRunTime = getLastRunTime(item);

    try {
      const dateCalc = parseRelativeDate(item.interval, "plus", lastRunTime);
      if (!dateCalc || dateCalc === "never") {
        continue;
      }

      if (DateTime.utc().plus({ seconds: 30 }).toJSDate() > dateCalc) {
        actionsToRun.add(item.id);
      }
    } catch (error) {
      console.error("Error on interval parser", item.id, error);
    }
  }

  // check schedules
  for (const item of schedules) {
    const lastRunTime = getLastRunTime(item);

    try {
      const timezone = DateTime.now().zoneName; // TODO
      const lastTime = DateTime.fromJSDate(lastRunTime).setZone(timezone);
      const cron = cronParser.parseExpression(item.cron, { tz: timezone });
      const cronPrev = cron.prev();

      if (lastTime.toJSDate() < cronPrev.toDate()) {
        actionsToRun.add(item.id);
      }
    } catch (error) {
      console.error("Error on cron parser", item.id, error);
    }
  }

  const actions = [...actionsToRun.values()];
  for (const actionID of actions) {
    console.log(new Date().toISOString(), "- Triggering action with id", actionID);
    await triggerAction(actionID, null);
  }
}

function startActionScheduleTimer() {
  stopActionScheduleTimer();
  interval = setInterval(triggerActions, 1000 * 60);
}

function stopActionScheduleTimer() {
  if (interval) {
    clearInterval(interval);
  }
}

export { stopActionScheduleTimer, startActionScheduleTimer };
