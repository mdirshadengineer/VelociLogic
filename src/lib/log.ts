import {
  Log,
  LogCollector,
  LogFunction,
  LogLevel,
  LogLevels,
} from "src/lib/types";

/**
 * Creates a log collector that stores logs in memory and provides log functions for each level.
 * @returns {LogCollector} An object with log methods and a getAll() method to retrieve all logs.
 */
export function createLogCollector(): LogCollector {
  const logs: Log[] = [];

  const getAll = () => logs;

  const logFunctions = {} as Record<LogLevel, LogFunction>;

  LogLevels.forEach((level) => {
    logFunctions[level] = (message: string) => {
      logs.push({ level, message, timeStamp: new Date() });
    };
  });

  return {
    getAll,
    ...logFunctions,
  };
}
