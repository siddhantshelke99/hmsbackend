import { ResponseObject } from '../interface/response.interface';
import fs from 'fs';
import { execFile } from 'child_process';


export class CommonHelper {
    public generateRandomAlphanumericString(length: number): string {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    public getFormattedDate(): string {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
        const year = today.getFullYear();
        console.log(today)
        return `${year}-${month}-${day}`;
    }

    public getFormattedDateTomorrow(): string {
        const today = new Date();
        let dayOfWeek = today.getDay();
        if (dayOfWeek === 5) {
            dayOfWeek = 3;
        } else if (dayOfWeek === 6) {
            dayOfWeek = 2;
        } else {
            dayOfWeek = 1;
        }
        today.setDate(today.getDate() + dayOfWeek);
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
        const year = today.getFullYear();

        return `${year}-${month}-${day}`;
    }


    public getCurrentTime(): string {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = String(hours % 12 || 12).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    public timeDiffCalculator(timeString: string) {
        const [hours, minutes, period] = timeString.split(/:| /);
        let hoursInt = parseInt(hours as string, 10);
        const isPM = period.toLowerCase() === 'pm';
        if (isPM && hoursInt !== 12) {
            hoursInt += 12;
        } else if (!isPM && hoursInt === 12) {
            hoursInt = 0;
        }

        const targetTime: any = new Date();
        targetTime.setHours(hoursInt, parseInt(minutes as string, 10), 0, 0);
        const currentTime: any = new Date();
        return currentTime - targetTime;
    }

    public calculateSla(reqDateTime: any, resDateTime: any = null) {
        const timestampReq: any = new Date(reqDateTime);
        let timestampRes: any = new Date();
        if (resDateTime !== null) {
            timestampRes = new Date(resDateTime);
        }
        return ((timestampRes - timestampReq) / (1000 * 60 * 60));
    }

    public isWorkingDaysHrs() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const startTime = new Date();
            const endTime = new Date();
            startTime.setHours(9, 0, 0);
            endTime.setHours(19, 0, 0);
            return now >= startTime && now <= endTime;
        }
        else return false;
    }

    public isWorkingDaysHrsForTodaysTickets() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const startTime = new Date();
            const endTime = new Date();
            startTime.setHours(9, 0, 0);
            endTime.setHours(18, 0, 0);
            return now >= startTime && now <= endTime;
        }
        else return false;
    }

    public getWorStartDateTime () {
        return this.getFormattedDate() + " 09:00 AM";
    }

    public getWorEndDateTime () {
        return this.getFormattedDate() + " 07:00 PM";
    }

    public static containsOnlyAllowedCharacters(inputString) {
        const alphanumericPattern = /^[a-zA-Z0-9.]+$/;
        return alphanumericPattern.test(inputString);
    }

    public static calculateAge(ticketDate: Date, resolutionDate: Date) {
        const tktDate = new Date(ticketDate);
        const resDate = resolutionDate !== null ? new Date(resolutionDate) : new Date();
        const timeDifference = resDate.getTime() - tktDate.getTime();
        const dayDifference = timeDifference / (1000 * 3600 * 24);
        return Math.abs(Math.round(dayDifference));
    }

    public sendResponse(data = null, error = null, message = null, status) {
        const response: ResponseObject = {
            response: {
                data,
                error,
                message,
                status
            }
        }
        return response;
    }

    public createDirectory(path, directoryName) {
        if (!fs.existsSync(path))
            return false;
        if (fs.existsSync(path + '/' + directoryName))
            return true;
        fs.mkdirSync(path + '/' + directoryName);
        return true;
    }

    public move(sourcePath, destinationPath) {
        if (!fs.existsSync(sourcePath)) {
            return false;
        }
        fs.renameSync(sourcePath, destinationPath);
        return true;
    }


    public padZeros(value: string) {
        if (value.length >= 6) {
            return value;
        }
        const zerosToAdd = 6 - value.length;
        return '0'.repeat(zerosToAdd) + value;
    }

    executeFileCommand(command: string, parameters: any) {
        return new Promise((resolve, reject) => {
            execFile(command, parameters, (error, stdout, stderr) => {
                if (error) {
                    console.log(error, "error");
                    reject(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(stderr, "stderr");
                    reject(`Error: ${stderr}`);
                    return;
                }
                resolve(stdout.trim());
            });
        });
    }



}