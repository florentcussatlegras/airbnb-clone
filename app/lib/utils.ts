import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getValidDomains() {
  const domains = ["gmail.com", "yahoo.com", "outlook.com"];

  if (process.env.NODE_ENV === "development") {
    domains.push("example.com");
  }

  return domains;
}

export function normalizeName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z\s'-]/g, "")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function convertSecondsInHourMin(given_seconds: number) {
  // console.log(sec);
  // const dateObj = new Date(sec * 1000);
  // console.log(dateObj);
  // const hours = dateObj.getUTCHours();
  // const minutes = dateObj.getUTCMinutes();

  // if (hours === 0) {
  //     return minutes.toString() + ' min';
  // }

  // if (minutes === 0) {
  //     return hours.toString() + ' h';
  // }

  // return hours.toString() + ' h ' +
  //     minutes.toString().padStart(2, '0') + ' min';

  if (given_seconds === 0) {
    return "0 min";
  }

  const hours = Math.floor(given_seconds / 3600);
  const minutes = Math.floor((given_seconds - hours * 3600) / 60);
  const seconds = given_seconds - hours * 3600 - minutes * 60;

  let timeString = "";

  if (hours > 0) {
    if(hours < 10) {
      timeString = hours.toString() + " h ";
    }else{
      timeString = hours.toString().padStart(2, "0") + " h ";
    }
  }

  if (given_seconds >= 60) {
    if (minutes > 0) {
      if (minutes < 10) {
        timeString += minutes.toString() + " min";
      } else {
        timeString += minutes.toString().padStart(2, "0") + " min";
      }
    }
  } else {
    if (seconds < 10) {
      timeString += seconds.toString() + " sec";
    } else {
      timeString += seconds.toString().padStart(2, "0") + " sec";
    }
  }

  return timeString;
}
