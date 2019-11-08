/*
 * @Description: react-native轮播图
 * @Author: 1016112504@qq.com
 * @Date: 2019-10-18 17:26:00
 * @LastEditTime: 2019-11-08 18:55:31
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TouchableWithoutFeedback,
    ScrollView,
    Animated,
    InteractionManager,
    StyleSheet,
    TouchableHighlight,
    Text,
    Image
} from 'react-native'

export default class RNSwiper extends Component{
    /**
     *轮播图的属性检测
     *
     * @static
     * @memberof RNSwiper
     */
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        offset: PropTypes.number,
        index: PropTypes.number,
        horizontal: PropTypes.bool,
        loop: PropTypes.bool,
        ratio: PropTypes.number,
        autoplay:PropTypes.bool,
        autoplayTimeout: PropTypes.number,
        autoplayDirection: PropTypes.bool,
        cardParams: PropTypes.object,
        dataSource:PropTypes.array,
        isHighChange: PropTypes.bool,

        isShowPagination:PropTypes.bool,
        paginationItemStyle:PropTypes.object,
        activeTintColor:PropTypes.string,
        inactiveTintColor:PropTypes.string,
        isShowNavigationButtons:PropTypes.bool,
        SwiperButtonNext:PropTypes.func,
        SwiperButtonPrev:PropTypes.func,
        SwiperButtonIconColor:PropTypes.string,

        renderRow: PropTypes.func.isRequired,
        onPress: PropTypes.func,
        onWillChange: PropTypes.func,
        onDidChange: PropTypes.func,
        
    };

    /**
     *轮播图的默认属性
     *
     * @static
     * @memberof RNSwiper
     */
    static defaultProps = {
        offset: 0,
        index: 0,
        horizontal: true,
        loop: false,
        ratio: 1,
        autoplay:false,
        autoplayTimeout: 2,//自动播放的间隔时间
        autoplayDirection: true,
        cardParams: {},
        isHighChange:false,
        isShowPagination:false,
        paginationItemStyle:{},
        activeTintColor: 'red',
        inactiveTintColor: '#000',
        isShowNavigationButtons:false,
        SwiperButtonNext:null,
        SwiperButtonPrev:null,
        SwiperButtonIconColor:'#000'
    };

    constructor(props) {
        super(props);

        this.getRenderRowViews = this.getRenderRowViews.bind(this);
        this.updateAnimated = this.updateAnimated.bind(this);
        this.autoPlay = this.autoPlay.bind(this);
        this.stopAutoPlay = this.stopAutoPlay.bind(this);

        const { 
            dataSource, 
            width, 
            height, 
            horizontal, 
            offset,
            index, 
            loop, 
            ratio, 
            autoplayTimeout, 
            autoplayDirection, 
            cardParams,
            isHighChange,
            inactiveTintColor,
            activeTintColor,
            autoplay,
            isShowNavigationButtons,
            SwiperButtonNext,
            SwiperButtonPrev,
            isShowPagination,
            SwiperButtonIconColor
        } = this.props;

        const side = horizontal ? width : height;
        const cardSide = cardParams.cardSide || side * ratio;
        const cardScale = cardParams.cardSmallSide ? (cardParams.cardSmallSide / (horizontal ? height : width)) : ratio;
        this.rnswiper = {
            horizontal: horizontal,
            scrollToDirection: horizontal ? 'x' : 'y',
            side: side,
            ratio: ratio,
            cardParams: { cardSide: cardSide, cardScale: cardScale, cardTranslate: cardParams.cardSpace ? (((side - cardSide) + (side * (1 - cardScale))) / 2 - cardParams.cardSpace) : (((side - cardSide) + (side * (1 - cardScale))) / 2 * 0.8) },
            dataSource: dataSource,
            count: dataSource.length,
            currentIndex: index,
            loop: loop,
            autoplay:autoplay,
            autoplayTimeout: autoplayTimeout,
            autoplayDirection: autoplayDirection,
            offset:offset,
            isHighChange:isHighChange,
            height:height,
            activeTintColor: activeTintColor,
            inactiveTintColor: inactiveTintColor,
            isShowNavigationButtons:isShowNavigationButtons,
            SwiperButtonPrev:SwiperButtonPrev,
            SwiperButtonNext:SwiperButtonNext,
            isShowPagination:isShowPagination,
            SwiperButtonIconColor:SwiperButtonIconColor
        }

        this.scrollIndex = (this.rnswiper.loop ? this.rnswiper.currentIndex + 1 : this.rnswiper.currentIndex);


        const scaleArray = [];
        const translateArray = [];
        for (let i = 0; i < this.rnswiper.count + 2; i++) {
            scaleArray.push(new Animated.Value(1));
            translateArray.push(new Animated.Value(0));
        }
        this.state = { 
            scaleArray, 
            translateArray,
            swiperIndex:this.scrollIndex,
            initialized:false,//透明度true时为1
         };

        this.events = {
            renderRow: this.renderRow.bind(this),
            onPress: this.onPress.bind(this),
            onWillChange: this.onWillChange.bind(this),
            onDidChange: this.onDidChange.bind(this),
        };
    }

    componentWillUnmount() {
        this.stopAutoPlay();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(JSON.stringify(nextProps)==JSON.stringify(this.props)) return;
        this.stopAutoPlay();
        const { 
            dataSource, 
            width, 
            height, 
            horizontal, 
            offset,
            index, 
            loop, 
            ratio, 
            autoplayTimeout, 
            autoplayDirection, 
            cardParams 
        } = nextProps;

        
        const side = horizontal ? width : height;
        const cardSide = cardParams.cardSide || side * ratio;
        const cardScale = cardParams.cardSmallSide ? (cardParams.cardSmallSide / (horizontal ? height : width)) : ratio;
        this.rnswiper = {
            horizontal: horizontal,
            scrollToDirection: horizontal ? 'x' : 'y',
            side: side,
            ratio: ratio,
            cardParams: { cardSide: cardSide, cardScale: cardScale, cardTranslate: cardParams.cardSpace ? (((side - cardSide) + (side * (1 - cardScale))) / 2 - cardParams.cardSpace) : (((side - cardSide) + (side * (1 - cardScale))) / 2 * 0.8) },
            dataSource: dataSource,
            count: dataSource.length,
            currentIndex: index,
            loop: loop,
            autoplayTimeout: autoplayTimeout,
            autoplayDirection: autoplayDirection,
            offset:offset,
        }

        this.scrollIndex = (this.rnswiper.loop ? this.rnswiper.currentIndex + 1 : this.rnswiper.currentIndex)        

        if (this.props.dataSource.length !== dataSource.length) {
            const scaleArray = [];
            const translateArray = [];
            for (let i = 0; i < this.rnswiper.count + 4; i++) {
                scaleArray.push(new Animated.Value(1));
                translateArray.push(new Animated.Value(0));
            }
            this.setState({ scaleArray, translateArray,swiperIndex:this.scrollIndex});
        }

    }

    componentDidMount() {
        setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                this.scrollView && this.scrollView.scrollTo({ [this.rnswiper.scrollToDirection]: (this.rnswiper.side * this.scrollIndex), animated: false });
                this.updateAnimated(this.scrollIndex, this.scrollIndex);
                this.setState({ initialized: true });
            });
        }, 1);

    }


    /**
     * 公共方法：滑到指定页
     * @param {number} index 
     * @param {bool} animated
     */
    scrollTo(index, animated = true) {
        this.scrollView && this.scrollView.scrollTo({ [this.rnswiper.scrollToDirection]: this.rnswiper.side * index, animated: animated });
    }

    /**
     * 更新动画
     * @param {number} index 
     * @param {number} scrollIndex
     */
    updateAnimated(currentPageFloat, scrollIndex) {
        const { scaleArray, translateArray } = this.state;
        for (let i = 0; i < this.rnswiper.count + 2; i++) {
            if (i === scrollIndex) {
                translateArray[i].setValue(this.rnswiper.cardParams.cardTranslate * (currentPageFloat - scrollIndex));
            } else if (i === scrollIndex - 1 || i === scrollIndex + 1) {
                translateArray[i].setValue((currentPageFloat - i) * this.rnswiper.cardParams.cardTranslate);
            } else {
                translateArray[i].setValue((currentPageFloat - i) * this.rnswiper.cardParams.cardTranslate);
            }
            if(!this.rnswiper.isHighChange){
                if (i === scrollIndex) {
                    scaleArray[i].setValue(1 - Math.abs(currentPageFloat - scrollIndex) * (1 - this.rnswiper.cardParams.cardScale));
                } else if (i === scrollIndex - 1 || i === scrollIndex + 1) {
                    scaleArray[i].setValue(this.rnswiper.cardParams.cardScale + Math.abs(currentPageFloat - scrollIndex) * (1 - this.rnswiper.cardParams.cardScale));
                } else {
                    scaleArray[i].setValue(this.rnswiper.cardParams.cardScale);
                }
            }
        }
    }

    /**
     *自动播放
     *
     * @memberof RNSwiper
     */
    autoPlay() {
        this.stopAutoPlay();
        if(this.rnswiper.autoplay){
            this.autoPlayTimer = setTimeout(() => {
                this.scrollTo(this.scrollIndex + (this.rnswiper.autoplayDirection ? 1 : -1));
            }, this.rnswiper.autoplayTimeout * 1000);
        }
    }
    /**
     *关闭自动播放
     *
     * @memberof RNSwiper
     */
    stopAutoPlay() {
        this.autoPlayTimer && clearTimeout(this.autoPlayTimer);
    }

    /**
    | -------------------------------------------------------
    | 轮播图事件
    | -------------------------------------------------------
    */
    renderRow(obj, index) {
        if (typeof this.props.renderRow === 'function') {
            return this.props.renderRow(...arguments);
        }
    }

    onPress(obj, index) {
        if (typeof this.props.onPress === 'function') {
            return this.props.onPress(...arguments);
        }
    }

    onWillChange(obj, index) {
        if (typeof this.props.onWillChange === 'function') {
            return this.props.onWillChange(...arguments);
        }
    }

    onDidChange(obj, index) {
        if (typeof this.props.onDidChange === 'function') {
            return this.props.onDidChange(...arguments);
        }
    }
    /**
    | -------------------------------------------------------
    | ScrollView delegate
    | -------------------------------------------------------
    */
    onScroll(e) {
        if (this.scrollView) {
            this.stopAutoPlay();
            let offset = e.nativeEvent.contentOffset[this.rnswiper.scrollToDirection];
            if (this.rnswiper.loop) {
                if (Math.abs(offset - ((this.rnswiper.count + 1) * this.rnswiper.side)) < 20.1) {
                    offset = this.rnswiper.side
                    this.scrollView.scrollTo({ [this.rnswiper.scrollToDirection]: offset, animated: false });
                } else if (Math.abs(offset) < 20.1) {
                    offset = this.rnswiper.side * this.rnswiper.count
                    this.scrollView.scrollTo({ [this.rnswiper.scrollToDirection]: offset, animated: false });
                }
            }

            let currentPageFloat = offset / this.rnswiper.side;
            const currentPageInt = currentPageFloat % 1;
            if (currentPageInt === 0 || currentPageInt >= 0.9) {
                this.willIndex = undefined;
                this.scrollIndex = Math.ceil(currentPageFloat);
                this.autoPlay();
            }



            const willIndex = Math.round(currentPageFloat);
            if (this.willIndex === undefined && willIndex !== this.scrollIndex) {
                this.willIndex = willIndex;
                const dataSourceIndex = this.rnswiper.loop ? (this.willIndex + this.rnswiper.count - 1) % this.rnswiper.count : this.willIndex;
                this.onWillChange(this.rnswiper.dataSource[dataSourceIndex], dataSourceIndex);
            }

            const oldIndex = this.rnswiper.currentIndex;
            this.rnswiper.currentIndex = this.rnswiper.loop ? (this.scrollIndex + this.rnswiper.count - 1) % this.rnswiper.count : this.scrollIndex;
            if (oldIndex !== this.rnswiper.currentIndex) {
                this.onDidChange(this.rnswiper.dataSource[this.rnswiper.currentIndex], this.rnswiper.currentIndex);
            }

            this.updateAnimated(currentPageFloat, this.scrollIndex);

            this.setState({
                swiperIndex:this.scrollIndex
            })

        }
    }

    /**
    | -------------------------------------------------------
    | Render
    | -------------------------------------------------------
    */
    getRenderRowViews() {
        const { scaleArray, translateArray } = this.state;
        const { width, height } = this.props;

        const count = this.rnswiper.count + (this.rnswiper.loop ? 2 : 0);
        const margin = (this.rnswiper.side - this.rnswiper.cardParams.cardSide) / 2;
        const views = [];
        const maxIndex = this.rnswiper.count - 1;

        for (let i = 0; i < count; i++) {
            const dataSourceIndex = this.rnswiper.loop ? (i + maxIndex) % this.rnswiper.count : i;
            const currentItem = this.rnswiper.dataSource[dataSourceIndex];
            views.push(
                <View key={i} style={{ flexDirection: this.rnswiper.horizontal ? 'row' : 'column' }}>
                    <View style={{ [this.rnswiper.horizontal ? 'width' : 'height']: margin + this.rnswiper.offset, backgroundColor: 'transparent' }} />
                    <TouchableWithoutFeedback accessible={!!this.props.onPress} onPress={() => this.events.onPress(currentItem, dataSourceIndex)}>
                        <Animated.View style={{ 
                            backgroundColor: 'transparent', 
                            width: this.rnswiper.horizontal ? this.rnswiper.cardParams.cardSide : width, 
                            height: this.rnswiper.horizontal ? height : this.rnswiper.cardParams.cardSide, 
                            transform: [
                                { [this.rnswiper.horizontal ? 'scaleY' : 'scaleX']: scaleArray[i] }, 
                                { [this.rnswiper.horizontal ? 'translateX' : 'translateY']: translateArray[i] }] }} >
                            {this.events.renderRow(currentItem, dataSourceIndex)}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                    <View style={{ [this.rnswiper.horizontal ? 'width' : 'height']: margin - this.rnswiper.offset, backgroundColor: 'transparent' }} />
                </View>
            );
        }
        return views;
    }

    
    /**
     *分页器渲染
     *
     */
    paginationRender(){
        let {swiperIndex,initialized}=this.state;
        let {loop,count,activeTintColor,inactiveTintColor,isShowPagination}=this.rnswiper;
        const horizontal=this.rnswiper.horizontal;
        count=loop?count+2:count;
        let paginations=new Array(count).join(',').split(',');
        
        if(!isShowPagination||!initialized){
            return null;
        }
        return(
            <View style={[horizontal?styles.horizontalPagination:styles.pagination]}>
                {
                    paginations.map((item,index)=>{
                        if((index==0||index==paginations.length-1)&&loop){
                            return null;
                        }
                        return(
                            <TouchableHighlight
                                underlayColor='transparent'
                                key={index}
                                style={{minWidth:30,minHeight:30,justifyContent:"center",alignItems:"center"}}
                                onPress={()=>this.paginationPress(index)}  >
                                <Text  style={[styles.paginationItem,
                                        {backgroundColor:swiperIndex==index?activeTintColor:inactiveTintColor},
                                        this.props.paginationItemStyle]}></Text>
                            </TouchableHighlight>
                        )
                    })
                }
            </View>
        )
    }
    paginationPress(index){
        this.stopAutoPlay();
        this.scrollTo(index);
    }
    
    /**
     *前进后退按钮事件
     *
     * @param {*} state
     * @memberof Swiper
     */
    navigationEvent(state){
        let {swiperIndex}=this.state;
        const {loop,dataSource}=this.rnswiper;
        let maxIndex=loop?dataSource.length+1:dataSource.length-1;
        if(state=='prev'){
            swiperIndex>0?swiperIndex=swiperIndex-1:0;
        }else{
            swiperIndex<maxIndex?swiperIndex=swiperIndex+1:swiperIndex;
        }
        this.stopAutoPlay();
        this.scrollTo(swiperIndex);
    }

    /**
     *前进按钮渲染
     *
     * @returns
     * @memberof RNSwiper
     */
    _SwiperButtonNextRender(){
        const {initialized}=this.state;
        const {isShowNavigationButtons,SwiperButtonNext,SwiperButtonIconColor,horizontal}=this.rnswiper;
        if(!isShowNavigationButtons||!initialized||!horizontal){
            return null;
        }
        return(
            <TouchableHighlight
                style={[styles.swiperButton,styles.swiperButtonNext]}
                underlayColor='transparent'
                onPress={()=>this.navigationEvent('next')}
            >
                {SwiperButtonNext?SwiperButtonNext():
                <Image  source={require('../images/next.png')} style={[styles.swiperButtonIcon,{tintColor:SwiperButtonIconColor}]}></Image>}
            </TouchableHighlight>
        )
    }
    /**
     *后退按钮渲染
     *
     * @returns
     * @memberof RNSwiper
     */
    _SwiperButtonPrevRender(){
        const {initialized}=this.state;
        const {isShowNavigationButtons,SwiperButtonPrev,SwiperButtonIconColor,horizontal}=this.rnswiper;
        if(!isShowNavigationButtons||!initialized||!horizontal){
            return null;
        }
        return(
            <TouchableHighlight
                    style={[styles.swiperButton,styles.swiperButtonPrev]}
                    underlayColor='transparent'
                    onPress={()=>this.navigationEvent('prev')}
                >
                {SwiperButtonPrev?SwiperButtonPrev():
                <Image source={require('../images/prev.png')} style={[styles.swiperButtonIcon,{tintColor:SwiperButtonIconColor}]}></Image>}
            </TouchableHighlight>
        )
    }
    render() {
        return (
            <View style={[this.props.style, 
                { overflow: 'hidden',justifyContent:"center",alignItems:"center", }]}>
                <ScrollView
                    style={{ backgroundColor: 'transparent', opacity: this.state.initialized ? 1 : 0 }}
                    horizontal={this.rnswiper.horizontal}
                    pagingEnabled
                    ref={(ref)=>this.scrollView=ref}
                    onScroll={e => this.onScroll(e)}
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onLayout={event => {
                        // event.nativeEvent.layout.width
                    }}
                >
                    {this.getRenderRowViews()}
                </ScrollView>
                {this.paginationRender()}
                {this._SwiperButtonNextRender()}
                {this._SwiperButtonPrevRender()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    horizontalPagination:{
        width:'100%',
        position:"absolute",
        bottom:10,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row"
    },
    pagination:{
        height:'100%',
        position:"absolute",
        right:20,
        justifyContent:"center",
        alignItems:"center",
    },
    paginationItem:{
        width:8,
        height:8,
        borderRadius:50,
    },
    swiperButton:{
        minWidth:35,
        minHeight:45,
        position:"absolute",
        justifyContent:"center",
        alignItems:"center"
    },
    swiperButtonNext:{
        right:15,
    },
    swiperButtonPrev:{
        left:15,
    },
    swiperButtonIcon:{
        width:'100%',
        height:'100%'
    }
});
