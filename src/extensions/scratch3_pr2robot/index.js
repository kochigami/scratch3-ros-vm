const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Scratch3RobotBase = require('../scratch3_ros/RobotUtil');

class Scratch3Pr2RobotBlocks extends Scratch3RobotBase {

    constructor(runtime) {
        super('Pr2', 'pr2Robot', '/robotsound', runtime, 'pr1040s');
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
                '---',
                {
                    opcode: 'callApp',
                    blockType: BlockType.COMMAND,
                    text: 'pr2 call [APP] wait: [WAIT]',
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
                    text: 'pr2 stop [APP]',
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
                appMenu: '_appNames',
            }
        };
    }
}

module.exports = Scratch3Pr2RobotBlocks;
