declare module 'amplitude' {
    type AmplitudeOptions =
        | {
              secretKey: string;
              userId: string;
              deviceId: string;
              sessionId: string;
          }
        | {
              secretKey: string;
              user_id: string;
              device_id: string;
              session_id: string;
          };
    type TrackData = {
        eventType: string;
        userId?: string;
        eventProperties?: {
            [key: string]: string;
        };
        userProperties?: {
            [key: string]: string;
        };
    };
    class Amplitude {
        constructor(token: string, options?: Partial<AmplitudeOptions>);

        track(data: TrackData): any;
    }

    export = Amplitude;
}
