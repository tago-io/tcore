import pm2, { ProcessDescription, StartOptions } from "pm2";
import * as API from "@tago-io/tcore-api";

export const PM2_APP_NAME = API.getSystemName();

/**
 */
export function pm2Connect() {
  return new Promise<void>((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

/**
 */
export function pm2Start(options: StartOptions) {
  return new Promise<void>((resolve, reject) => {
    pm2.start(options, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

/**
 */
export async function pm2GetApp(): Promise<ProcessDescription | null> {
  const name = PM2_APP_NAME;
  const apps = await pm2List();
  const app = apps.find((x) => x.name === name);
  return app || null;
}

/**
 */
export function pm2List() {
  return new Promise<ProcessDescription[]>((resolve, reject) => {
    pm2.list((err, list) => {
      if (err) {
        return reject(err);
      }
      resolve(Array.isArray(list) ? list : []);
    });
  });
}

/**
 */
export function pm2Disconnect() {
  return new Promise<void>((resolve) => {
    pm2.disconnect();
    resolve();
  });
}

/**
 */
export function pm2Restart() {
  return new Promise<void>((resolve, reject) => {
    pm2.restart(PM2_APP_NAME, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

/**
 */
export function pm2Delete() {
  return new Promise<void>((resolve, reject) => {
    pm2.delete(PM2_APP_NAME, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
