let pomodoroInfo: PomodoroInfo[] = [];

export const getPomodoroInfo = () => {
    return pomodoroInfo;
}

export const filterPomodoroInfoByName = name => {
    pomodoroInfo = pomodoroInfo.filter(x => x.user !== name);
}

export interface PomodoroInfo {
    user: string;
    startTime: number;
}