const previewMessenger = {
    protocols: {
        youtube: {
            listening: () => ({
                message: {
                    event: 'listening',
                },
                targetOrigin: '*',
            }),
            play: (startTime) => ({
                message:
                    startTime !== undefined
                        ? { event: 'command', func: 'seekTo', args: [startTime] }
                        : { event: 'command', func: 'playVideo' },
                targetOrigin: '*',
            }),
            stop: () => ({
                message: { event: 'command', func: 'stopVideo' },
                targetOrigin: '*',
            }),
            mute: () => ({
                message: { event: 'command', func: 'mute' },
                targetOrigin: '*',
            }),
            unMute: () => ({
                message: { event: 'command', func: 'unMute' },
                targetOrigin: '*',
            }),
            seekTo: (time) => ({
                message: { event: 'command', func: 'seekTo', args: [time] },
                targetOrigin: '*',
            }),

            getCurrentTime: () => ({
                message: { event: 'command', func: 'getCurrentTime' },
                targetOrigin: '*',
            }),
            // getDuration: () => ({
            //     message: { event: 'command', func: 'getDuration' },
            //     targetOrigin: '*',
            // }),
            getDuration: () => ({
                message: {
                    event: 'command',
                    func: 'getDuration',
                    args: [],
                },
                targetOrigin: '*',
            }),
        },

        vimeo: {
            play: (startTime) => ({
                message: [{ method: 'setCurrentTime', value: startTime }, { method: 'play' }],
                targetOrigin: '*',
            }),
            stop: () => ({
                message: { method: 'pause' },
                targetOrigin: '*',
            }),
            mute: () => ({
                message: { method: 'setVolume', value: 0 },
                targetOrigin: '*',
            }),
            unMute: () => ({
                message: { method: 'setVolume', value: 1 },
                targetOrigin: '*',
            }),
            seekTo: (time) => ({
                message: { method: 'setCurrentTime', value: time },
                targetOrigin: '*',
            }),

            getCurrentTime: () => ({
                message: { method: 'getCurrentTime' },
                targetOrigin: '*',
            }),
            getDuration: () => ({
                message: { method: 'getDuration' },
                targetOrigin: '*',
            }),
        },
    },

    sendCommand(iframe, type, command, { startTime, duration } = {}) {
        const protocol = this.protocols[type];
        if (!protocol) {
            console.warn(`No protocol found for type: ${type}`);
            return;
        }

        const handler = protocol[command];
        if (!handler) {
            console.warn(`No handler for command: ${command} in type: ${type}`);
            return;
        }

        try {
            const { message, targetOrigin } = handler(startTime);

            // Handle array of messages
            if (Array.isArray(message)) {
                message.forEach((msg) => {
                    iframe.contentWindow.postMessage(
                        type === 'youtube' ? JSON.stringify(msg) : msg,
                        targetOrigin
                    );
                });
            } else {
                iframe.contentWindow.postMessage(
                    type === 'youtube' ? JSON.stringify(message) : message,
                    targetOrigin
                );
            }

            // Handle duration if provided
            if (command === 'play' && duration) {
                setTimeout(() => {
                    this.sendCommand(iframe, type, 'stop');
                }, duration * 1000);
            }
        } catch (error) {
            console.error(`Error sending command ${command} to ${type}:`, error);
        }
    },
};

export default previewMessenger;
