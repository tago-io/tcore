import os from "os";

/**
 */
function getCPUInfo() {
  const cpus = os.cpus();
  let total = 0;
  let idle = 0;

  for (const key in cpus) {
    const cpu = cpus[key];
    total += cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.irq + cpu.times.idle;
    idle += cpu.times.idle;
  }

  return {
    idle: idle,
    total: total,
  };
}

/**
 */
export function getCpuPercentage(): Promise<number> {
  const stats1 = getCPUInfo();
  const startIdle = stats1.idle;
  const startTotal = stats1.total;

  return new Promise((resolve) => {
    setTimeout(function () {
      const stats2 = getCPUInfo();
      const endIdle = stats2.idle;
      const endTotal = stats2.total;

      const idle = endIdle - startIdle;
      const total = endTotal - startTotal;
      const percentage = idle / total;

      resolve((1 - percentage) * 100);
    }, 1000);
  });
}
