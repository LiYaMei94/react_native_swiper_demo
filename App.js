/*
 * @Author:1016112504@qq.com
 * @Date: 2019-11-08 15:33:50
 * @LastEditTime: 2019-11-08 18:24:18
 * @LastEditors: Please set LastEditors
 * @Description: 使用swiper组件
 * @FilePath: \react_native_appc:\Users\123\Desktop\react_native_swiper\App.js
 */


import React, { Component } from 'react';
import { Dimensions, StyleSheet, View ,YellowBox,Text,Image} from 'react-native';
import Swiper from './src/components/swiper';
const data=[
    require('./src/images/swiper/spring.jpg'),
    require('./src/images/swiper/summer.jpg'),
    require('./src/images/swiper/autumn.jpg'),
    require('./src/images/swiper/winter.jpg')
];
const { height, width } = Dimensions.get('window');
export default class App extends React.Component {
    constructor(props) {
        super(props);
        YellowBox.ignoreWarnings([
            'Warning: componentWillMount is deprecated',
            'Warning: componentWillReceiveProps is deprecated',
            'Warning: componentWillMount has been renamed',
            'Warning: componentWillReceiveProps has been renamed',
        ]);
        
    }
    
    renderRow(item, index){
        return (
            <View style={{width:'100%',height:'100%',backgroundColor:"#fff",justifyContent:"center",alignItems:"center",borderRadius:12}} key={index} >
                <Image style={{width:'100%',height:'100%',borderRadius:12}} source={item}></Image>
            </View>
        
        )
    }
    _SwiperButtonNext(){
        return(
            <Text></Text>
        )
    }
    _SwiperButtonPrev(){
        return(
            <Text></Text>
        )
    }
    render() {
        //console.log(cardArr)
        return (
            <View style={{backgroundColor:'#eee',flex:1}}>
                <Swiper style={{}}
                    dataSource={data}
                    width={ width }
                    height={400 }
                    //horizontal={false}
                    renderRow={this.renderRow.bind(this)}
                    onPress={this.onPressRow} 
                    ratio={0.8} //每一个的的宽度 
                    loop={false}//是否循环
                    autoplay={false}//是否自动播放
                    ref={ref=>this.Swiper=ref}
                    isHighChange={true}//高是否一样
                    isShowPagination={false}//是否显示分页器
                    paginationItemStyle={{}}//分页器的样式
                    //activeTintColor='red'//分页器激活背景色
                    //inactiveTintColor='yellow'//分页器默认背景色
                    isShowNavigationButtons={false}//是否显示前进后退按钮
                    //SwiperButtonNext={this._SwiperButtonNext.bind(this)}//前进按钮渲染
                    //SwiperButtonPrev={this._SwiperButtonPrev.bind(this)}//后退按钮渲染
                    SwiperButtonIconColor='#fff'//前进后退按钮图标的颜色
                    onDidChange={(obj,index)=>{
                        
                    }}
                />

                
            </View>
        )
    }
}

/*
<Swiper style={{width: width,height: 220}}
    dataSource={data}
    width={ width }
    height={220 }
    horizontal={false}
    renderRow={this.renderRow.bind(this)}
    onPress={this.onPressRow} 
    ratio={1} //每一个的的宽度 
    loop={true}//是否循环
    autoplay={false}//是否自动播放
    ref={ref=>this.Swiper=ref}
    isHighChange={true}//高是否一样
    isShowPagination={true}//是否显示分页器
    paginationItem={{}}//分页器的样式
    //activeTintColor='red'//分页器激活背景色
    //inactiveTintColor='yellow'//分页器默认背景色
    isShowNavigationButtons={true}//是否显示前进后退按钮
    //SwiperButtonNext={this._SwiperButtonNext.bind(this)}//前进按钮渲染
    //SwiperButtonPrev={this._SwiperButtonPrev.bind(this)}//后退按钮渲染
    //SwiperButtonIconColor='red'//前进后退按钮图标的颜色
    onDidChange={(obj,index)=>{
        
    }}
/>
*/
const styles = StyleSheet.create({
    
});
