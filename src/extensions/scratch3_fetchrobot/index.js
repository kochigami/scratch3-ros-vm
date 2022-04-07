const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Scratch3RobotBase = require('../scratch3_ros/RobotUtil');

class Scratch3FetchRobotBlocks extends Scratch3RobotBase {

    constructor(runtime) {
        super('Fetch', 'fetchRobot', '/sound_play', runtime, 'fetch1075');
        this.map_spots = {
            'dock-front':  {
                pose: {
                    position:  {x: 6.555,  y: 7.289}, 
                    orientation:  {x: 0, y: 0, z: 0.707107, w: 0.707107}}},
            'table-side': {
                pose: {
                    position: {x: 3.22987, y: 7.29363}, 
                    orientation: {x: 0, y: 0.002121, z: 0.704342, w: 0.709858}}},
            'room73B2-front': {
                pose: {
                    position: {x: 0.418845, y: 6.82995}, 
                    orientation: {x: 0, y: 0, z: 1, w: 0}}},
            'room73A2-front': {
                pose: {
                    position: {x: -1.5, y: 2.9}, 
                    orientation: {x: 0, y: 0, z: 1, w: 0}}},
            'room73A3-front': {
                pose: {
                    position: {x: -1.15, y: 6.3}, 
                    orientation: {x: 0, y: 0, z: 1, w: 0}}},
            'room73A4-front': {
                pose: {
                    position: {x: -1.5, y: 9.8}, 
                    orientation: {x: 0, y: 0, z: 1, w: 0}}},
            'room73B2': {
                pose: {
                    position: {x: 3.62, y: 6.286}, 
                    orientation: {x: 0, y: 0, z: -0.0588317242951, w: 0.998267914047}}}
        };
    }

    _spotNames () {
        return Object.keys(this.map_spots);
    }

    goSpot ({SPOT}) {
        var spot = this.map_spots[SPOT];
        if (!spot) return(false);
        msg = JSON.parse(JSON.stringify(spot))
        msg.header = {frame_id: 'map'};

        return this._waitMessage(
            '/move_base/result',
            this.ros.publishTopic('/move_base_simple/goal', msg)
        );
    }

    saveSpot ({NAME}) {
        return this.ros.subscribeTopic(
            '/amcl_pose',
            msg => {
                this.map_spots[NAME] = {
                    pose: {
                        position: msg.pose.pose.position,
                        orientation: msg.pose.pose.orientation
                    }
                };
            });
    }

    deleteSpot ({SPOT}) {
        delete this.map_spots[SPOT];
    }

    dock ({ACTION}) {
        if (ACTION === 'in') {
            this.ros.callAction('/dock', {});
            return this.ros.getActionResult('/dock').then(val => JSON.stringify(val.result));
        }
        if (ACTION === 'out') {
            this.ros.callAction('/undock', {});
            return this.ros.getActionResult('/undock').then(val => JSON.stringify(val.result));
        }
        return false;
    }

    getInfo () {
        return {
            id: this.extensionId,
            name: this.extensionName,
            showStatusButton: true,

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
                    text: 'play sound [SOUND] wait: [WAIT]',
                    arguments: {
                        SOUND: {
                            type: ArgumentType.STRING,
                            menu: 'soundMenu',
                            defaultValue: '1'
                        },
                        WAIT: {
                            type: ArgumentType.BOOLEAN,
                            menu: 'booleanMenu',
                            defaultValue: 'true'
                        }
                    }
                },
                {
                    opcode: 'speakText',
                    blockType: BlockType.COMMAND,
                    text: 'speak [TEXT] wait: [WAIT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello!'
                        },
                        WAIT: {
                            type: ArgumentType.BOOLEAN,
                            menu: 'booleanMenu',
                            defaultValue: 'true'
                        }
                    }
                },
                {
                    opcode: 'goSpot',
                    blockType: BlockType.COMMAND,
                    text: 'move to [SPOT]',
                    arguments: {
                        SPOT: {
                            type: ArgumentType.STRING,
                            menu: 'spotMenu',
                            defaultValue: this._spotNames()[0]
                        }
                    }
                },
                {
                    opcode: 'saveSpot',
                    blockType: BlockType.COMMAND,
                    text: 'register current spot as [NAME]',
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'my spot'
                        }
                    }
                },
                {
                    opcode: 'deleteSpot',
                    blockType: BlockType.COMMAND,
                    text: 'unregister [SPOT]',
                    arguments: {
                        SPOT: {
                            type: ArgumentType.STRING,
                            menu: 'spotMenu',
                            defaultValue: this._spotNames()[0]
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
                '---',
                {
                    opcode: 'callApp',
                    blockType: BlockType.COMMAND,
                    text: 'fetch call [APP] wait: [WAIT]',
                    arguments: {
                        APP: {
                            type: ArgumentType.STRING,
                            menu: 'appMenu',
                            defaultValue: this._appNames()[0].text
                        },
                        WAIT: {
                            type: ArgumentType.BOOLEAN,
                            menu: 'booleanMenu',
                            defaultValue: 'true'
                        }
                    }
                },
                {
                    opcode: 'stopApp',
                    blockType: BlockType.COMMAND,
                    text: 'fetch stop [APP]',
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
                booleanMenu: ['true', 'false'],
                dockMenu: ['in', 'out'],
                appMenu: '_appNames',
                spotMenu: '_spotNames'
            }
        };
    }
}

module.exports = Scratch3FetchRobotBlocks;
