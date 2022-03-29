const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Scratch3RobotBase = require('../scratch3_ros/RobotUtil');

class Scratch3SpotRobotBlocks extends Scratch3RobotBase {

    constructor(runtime) {
        super('Spot', 'spotRobot', '/robotsound', runtime);
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

    getInfo () {
        return {
            id: this.extensionId,
            name: this.extensionName,
            showStatusButton: true,

            colour: '#D41B1B',
            colourSecondary: '#C8A94A',
            colourTertiary: '#555555',

            menuIconURI: this.icon,
            
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
                '---',
                {
                    opcode: 'callApp',
                    blockType: BlockType.COMMAND,
                    text: 'spot call [APP]',
                    arguments: {
                        APP: {
                            type: ArgumentType.STRING,
                            menu: 'appMenu',
                            defaultValue: this._appNames()[0].text
                        }
                    }
                },
                {
                    opcode: 'stopApp',
                    blockType: BlockType.COMMAND,
                    text: 'spot stop [APP]',
                    arguments: {
                        APP: {
                            type: ArgumentType.STRING,
                            menu: 'appMenu',
                            defaultValue: this._appNames()[0].text
                        }
                    }
                }
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
