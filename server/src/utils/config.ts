import fs from 'fs';

export interface IWebConfig {
    users: {
        id: string;
        access: 'none' | 'order' | 'scheduler' | 'full';
    }[]
};

const readWebConfig = () => {
    const content = fs.readFileSync('webconfig.json').toString();
    const config: IWebConfig = JSON.parse(content);
    return config;
};

export const webConfig = readWebConfig();