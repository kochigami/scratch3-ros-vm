const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Scratch3RobotBase = require('../scratch3_ros/RobotUtil');
const {RosUtil} = require('../scratch3_ros/RosUtil');
const ROSLIB = require('roslib');
const Cast = require('../../util/cast');
const icon = require('./icon');

class Scratch3PepperRobotBlocks extends Scratch3RobotBase {

    constructor(runtime, extensionId) {
        super('Pepper', extensionId ? extensionId : 'pepperRobot',
              '/robotsound', '/robotsound_jp', runtime);
        this.icon = icon;

        this.joint_server = '/pepper_robot/pose/joint_trajectory';
        this.joint_names = ['KneePitch', 'HipRoll', 'HipPitch', 'LShoulderPitch', 'LShoulderRoll', 'LElbowYaw', 'LElbowRoll', 'LWristYaw', 'RShoulderPitch', 'RShoulderRoll', 'RElbowYaw', 'RElbowRoll', 'RWristYaw', 'HeadYaw', 'HeadPitch'];

        this.poses = {
            'nodding-pose': [0.034906585039886584, -0.034906585039886584, -0.08726646259971643, 1.919862177193762, 0.6108652381980151, -0.6981317007977315, -1.0471975511965974, -0.6981317007977315, 1.919862177193762, -0.6108652381980151, 0.6981317007977315, 1.0471975511965974, 0.6981317007977315, 0.0, 0.26179938779914935],

            'pointing-left-pose': [0.034906585039886584, 0.0, -0.08726646259971643, 0.8726646259971642, 1.396263401595463, -1.5707963267948957, -0.34906585039886573, -1.5707963267948957, 1.4835298641951793, -0.17453292519943286, 1.2217304763960302, 0.34906585039886573, 0.6981317007977315, 0.5235987755982987, -0.1047197551196597],

            'pointing-right-pose': [0.034906585039886584, 0.0, -0.08726646259971643, 1.4835298641951793, 0.17453292519943286, -1.2217304763960302, -0.34906585039886573, -0.6981317007977315, 0.8726646259971642, -1.396263401595463, 1.5707963267948957, 0.34906585039886573, 1.5707963267948957, -0.5235987755982987, -0.06981317007977317],

            'reset-pose': [0.034906585039886584, -0.034906585039886584, -0.08726646259971643, 1.4835298641951793, 0.17453292519943286, -1.2217304763960302, -0.34906585039886573, -0.6981317007977315, 1.4835298641951793, -0.17453292519943286, 1.2217304763960302, 0.34906585039886573, 0.6981317007977315, 0.0, 0.0],

            'watching-pose': [0.034906585039886584, -0.034906585039886584, -0.08726646259971643, 1.7453292519943284, 0.8726646259971642, -0.34906585039886573, -1.396263401595463, -0.6981317007977315, -1.0471975511965974, -0.34906585039886573, -0.17453292519943286, 1.0471975511965974, 0.6981317007977315, 0.0, 0.0],

            'wondering-pose': [0.034906585039886584, -0.34906585039886573, -0.08726646259971643, 1.7453292519943284, 0.8726646259971642, -0.34906585039886573, -1.396263401595463, -0.6981317007977315, -1.0471975511965974, -0.34906585039886573, -0.17453292519943286, 1.0471975511965974, 0.6981317007977315, -0.08726646259971643, 0.0],

            'c-pose': [0.034906585039886584, -0.034906585039886584, -0.08726646259971643, 0.0, 1.2217304763960302, -1.2217304763960302, -0.34906585039886573, -0.6981317007977315, -0.6981317007977315, -0.17453292519943286, 0.34906585039886573, 1.2217304763960302, 0.6981317007977315, 0.0, -0.34906585039886573],

            'hiragana-tsu-pose': [0.034906585039886584, -0.034906585039886584, -0.08726646259971643, -0.6981317007977315, 0.17453292519943286, -0.34906585039886573, -1.2217304763960302, -0.6981317007977315, 0.0, -1.2217304763960302, 1.2217304763960302, 0.34906585039886573, 0.6981317007977315, 0.0, -0.34906585039886573],

            'bowing-pose': [0.034906585039886584, -0.034906585039886584, -0.6981317007977315, 1.4835298641951793, 0.17453292519943286, -1.2217304763960302, -0.34906585039886573, -0.6981317007977315, 0.8726646259971642, -0.017453292519943292, -0.017453292519943292, 0.8726646259971642, 0.8726646259971642, 0.0, 0.34906585039886573],

            'ok-pose': [0.034906585039886584, -0.034906585039886584, -0.08726646259971643, -0.6981317007977315, 0.17453292519943286, -0.34906585039886573, -1.2217304763960302, -0.6981317007977315, -0.6981317007977315, -0.17453292519943286, 0.34906585039886573, 1.2217304763960302, 0.6981317007977315, 0.0, -0.34906585039886573],

            'greeting-pose': [0.034906585039886584, -0.034906585039886584, -0.08726646259971643, 1.4835298641951793, 0.17453292519943286, 0.5235987755982987, -0.008726646259971646, 0.5235987755982987, -0.34906585039886573, -0.34906585039886573, 1.2217304763960302, 0.34906585039886573, 0.6981317007977315, 0.0, -0.26179938779914935],

            'init-pose': [0.034906585039886584, -0.034906585039886584, -0.08726646259971643, 1.919862177193762, 0.6108652381980151, -0.6981317007977315, -1.0471975511965974, -0.6981317007977315, 1.919862177193762, -0.6108652381980151, 0.6981317007977315, 1.0471975511965974, 0.6981317007977315, 0.0, 0.26179938779914935]
        }
    }

    connect (url) {
        this.ros = new RosUtil(this.runtime, this.extensionId, {url: url});
        this.ros.on('connection', () => {
            console.log("Setting joint server...");
            this._setJointServer();
        });
    }

    _toRange(val, min, max) {
        return parseInt( min + (max - min)*((val+180)/360.0) );
    }

    _makeModifier(key, value) {
        return "\\\\" + key + "=" + value + "\\\\";
    }

    _makeJointRequest(positions, time) {
        if (time < 1) time = 1;
        let secs = Math.floor(time);
        let nsecs = parseInt((time-secs) * 1000000000);
        return {
            trajectory: {
                joint_names: this.joint_names,
                points: [
                    {
                        positions: positions,
                        velocities: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
                                     0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                        time_from_start: {
                            secs: secs,
                            nsecs: nsecs,
                        }
                    } ]
            }
        };
    }

    _setJointServer () {
        if (typeof this.joint_server == 'string') {
            this.joint_server = new ROSLIB.ActionClient({
                ros: this.ros,
                serverName: this.joint_server,
                actionName: 'naoqi_bridge_msgs/JointTrajectoryAction'
            });
        }
    }

    _poseNames () {
        return Object.keys(this.poses).sort();
    }

    speech({TEXT}) {
        const msg = {data: TEXT};
        return this.ros.publishTopic('/speech', msg).
            catch(err => this._reportError(err));
    }

    pitchModifier({VALUE}) {
        let val = Cast.toNumber(VALUE);
        val = this._toRange(val, 50, 200);
        return this._makeModifier('vct', val);
    }

    rateModifier({VALUE}) {
        let val = Cast.toNumber(VALUE);
        val = this._toRange(val, 50, 400);
        return this._makeModifier('rspd', val);
    }

    volumeModifier({VALUE}) {
        let val = Cast.toNumber(VALUE);
        val = this._toRange(val, 0, 100);
        return this._makeModifier('vol', val);
    }

    pauseModifier({VALUE}) {
        let val = Cast.toNumber(VALUE);
        return this._makeModifier('pau', val);
    }

    resetModifier() {
        return ('\\\\rst\\\\');
    }

    takePose({POSE, TIME, WAIT}) {
        TIME = Cast.toNumber(TIME);
        WAIT = Cast.toBoolean(WAIT);
        let pose = this.poses[POSE];
        let msg = this._makeJointRequest(pose, TIME);
        this._setJointServer();
        return this._waitPromise(this.ros.callActionInstance(this.joint_server, msg, WAIT)).
            catch(err => this._reportError(err));
    }

    _callServiceAndReturn (name, req) {
        if (req === undefined) {
            req = {};
        }
        return this.ros.callService(name, req).
            then(val => true).
            catch(err => this._reportError(err));
    }

    test () {
	return this._callServiceAndReturn('/test');
    }

    _1_self_introduction_raika1 () {
	return this._callServiceAndReturn('/self_introduction_raika1');
    }

    _2_self_introduction_raika2 () {
	return this._callServiceAndReturn('/self_introduction_raika2');
    }

    _3_nice_to_meet_you () {
	return this._callServiceAndReturn('/nice_to_meet_you');
    }

    _4_two_view_points () {
	return this._callServiceAndReturn('/two_view_points');
    }

    _5_backup_num_of_lang () {
	return this._callServiceAndReturn('/backup_num_of_lang');
    }

    _6_language_handling_machine () {
	return this._callServiceAndReturn('/language_handling_machine');
    }

    _7_backup_turing_test () {
	return this._callServiceAndReturn('/backup_turing_test');
    }

    _8_thanks_to_nlp () {
	return this._callServiceAndReturn('/thanks_to_nlp');
    }

    _9_backup_segmentation () {
	return this._callServiceAndReturn('/backup_segmentation');
    }

    _10_wow_neuron () {
	return this._callServiceAndReturn('/wow_neuron');
    }

    _10_5_human_neuron () {
	return this._callServiceAndReturn('/human_neuron');
    }

    _11_deep_learning () {
	return this._callServiceAndReturn('/deep_learning');
    }
    
    _12_really () {
	return this._callServiceAndReturn('/really');
    }

    _13_you_look_rude () {
	return this._callServiceAndReturn('/you_look_rude');
    }

    _14_human_eval () {
	return this._callServiceAndReturn('/human_eval');
    }

    _15_backup_creating_human_like_behavior_is_difficult () {
	return this._callServiceAndReturn('/backup_creating_human_like_behavior_is_difficult');
    }

    _16_human_elements () {
	return this._callServiceAndReturn('/human_elements');
    }
    
    _17_backup_konnichiwa () {
	return this._callServiceAndReturn('/backup_konnichiwa');
    }

    _18_future_ai_comminucation_support () {
	return this._callServiceAndReturn('/future_ai_comminucation_support');
    }

    _19_nervous () {
	return this._callServiceAndReturn('/nervous');
    }
    
    _20_closing1 () {
	return this._callServiceAndReturn('/closing1');
    }

    _21_closing2 () {
	return this._callServiceAndReturn('/closing2');
    }

    feel_free_to_ask () {
	return this._callServiceAndReturn('/feel_free_to_ask');
    }

    look_front () {
	return this._callServiceAndReturn('/look_front');
    }
    
    look_right () {
	return this._callServiceAndReturn('/look_right');
    }

    look_left () {
	return this._callServiceAndReturn('/look_left');
    }

    thinking_start () {
	return this._callServiceAndReturn('/thinking_start');
    }

    thinking_stop () {
	return this._callServiceAndReturn('/thinking_stop');
    }

    getInfo () {
        return {
            id: this.extensionId,
            name: this.extensionName,
            showStatusButton: true,

            color1: "#000000",
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
                    opcode: 'speech',
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
                    opcode: 'pitchModifier',
                    blockType: BlockType.REPORTER,
                    text: 'set pitch to [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.ANGLE,
                            defaultValue: -60
                        }
                    }
                },
                {
                    opcode: 'rateModifier',
                    blockType: BlockType.REPORTER,
                    text: 'set rate to [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.ANGLE,
                            defaultValue: -130
                        }
                    }
                },
                {
                    opcode: 'volumeModifier',
                    blockType: BlockType.REPORTER,
                    text: 'set volume to [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'pauseModifier',
                    blockType: BlockType.REPORTER,
                    text: 'pause speech by [VALUE] ms',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                '---',
                {
                    opcode: 'takePose',
                    blockType: BlockType.COMMAND,
                    text: 'pose [POSE] in [TIME] s wait: [WAIT]',
                    arguments: {
                        POSE: {
                            type: ArgumentType.STRING,
                            menu: 'poseMenu',
                            defaultValue: this._poseNames()[0]
                        },
                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5
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
		    opcode: 'test',
		    blockType: BlockType.COMMAND,
		    text: 'test',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_1_self_introduction_raika1',
		    blockType: BlockType.COMMAND,
		    text: '_1_self_introduction_raika1',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_2_self_introduction_raika2',
		    blockType: BlockType.COMMAND,
		    text: '_2_self_introduction_raika2',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_3_nice_to_meet_you',
		    blockType: BlockType.COMMAND,
		    text: '_3_nice_to_meet_you',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_4_two_view_points',
		    blockType: BlockType.COMMAND,
		    text: '_4_two_view_points',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_5_backup_num_of_lang',
		    blockType: BlockType.COMMAND,
		    text: '_5_backup_num_of_lang',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_6_language_handling_machine',
		    blockType: BlockType.COMMAND,
		    text: '_6_language_handling_machine',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_7_backup_turing_test',
		    blockType: BlockType.COMMAND,
		    text: '_7_backup_turing_test',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_8_thanks_to_nlp',
		    blockType: BlockType.COMMAND,
		    text: '8_thanks_to_nlp',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_9_backup_segmentation',
		    blockType: BlockType.COMMAND,
		    text: '_9_backup_segmentation',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_10_wow_neuron',
		    blockType: BlockType.COMMAND,
		    text: '_10_wow_neuron',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_10_5_human_neuron',
		    blockType: BlockType.COMMAND,
		    text: '_10_5_human_neuron',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_11_deep_learning',
		    blockType: BlockType.COMMAND,
		    text: '_11_deep_learning',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_12_really',
		    blockType: BlockType.COMMAND,
		    text: '_12_really',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_13_you_look_rude',
		    blockType: BlockType.COMMAND,
		    text: '_13_you_look_rude',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_14_human_eval',
		    blockType: BlockType.COMMAND,
		    text: '_14_human_eval',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_15_backup_creating_human_like_behavior_is_difficult',
		    blockType: BlockType.COMMAND,
		    text: '_15_backup_creating_human_like_behavior_is_difficult',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_16_human_elements',
		    blockType: BlockType.COMMAND,
		    text: '_16_human_elements',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_17_backup_konnichiwa',
		    blockType: BlockType.COMMAND,
		    text: '_17_backup_konnichiwa',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_18_future_ai_comminucation_support',
		    blockType: BlockType.COMMAND,
		    text: '_18_future_ai_comminucation_support',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_19_nervous',
		    blockType: BlockType.COMMAND,
		    text: '_19_nervous',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_20_closing1',
		    blockType: BlockType.COMMAND,
		    text: '_20_closing1',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: '_21_closing2',
		    blockType: BlockType.COMMAND,
		    text: '_21_closing2',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: 'feel_free_to_ask',
		    blockType: BlockType.COMMAND,
		    text: 'feel_free_to_ask',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: 'look_front',
		    blockType: BlockType.COMMAND,
		    text: 'look_front',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: 'look_right',
		    blockType: BlockType.COMMAND,
		    text: 'look_right',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: 'look_left',
		    blockType: BlockType.COMMAND,
		    text: 'look_left',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: 'thinking_start',
		    blockType: BlockType.COMMAND,
		    text: 'thinking_start',
		    arguments: {
			}
		},
		'---',
		{
		    opcode: 'thinking_stop',
		    blockType: BlockType.COMMAND,
		    text: 'thinking_stop',
		    arguments: {
			}
		},
		'---',
	    ],
            menus: {
                booleanMenu: ['true', 'false'],
                poseMenu: '_poseNames'
            }
        };
    }
    }

module.exports = Scratch3PepperRobotBlocks;
