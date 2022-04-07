const Cast = require('../../util/cast');
const Scratch3RosBase = require('../scratch3_ros/RosUtil');

const icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICBpZD0ic3ZnMiIKICAgdmVyc2lvbj0iMS4xIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSIKICAgd2lkdGg9IjIyLjYxMjM0NSIKICAgaGVpZ2h0PSIyMi44NzgzNTkiCiAgIHZpZXdCb3g9IjAgMCAyMi42MTIzNDUgMjIuODc4MzU5IgogICBzb2RpcG9kaTpkb2NuYW1lPSJyb3Mtc21hbGwuc3ZnIgogICBpbmtzY2FwZTpleHBvcnQtZmlsZW5hbWU9Ii90bXAvcm9zLnN2ZyIKICAgaW5rc2NhcGU6ZXhwb3J0LXhkcGk9IjM1LjY0MzU2NiIKICAgaW5rc2NhcGU6ZXhwb3J0LXlkcGk9IjM1LjY0MzU2NiI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhOCI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczYiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxODYzIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwNTYiCiAgICAgaWQ9Im5hbWVkdmlldzQiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjEyLjcwMjcwMiIKICAgICBpbmtzY2FwZTpjeD0iNy4yNjc2Mjg5IgogICAgIGlua3NjYXBlOmN5PSIyLjI2Njk3ODkiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjU3IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIyNCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojNDEwMDY5O2ZpbGwtb3BhY2l0eToxIgogICAgIGQ9Ik0gMS44MTk1NCwyMS4xMTI5NDQgQyAwLjcwMTAwNTUxLDIwLjE3MTc2MiAwLjYxMDY1NjkyLDE4LjUyOTE5IDEuNjIxODA0OSwxNy41MTgwNCAzLjUyOTA2NzEsMTUuNjEwNzc5IDYuNDgwNjc5NSwxOC4wMzc2MDggNS4yMTk2MzgyLDIwLjQ3NjE5MyA0LjYyNjkzNzUsMjEuNjIyMzQ4IDIuODI1Nzk4OCwyMS45NTk2NTYgMS44MTk1NCwyMS4xMTI5NDQgWiBtIDguNDU3NjIzLDAuMTc5MzQyIEMgOS4xNTI3MzczLDIwLjY4MjE4IDguODI1NzM0NiwxOC43MjkwNjYgOS42NzgzNjExLDE3LjcxNTc3OCBjIDAuOTY0MTQ2OSwtMS4xNDU4MjUgMi41MzkxNzQ5LC0xLjE1NDIzNyAzLjQ5NDY5MjksLTAuMDE4NjYgMC45MDIwNTUsMS4wNzIwMzEgMC43ODIxNTUsMi41MTk2MzIgLTAuMjgyOTIyLDMuNDE1ODM0IC0wLjY0ODY3MiwwLjU0NTgyMyAtMS43OTI4MTcsMC42MjQzNTEgLTIuNjEyOTY5LDAuMTc5MzM5IHogbSA3LjkzNTU2NiwtMC4yODAxMzQgYyAtMS45ODY4NzksLTEuNzQ0NTAxIC0wLjA1OTMzLC01LjAxMDUzNiAyLjM2MDQxOCwtMy45OTk0OTggMS41Nzc5NTEsMC42NTkzMTIgMS45MDk2MDQsMi43NzQyNzQgMC42MjAzMjIsMy45NTU4MTIgLTAuOTI5MDE5LDAuODUxMzg0IC0yLjA0MjI0MSwwLjg2NzY5OCAtMi45ODA3NCwwLjA0MzY4IHogTSAxLjkwNjkzNjYsMTIuODUyNDk1IEMgMS4yODY2NywxMi4zNjQ1OTUgMC44NjU5NTc0OCwxMS41NjE4MDIgMC44NjU5NTc0OCwxMC44NjYxMjggYyAwLC0wLjc0NzgyOSAwLjcwNjk5NTYyLC0xLjczMzA4MTUgMS41MzQ5MDcwMiwtMi4xMzkwMDg0IDEuOTE3NTg5OCwtMC45NDAxOTUyIDMuODU1NDQ2LDEuNDAxNTI0NCAyLjgxODc3MzcsMy40MDYyMjk0IC0wLjU2MTUyMzYsMS4wODU4NjcgLTIuMzUyMjc3NywxLjQ3NDYxOCAtMy4zMTI3MDE2LDAuNzE5MTQ2IHogbSA4LjE5OTk2NDQsLTAuMDMwOSBDIDkuNDM5NDQ4NCwxMi4yNTczNzggOS4yMDg4MDI1LDExLjc0MTQ5NiA5LjIwODgwMjUsMTAuODEyODQzIGMgMCwtMS41OTY1OTI2IDEuNjA0NzQyNSwtMi43MzQ5OTMyIDMuMDIxMTM2NSwtMi4xNDMxODU4IDEuNzI4NjM1LDAuNzIyMjcxIDIuMDgwMTY4LDIuOTA1NjE0OCAwLjY2MDE5Myw0LjEwMDQ0MjggLTAuNzQ4ODA2LDAuNjMwMDc5IC0yLjA2OTg3MywwLjY1NDUyIC0yLjc4MzIzMSwwLjA1MTUgeiBtIDguMDc5NDcyLC0wLjE4NDU4NyBjIC0xLjI4OTA3OSwtMS4xODEzNTMgLTAuOTgyMDAxLC0zLjE3OTI4OTYgMC41OTU5MzEsLTMuODc3MjgyMiAyLjA3NTY4LC0wLjkxODE3MiAzLjkyNDY0MywxLjE3NTI5OTggMi45MTU3NjcsMy4zMDEzNTAyIC0wLjM2NjgwOSwwLjc3Mjk5MiAtMS4wODk2ODksMS4xNzg1ODIgLTIuMTAwNTc4LDEuMTc4NTgyIC0wLjU5MTY4MiwwIC0wLjg5NDc1LC0wLjEyOTQzIC0xLjQxMTEyLC0wLjYwMjY1IHogTSAyLjM1MjgyNTksNC43NTk5Mzk0IEMgMS41NjU1MDMyLDQuMzYxMzcyNyAwLjg2NTk1NzQ4LDMuMzYxODI5MSAwLjg2NTk1NzQ4LDIuNjM1NDMyOSBjIDAsLTEuMjQ1OTY2OSAxLjA3MzE0MDMyLC0yLjM3MzUzMjE5IDIuMjU4OTY3MDIsLTIuMzczNTMyMTkgMS40NTAwNjY3LDAgMi4zNzY2NjU4LDAuOTE4NTQyODkgMi4zNzUyNTM2LDIuMzU0NTk5MTkgLTAuMDAxNjksMS43NDIxNzM2IC0xLjY4MDk0NjQsMi44ODU3ODA3IC0zLjE0NzM1MjIsMi4xNDM0Mzk1IHogbSA4LjIzMDcyNjEsMC4wNjU5NzUgQyA5LjcwMDExNTMsNC40MzAxMDIgOS4yMDg4MDI1LDMuNjgxMjUwNCA5LjIwODgwMjUsMi43MzA1NDU4IGMgMCwtMS41NzA2NTcxIDAuODQ3MzYyNSwtMi40Njg2NDQ3OCAyLjMyOTQ3MjUsLTIuNDY4NjQ0NzggMC43MjYxLDAgMC45NTQ4MTksMC4wOTU0NzMgMS40NzUwNzIsMC42MTU3MjY3MyAwLjgwNTUxMywwLjgwNTUxMTE1IDAuOTg3MzE3LDEuNzI0ODQwMDUgMC41MjUwNDYsMi42NTUwMzU2NSAtMC42MTY5OTcsMS4yNDE1NDQ4IC0xLjg1Nzk3NywxLjc4NDY4NzMgLTIuOTU0ODQxLDEuMjkzMjUwOSB6IG0gOC4xNTkxMSwtMC4wOTI3MjQgYyAtMS41MzkyMzMsLTAuNzAzODI1NSAtMS44MjY4OCwtMi43MDQyMjc4IC0wLjU1NjI4OSwtMy44Njg2Mzc2NSAxLjUzMzQyMywtMS40MDUyNzU5NCAzLjgxNzc4MywtMC4zMDU3ODE1IDMuODEzNTY5LDEuODM1NTIzODUgLTAuMDAzNCwxLjY2MDQwOCAtMS43MjM3OSwyLjczNDMxNjYgLTMuMjU3MjgsMi4wMzMxMTM4IHoiCiAgICAgaWQ9InBhdGg0MTM4IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3NzY3Nzc3Nzc3Nzc3NzIiAvPgo8L3N2Zz4K';

class Scratch3RobotBase extends Scratch3RosBase {

    constructor(extensionName, extensionId, soundServer, runtime, masterURI) {
        super(extensionName, extensionId, runtime, masterURI);
        this.app_list = [{name:'app', text:'App'}];
        this.active_apps = [];
        this.sound_server = soundServer;
        this.icon = icon;

        this._stopApps = this._stopApps.bind(this);
        this.runtime.on('PROJECT_STOP_ALL', this._stopApps.bind(this));
    }

    _stopApp (app) {
        var msg = {name: app.name};
        this.ros.getParam('/robot/name').get(robotName =>
            this.ros.callService('/' + robotName + '/stop_app', msg).then(res => res.message));
    }

    _stopApps () {
        for (const app of this.active_apps) {
            console.log('Stopping ' + app.text + ' app ...');
            this._stopApp(app);
        }
    }

    _appNames () {
        if (this.ros) {
            const that = this;
            this.ros.getParam('/robot/name').get(robotName =>
              this.ros.callService('/' + robotName + '/list_apps', {}).
                then(res =>
                     that.app_list = res.available_apps.map(val => ({name: val.name, text: val.display_name}))));
        };
        return this.app_list;
    }

    _waitPromise (p) {
        return new Promise(resolve => {
            p.then(val => resolve());
        });
    }

    _waitMessage (topic, test) {
        const that = this;
        return new Promise(resolve => {
            that.ros.getTopic(topic).then(rosTopic => {
                if (!rosTopic.messageType) resolve();
                rosTopic.subscribe(msg => {
                    if (test(msg)) {
                        rosTopic.unsubscribe();
                        resolve();
                    }
                })
            });
        });
    }

    _waitApp (app, robotName) {
        var statusTopic = '/' + robotName + '/application/app_status';
        var expectedStart = "launching " + app.text;
        var expectedStop = "stopping " + app.text;
        return new Promise(resolve => {
            this._waitMessage(statusTopic,
                              msg => msg.status == expectedStart).
                then(val => {
                    this._waitMessage(statusTopic,
                                      msg => msg.status == expectedStop).
                        then(val => {
                            this.active_apps.splice(this.active_apps.indexOf(app));
                            resolve();
                        });
                });
        });
    }

    query ({TEXT}) {
        return confirm(TEXT);
    }

    playSound ({SOUND, WAIT}) {
        SOUND = Cast.toNumber(SOUND);
        WAIT = Cast.toBoolean(WAIT);
        const msg = {
            sound_request: {
                sound: SOUND,
                command: 1,
                volume: 1.0
            }
        }
        if (WAIT) {
            return this._waitPromise(this.ros.callSyncAction(this.sound_server, msg));
        }
        else {
            this.ros.callAction(this.sound_server, msg);
        }
    }

    speakText ({TEXT, WAIT}) {
        WAIT = Cast.toBoolean(WAIT);
        const msg = {
            sound_request: {
                sound: -3,
                command: 1,
                volume: 1.0,
                arg: TEXT
            }
        }
        if (WAIT) {
            return this._waitPromise(this.ros.callSyncAction(this.sound_server, msg));
        }
        else {
            this.ros.callAction(this.sound_server, msg);
        }
    }

    callApp ({APP, WAIT}) {
        WAIT = Cast.toBoolean(WAIT);
        var app = this.app_list.find(val => val.text === APP);
        if (!app) {
            console.log("Unknown app: " + APP);
            return;
        }
        var msg = {name: app.name};
        return new Promise(resolve => {
            this.ros.getParam('/robot/name').get(robotName => {
                this.active_apps.push(app);
                this.ros.callService('/' + robotName + '/start_app', msg).then(res => res.message);
                if (WAIT) {
                    this._waitApp(app, robotName).then(val => resolve());
                }
                else {
                    this._waitApp(app, robotName);
                    resolve();
                }
            });
        });
    }

    stopApp ({APP}) {
        var app = this.app_list.find(val => val.text === APP);
        if (!app) {
            console.log("Unknown app: " + APP);
            return;
        }
        this._stopApp(app);
    }
}

module.exports = Scratch3RobotBase;