import os from "os";
import si from "systeminformation";
import { IComputerUsage, INetworkInfo } from "@tago-io/tcore-sdk/types";
import { getCpuPercentage } from "../Helpers/CPU";

/**
 * Formats the bytes into a more readable format.
 */
function formatBytes(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  const k = 1024;
  const dm = 2;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Retrieves all the local ips of this computer.
 */
export function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];

  for (const name of Object.keys(interfaces)) {
    for (const tmp of interfaces[name] || []) {
      const { address, family, internal } = tmp;
      if (family === "IPv4" && !internal) {
        addresses.push(address);
      }
    }
  }

  return addresses;
}

/**
 * Retrieves the main information of the OS.
 */
export async function getOSInfo() {
  const system = await si.system();
  const osInfo = await si.osInfo();
  const osPlatform = os.platform();

  let version = osInfo.release;
  let code = "";
  let hardware = "";
  let name = osInfo.distro || osInfo.codename;
  const arch = osInfo.arch;

  // debian
  // redhat
  // ubuntu
  // amazon linux
  // fedora
  // alpine
  // bsd (not linux)

  switch (osPlatform) {
    case "win32":
      code = "windows";
      break;
    case "linux":
      code = "linux";
      break;
    case "darwin":
      code = "mac";
      break;
    default:
      code = "other";
      break;
  }

  if (system.raspberry) {
    hardware = "raspberry-pi";
    version = system.raspberry?.type;
    name = "Raspberry Pi";
  }

  return {
    arch,
    name,
    code,
    hardware,
    version,
  };
}

/**
 * Retrieves the RAM usage.
 */
export async function getRAMUsage(): Promise<IComputerUsage> {
  const data = await si.mem();
  return {
    description: `${formatBytes(data.used)} / ${formatBytes(data.total)}`,
    title: "RAM usage",
    total: data.total,
    type: "memory",
    used: data.used,
  };
}

/**
 * Retrieves the swap memory usage.
 */
export async function getSwapUsage(): Promise<IComputerUsage | undefined> {
  const data = await si.mem();
  if (data.swaptotal && data.swapused) {
    return {
      description: `${formatBytes(data.swapused)} / ${formatBytes(data.swaptotal)}`,
      title: "Swap Memory usage",
      total: data.swaptotal,
      type: "memory",
      used: data.swapused,
    };
  }
}

/**
 * Retrieves the main network information.
 */
export async function getNetworkInfo(): Promise<INetworkInfo[]> {
  const stats = await si.networkStats();
  const interfaces = await si.networkInterfaces();
  const interfacesWithIP = [...interfaces.filter((x) => x.ip4 && x.ip4 !== "127.0.0.1")];

  return interfacesWithIP.map((x) => {
    const stat = stats.find((x) => x.iface === x.iface);
    return {
      bytesDropped: stat?.tx_dropped || 0,
      bytesTransferred: stat?.tx_bytes || 0,
      ip: x.ip4,
      name: x.ifaceName,
    };
  });
}

/**
 * Retrieves the CPU usage.
 */
export async function getCPUUsage(): Promise<IComputerUsage> {
  const data = await Promise.all([si.cpu(), getCpuPercentage()]);
  const percentage = Math.round(data[1]);

  return {
    description: `${percentage}%`,
    detail: `${data[0].manufacturer} ${data[0].brand}`,
    title: `CPU usage`,
    total: 100,
    type: "cpu",
    used: percentage,
  };
}

/**
 * Retrieves disk usages across all mounts.
 */
export async function getDiskUsages(): Promise<IComputerUsage[]> {
  const data = await si.fsSize();
  return data.map((x, i) => ({
    description: `${formatBytes(x.used)} / ${formatBytes(x.size)}`,
    detail: x.mount,
    title: `Disk ${i + 1}`,
    total: x.size,
    type: "disk",
    used: x.used,
  }));
}

/**
 * Retrieves the battery usage.
 */
export async function getBatteryUsage(): Promise<IComputerUsage | undefined> {
  const battery = await si.battery();
  if (battery && battery.percent > 0) {
    return {
      description: battery.isCharging ? "Charging" : "",
      detail: `${battery.percent}%`,
      title: "Battery",
      total: 100,
      type: "battery",
      used: battery.percent,
    };
  }
}

/**
 * Retrieves all the computer usage statistics.
 * Some statistics may not be available on all systems.
 */
export async function getComputerUsage(): Promise<IComputerUsage[]> {
  const usages = await Promise.all([getRAMUsage(), getSwapUsage(), getBatteryUsage(), getCPUUsage(), getDiskUsages()]);
  const filtered = usages.flat().filter((x) => x) as IComputerUsage[];
  return filtered;
}
