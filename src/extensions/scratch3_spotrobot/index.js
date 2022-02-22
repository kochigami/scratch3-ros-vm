const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Scratch3RosBase = require('../scratch3_ros/RosUtil');

const icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICBpZD0ic3ZnMiIKICAgdmVyc2lvbj0iMS4xIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSIKICAgd2lkdGg9IjIyLjYxMjM0NSIKICAgaGVpZ2h0PSIyMi44NzgzNTkiCiAgIHZpZXdCb3g9IjAgMCAyMi42MTIzNDUgMjIuODc4MzU5IgogICBzb2RpcG9kaTpkb2NuYW1lPSJyb3Mtc21hbGwuc3ZnIgogICBpbmtzY2FwZTpleHBvcnQtZmlsZW5hbWU9Ii90bXAvcm9zLnN2ZyIKICAgaW5rc2NhcGU6ZXhwb3J0LXhkcGk9IjM1LjY0MzU2NiIKICAgaW5rc2NhcGU6ZXhwb3J0LXlkcGk9IjM1LjY0MzU2NiI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhOCI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczYiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxODYzIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwNTYiCiAgICAgaWQ9Im5hbWVkdmlldzQiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjEyLjcwMjcwMiIKICAgICBpbmtzY2FwZTpjeD0iNy4yNjc2Mjg5IgogICAgIGlua3NjYXBlOmN5PSIyLjI2Njk3ODkiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjU3IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIyNCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojNDEwMDY5O2ZpbGwtb3BhY2l0eToxIgogICAgIGQ9Ik0gMS44MTk1NCwyMS4xMTI5NDQgQyAwLjcwMTAwNTUxLDIwLjE3MTc2MiAwLjYxMDY1NjkyLDE4LjUyOTE5IDEuNjIxODA0OSwxNy41MTgwNCAzLjUyOTA2NzEsMTUuNjEwNzc5IDYuNDgwNjc5NSwxOC4wMzc2MDggNS4yMTk2MzgyLDIwLjQ3NjE5MyA0LjYyNjkzNzUsMjEuNjIyMzQ4IDIuODI1Nzk4OCwyMS45NTk2NTYgMS44MTk1NCwyMS4xMTI5NDQgWiBtIDguNDU3NjIzLDAuMTc5MzQyIEMgOS4xNTI3MzczLDIwLjY4MjE4IDguODI1NzM0NiwxOC43MjkwNjYgOS42NzgzNjExLDE3LjcxNTc3OCBjIDAuOTY0MTQ2OSwtMS4xNDU4MjUgMi41MzkxNzQ5LC0xLjE1NDIzNyAzLjQ5NDY5MjksLTAuMDE4NjYgMC45MDIwNTUsMS4wNzIwMzEgMC43ODIxNTUsMi41MTk2MzIgLTAuMjgyOTIyLDMuNDE1ODM0IC0wLjY0ODY3MiwwLjU0NTgyMyAtMS43OTI4MTcsMC42MjQzNTEgLTIuNjEyOTY5LDAuMTc5MzM5IHogbSA3LjkzNTU2NiwtMC4yODAxMzQgYyAtMS45ODY4NzksLTEuNzQ0NTAxIC0wLjA1OTMzLC01LjAxMDUzNiAyLjM2MDQxOCwtMy45OTk0OTggMS41Nzc5NTEsMC42NTkzMTIgMS45MDk2MDQsMi43NzQyNzQgMC42MjAzMjIsMy45NTU4MTIgLTAuOTI5MDE5LDAuODUxMzg0IC0yLjA0MjI0MSwwLjg2NzY5OCAtMi45ODA3NCwwLjA0MzY4IHogTSAxLjkwNjkzNjYsMTIuODUyNDk1IEMgMS4yODY2NywxMi4zNjQ1OTUgMC44NjU5NTc0OCwxMS41NjE4MDIgMC44NjU5NTc0OCwxMC44NjYxMjggYyAwLC0wLjc0NzgyOSAwLjcwNjk5NTYyLC0xLjczMzA4MTUgMS41MzQ5MDcwMiwtMi4xMzkwMDg0IDEuOTE3NTg5OCwtMC45NDAxOTUyIDMuODU1NDQ2LDEuNDAxNTI0NCAyLjgxODc3MzcsMy40MDYyMjk0IC0wLjU2MTUyMzYsMS4wODU4NjcgLTIuMzUyMjc3NywxLjQ3NDYxOCAtMy4zMTI3MDE2LDAuNzE5MTQ2IHogbSA4LjE5OTk2NDQsLTAuMDMwOSBDIDkuNDM5NDQ4NCwxMi4yNTczNzggOS4yMDg4MDI1LDExLjc0MTQ5NiA5LjIwODgwMjUsMTAuODEyODQzIGMgMCwtMS41OTY1OTI2IDEuNjA0NzQyNSwtMi43MzQ5OTMyIDMuMDIxMTM2NSwtMi4xNDMxODU4IDEuNzI4NjM1LDAuNzIyMjcxIDIuMDgwMTY4LDIuOTA1NjE0OCAwLjY2MDE5Myw0LjEwMDQ0MjggLTAuNzQ4ODA2LDAuNjMwMDc5IC0yLjA2OTg3MywwLjY1NDUyIC0yLjc4MzIzMSwwLjA1MTUgeiBtIDguMDc5NDcyLC0wLjE4NDU4NyBjIC0xLjI4OTA3OSwtMS4xODEzNTMgLTAuOTgyMDAxLC0zLjE3OTI4OTYgMC41OTU5MzEsLTMuODc3MjgyMiAyLjA3NTY4LC0wLjkxODE3MiAzLjkyNDY0MywxLjE3NTI5OTggMi45MTU3NjcsMy4zMDEzNTAyIC0wLjM2NjgwOSwwLjc3Mjk5MiAtMS4wODk2ODksMS4xNzg1ODIgLTIuMTAwNTc4LDEuMTc4NTgyIC0wLjU5MTY4MiwwIC0wLjg5NDc1LC0wLjEyOTQzIC0xLjQxMTEyLC0wLjYwMjY1IHogTSAyLjM1MjgyNTksNC43NTk5Mzk0IEMgMS41NjU1MDMyLDQuMzYxMzcyNyAwLjg2NTk1NzQ4LDMuMzYxODI5MSAwLjg2NTk1NzQ4LDIuNjM1NDMyOSBjIDAsLTEuMjQ1OTY2OSAxLjA3MzE0MDMyLC0yLjM3MzUzMjE5IDIuMjU4OTY3MDIsLTIuMzczNTMyMTkgMS40NTAwNjY3LDAgMi4zNzY2NjU4LDAuOTE4NTQyODkgMi4zNzUyNTM2LDIuMzU0NTk5MTkgLTAuMDAxNjksMS43NDIxNzM2IC0xLjY4MDk0NjQsMi44ODU3ODA3IC0zLjE0NzM1MjIsMi4xNDM0Mzk1IHogbSA4LjIzMDcyNjEsMC4wNjU5NzUgQyA5LjcwMDExNTMsNC40MzAxMDIgOS4yMDg4MDI1LDMuNjgxMjUwNCA5LjIwODgwMjUsMi43MzA1NDU4IGMgMCwtMS41NzA2NTcxIDAuODQ3MzYyNSwtMi40Njg2NDQ3OCAyLjMyOTQ3MjUsLTIuNDY4NjQ0NzggMC43MjYxLDAgMC45NTQ4MTksMC4wOTU0NzMgMS40NzUwNzIsMC42MTU3MjY3MyAwLjgwNTUxMywwLjgwNTUxMTE1IDAuOTg3MzE3LDEuNzI0ODQwMDUgMC41MjUwNDYsMi42NTUwMzU2NSAtMC42MTY5OTcsMS4yNDE1NDQ4IC0xLjg1Nzk3NywxLjc4NDY4NzMgLTIuOTU0ODQxLDEuMjkzMjUwOSB6IG0gOC4xNTkxMSwtMC4wOTI3MjQgYyAtMS41MzkyMzMsLTAuNzAzODI1NSAtMS44MjY4OCwtMi43MDQyMjc4IC0wLjU1NjI4OSwtMy44Njg2Mzc2NSAxLjUzMzQyMywtMS40MDUyNzU5NCAzLjgxNzc4MywtMC4zMDU3ODE1IDMuODEzNTY5LDEuODM1NTIzODUgLTAuMDAzNCwxLjY2MDQwOCAtMS43MjM3OSwyLjczNDMxNjYgLTMuMjU3MjgsMi4wMzMxMTM4IHoiCiAgICAgaWQ9InBhdGg0MTM4IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3NzY3Nzc3Nzc3Nzc3NzIiAvPgo8L3N2Zz4K'

class Scratch3SpotRobotBlocks extends Scratch3RosBase {

    constructor(runtime) {
        super('Spot', 'spotRobot', runtime);
        this.app_list = [{name:'app', text:'App'}]
    }

    _appNames () {
        if (this.ros) {
            const that = this;
            this.ros.callService('/robot/list_apps', {}).
                then(res =>
                     that.app_list = res.available_apps.map(val => ({name: val.name, text: val.display_name})));
        };
        return this.app_list;
    }

    _waitMessage(topic, promise) {
        return new Promise(resolve => {
                promise.then(res => {
                    if (res) {
                        this.ros.subscribeTopic(topic, msg => resolve(msg.status.status == 3));
                    }
                    else resolve(false);
                });
        });
    }

    _makeGoal (pose, secs) {
        const header = {frame_id: 'body'};
        const msg = {
            header: header,
            goal: {
                target_pose: {
                    header: header,
                    pose: pose
                },
                duration: {
                    data: {
                        secs: secs,
                        nsecs: 0
                    }
                }
            }
        }
        return msg;
    }

    _makeQuaternion (x, y, z) {
        const q = {
            x: 0.0,
            y: 0.0,
            z: 0.0,
            w: 1.0,
        }
        return q;
    }

    query ({TEXT}) {
        return confirm(TEXT);
    }

    playSound ({SOUND}) {
        SOUND = Cast.toNumber(SOUND);
        const msg = {
            goal: {
                sound_request: {
                    sound: SOUND,
                    command: 1,
                    volume: 0.5
                }
            }
        }
        // this.ros.publishTopic('/robotsound/goal', msg);

        // Wait for Result
        // return this._waitMessage(
        //     'robotsound/result',
        //     this.ros.publishTopic('/robotsound/goal', msg));
    }

    speakText ({TEXT}) {
        const msg = {
            goal: {
                sound_request: {
                    sound: -3,
                    command: 1,
                    volume: 0.8,
                    arg: TEXT
                }
            }
        }
        this.ros.publishTopic('/robotsound/goal', msg);

        // // Wait for Result
        // return this._waitMessage(
        //     'robotsound/result',
        //     this.ros.publishTopic('/robotsound/goal', msg));
    }

    claim ({MODE}) {
        if (MODE === 'claim') {
            return this.ros.callService('/spot/claim', {});
        }
        if (MODE === 'release') {
            return this.ros.callService('/spot/release', {});
        }
        return false;
    }

    power ({MODE}) {
        if (MODE === 'on') {
            return this.ros.callService('/spot/power_on', {});
        }
        if (MODE === 'off') {
            return this.ros.callService('/spot/power_off', {});
        }
        return false;
    }

    act ({ACTION}) {
        if (ACTION === 'stand') {
            return this.ros.callService('/spot/stand', {});
        }
        if (ACTION === 'sit') {
            return this.ros.callService('/spot/sit', {});
        }
        return false;
    }

    dock ({ACTION}) {
        if (ACTION === 'in') {
            return this.ros.callService('/spot/dock', {dock_id: 521});
        }
        if (ACTION === 'out') {
            return this.ros.callService('/spot/undock', {});
        }
        return false;
    }

    moveForward ({X, TIME}) {
        const pose = {
            position:  {x: X,  y: 0.0, z: 0.0}, 
            orientation:  {x: 0, y: 0, z: 0.707107, w: 0.707107}
        };
        const msg = this._makeGoal(pose, TIME);
        return this._waitMessage(
            '/spot/trajectory/result',
            this.ros.publishTopic('/spot/trajectory/goal', msg)
        );
    }

    moveRotate ({THETA, TIME}) {
        const orientation = this._makeQuaternion(0.0, 0.0, THETA);
        const pose = {
            position:  {x: 0.0,  y: 0.0, z: 0.0}, 
            orientation:  orientation
        };
        const msg = this._makeGoal(pose, TIME);

        return this._waitMessage(
            '/spot/trajectory/result',
            this.ros.publishTopic('/spot/trajectory/goal', msg)
        );
    }

    move3D ({X, Y, THETA, TIME}) {
        const orientation = this._makeQuaternion(0.0, 0.0, THETA);
        const pose = {
            position:  {x: X,  y: Y, z: 0.0}, 
            orientation:  orientation
        };
        const msg = this._makeGoal(pose, TIME);

        return this._waitMessage(
            '/spot/trajectory/result',
            this.ros.publishTopic('/spot/trajectory/goal', msg)
        );
    }

    bodyPose ({X, Y}) {
        const orientation = this._makeQuaternion(X, Y, 0.0);
        const msg = {
            position:  {x: 0.0,  y: 0.0, z: 0.0}, 
            orientation:  orientation
        };

        this.ros.publishTopic('/spot/body_pose', msg);
    }

    callApp ({APP}) {
        var app = this.app_list.find(val => val.text === APP);
        var msg = {name: app.name};
        return this.ros.callService('/robot/start_app', msg).then(res => res.message);
    }

    getInfo () {
        return {
            id: this.extensionId,
            name: this.extensionName,
            showStatusButton: true,

            colour: '#D41B1B',
            colourSecondary: '#C8A94A',
            colourTertiary: '#555555',

            menuIconURI: icon,
            
            blocks: [
                {
                    opcode: 'query',
                    blockType: BlockType.BOOLEAN,
                    text: 'query [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Proceed?'
                        }
                    }
                },
                {
                    opcode: 'playSound',
                    blockType: BlockType.COMMAND,
                    text: 'play sound [SOUND]',
                    arguments: {
                        SOUND: {
                            type: ArgumentType.STRING,
                            menu: 'soundMenu',
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: 'speakText',
                    blockType: BlockType.COMMAND,
                    text: 'speak [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello!'
                        }
                    }
                },
                {
                    opcode: 'claim',
                    blockType: BlockType.COMMAND,
                    text: '[MODE] robot',
                    arguments: {
                        MODE: {
                            type: ArgumentType.STRING,
                            menu: 'claimMenu',
                            defaultValue: 'claim'
                        }
                    }
                },
                {
                    opcode: 'power',
                    blockType: BlockType.COMMAND,
                    text: 'power [MODE]',
                    arguments: {
                        MODE: {
                            type: ArgumentType.STRING,
                            menu: 'powerMenu',
                            defaultValue: 'on'
                        }
                    }
                },
                {
                    opcode: 'act',
                    blockType: BlockType.COMMAND,
                    text: 'make robot [ACTION]',
                    arguments: {
                        ACTION: {
                            type: ArgumentType.STRING,
                            menu: 'actionMenu',
                            defaultValue: 'stand'
                        }
                    }
                },
                {
                    opcode: 'dock',
                    blockType: BlockType.COMMAND,
                    text: 'dock [ACTION]',
                    arguments: {
                        ACTION: {
                            type: ArgumentType.STRING,
                            menu: 'dockMenu',
                            defaultValue: 'in'
                        }
                    }
                },
                // {
                //     opcode: 'moveForward',
                //     blockType: BlockType.COMMAND,
                //     text: 'move [X]m forward in [TIME] seconds',
                //     arguments: {
                //         X: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 1.0
                //         },
                //         TIME: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 2
                //         },
                //     }
                // },
                // {
                //     opcode: 'moveRotate',
                //     blockType: BlockType.COMMAND,
                //     text: 'rotate [THETA] degrees in [TIME] seconds',
                //     arguments: {
                //         THETA: {
                //             type: ArgumentType.ANGLE,
                //             defaultValue: 0
                //         },
                //         TIME: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 2
                //         },
                //     }
                // },
                // {
                //     opcode: 'move3D',
                //     blockType: BlockType.COMMAND,
                //     text: 'move to X:[X] Y:[Y] THETA:[THETA] in [TIME] seconds',
                //     arguments: {
                //         X: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 1.0
                //         },
                //         Y: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 0.0
                //         },
                //         THETA: {
                //             type: ArgumentType.ANGLE,
                //             defaultValue: 0
                //         },
                //         TIME: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 2
                //         },
                //     }
                // },
                // {
                //     opcode: 'bodyPose',
                //     blockType: BlockType.COMMAND,
                //     text: 'orient body with roll:[X] pitch:[Y]',
                //     arguments: {
                //         X: {
                //             type: ArgumentType.ANGLE
                //         },
                //         Y: {
                //             type: ArgumentType.ANGLE
                //         },
                //     }
                // },
                {
                    opcode: 'callApp',
                    blockType: BlockType.COMMAND,
                    text: 'call [APP]',
                    arguments: {
                        APP: {
                            type: ArgumentType.STRING,
                            menu: 'appMenu',
                            defaultValue: this._appNames()[0].text
                        }
                    }
                },
            ],
            menus: {
                soundMenu: ['1', '2', '3', '4', '5'],
                claimMenu: ['claim', 'release'],
                powerMenu: ['on', 'off'],
                actionMenu: ['stand', 'sit'],
                dockMenu: ['in', 'out'],
                appMenu: '_appNames',
            }
        };
    }
}

module.exports = Scratch3SpotRobotBlocks;
