cc.Class({
    extends: cc.Component,

    properties: {
        nodeBoxBg: cc.Node,
        total: 6,//几项
        section: 0,//一项分多少
        resultIdx: 0,
        delayTime: 0,
    },

    initProperties() {
        this.rotationSpeed = 0;
        this.choiceIdx = -1;
        this.isFinish = false;
        this.showResult = false;
        this.initSection();
    },

    /**
     * 分盘
     */
    initSection() {
        console.log('initSection');
        this.rotaionList = [];
        let totalPath = this.section * this.total;
        let path = 360 / totalPath;
        this.path = path;
        this.pathDelRota = 360 / (totalPath);
        for (let i = 0; i < this.section; i++) {
            this.rotaionList.push(path * i);
        }
    },

    onLoad() {
        this.initProperties();
        this.initSection();
    },

    start() {
        this.init();
    },

    /**
     * @param {*} data 
     */
    init(data) {
        this.onAccelerate();
        this.node.runAction(cc.sequence(cc.delayTime(1 + this.delayTime), cc.callFunc(() => {
            console.log('已经选择了');
            this.choiceIdx = (this.total - this.resultIdx) * this.section;
        })));
    },

    /**
     * 
     * @param {*} rotation 
     */
    wacthRotaion(rotation) {
        rotation %= 360;
        rotation |= 0;
        let idx = rotation / this.path;
        idx |= 0;

        if (this.nowIdx != idx) {
            this.nowIdx = idx;
            if (this.showResult) {
                this.onDecelerate(this.pathDelRota);
            }
            if (!this.showResult && this.choiceIdx == this.nowIdx) {
                console.log('开始减速');
                console.log(rotation, this.rotationSpeed);
                this.showResult = true;
            }
            console.log('rotation=', rotation, this.rotationSpeed, idx);

        }
    },

    /**
     * 
     * @param {*} rotation 
     */
    wacthRotaion_type1(rotation) {
        rotation %= 360;
        rotation |= 0;
        let idx = rotation / this.path;
        idx |= 0;

        if (this.nowIdx != idx) {
            this.nowIdx = idx;
            // console.log('nowIdx=', idx);
            if (this.choiceIdx == this.nowIdx) {
                console.log('开始减速');
                this.onDecelerate(30);
            }
            if (this.rotationSpeed == 5) {
                this.rotationSpeed = 0;
            }
            if (this.isFinish) {
                this.onDecelerate(15);
                // if(this)
            }
            if (this.rotationSpeed == 120) {
                this.isFinish = true;
            }
        }
    },

    /**
     * 减速
     */
    onDecelerate(del = 30) {
        this.rotationSpeed -= del;
    },

    /**
     * 加速
     */
    onAccelerate() {
        if (this.accelerateAction) this.node.stopAction(this.accelerateAction);
        this.accelerateAction = cc.repeat(cc.sequence(cc.delayTime(0.25), cc.callFunc(() => {
            this.rotationSpeed += 90;
            console.log('this.rotationSpeed', this.rotationSpeed);
        })), 4);
        this.node.runAction(this.accelerateAction);
    },

    /**
     * 每一帧回调
     * @param {*} dt 
     */
    update(dt) {
        if (this.rotationSpeed >= 0) {
            this.nodeBoxBg.rotation += this.rotationSpeed * dt;
        }
        this.wacthRotaion(this.nodeBoxBg.rotation);
    },

    /**
     * 统一回收组件
     */
    onDestroy() {
    }
});