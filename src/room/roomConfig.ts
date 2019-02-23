interface NameValuePair {
    name: 'string',
    value: 'string'
};

export interface RoomConfig {
    name?: string,
    service?: string,
    host?: string,
    options?: Array<NameValuePair>
};