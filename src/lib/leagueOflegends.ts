import { exec } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';


export interface LeagueOfLegendsData {
  gameClient?: string;
  processId?: string;
  port?: string;
  password?: string;
  protocol?: string;
  username?: string;
}

export function findLeagueOfLegends(): Promise<LeagueOfLegendsData> {
    return new Promise<LeagueOfLegendsData>((resolve, reject) => {
        const interval = setInterval(() => {
            exec(`tasklist /FI "IMAGENAME eq LeagueClientUx.exe" /FO CSV`, (error, stdout) => {
                if (error) {
                    console.error(`Error executing tasklist command: ${error.message}`);
                    return;
                }
            
                const lines = stdout.trim().split('\r\n');
                if (lines.length < 2) {
                    console.log('League of Legends process not found.');
                    return;
                }
            
                const line = lines.find((l) => l.includes('LeagueClientUx.exe'));
                if (!line) {
                    console.log('Invalid process information.');
                    return;
                }
            
                const columns = line.split('","');
                if (columns.length < 2) {
                    console.log('Invalid process information.');
                    return;
                }
            
                const processName = columns[0]?.replace(/"/g, '');
                const pid = columns[1]?.replace(/"/g, '');
            
                if (!processName || !pid) {
                    console.log('Invalid process information.');
                    return;
                }
            
                exec(`powershell -Command "(Get-WmiObject -Query 'SELECT ExecutablePath FROM Win32_Process WHERE ProcessId=${pid}').ExecutablePath"`, (error, stdout) => {
                    if (error) {
                        console.error(`Error executing PowerShell command: ${error.message}`);
                        return;
                    }
            
                    const executablePath = stdout.trim();
                    if (!executablePath) {
                        console.log('Invalid executable path.');
                        return;
                    }
                
                    const gameFolder = executablePath.substring(0, executablePath.lastIndexOf('\\'));                
                    const lockfilePath = join(gameFolder, 'lockfile');

                    if (existsSync(lockfilePath)) {
                        const lockfileData = readFileSync(lockfilePath, 'utf8').trim();
                        const lockfileItems = lockfileData.split(':');
                        if (lockfileItems.length === 5) {
                            const [gameClient, processId, port, password, protocol] = lockfileItems;
                            const data: LeagueOfLegendsData = {
                                gameClient,
                                processId,
                                port,
                                password,
                                protocol,
                                username: 'riot',
                            };
                            clearInterval(interval);
                            resolve(data);
                        } else {
                            console.log('Invalid lockfile format.');
                        }
                    } else {
                        console.log('Lockfile not found.');
                    }
            
                });
            });
        }, 3000);
    })
}
