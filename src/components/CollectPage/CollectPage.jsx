import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Navigationleft from 'material-ui/svg-icons/navigation/arrow-back';
import {hashHistory} from 'react-router';
import CardLists from '../CardLists';

import { getCollected} from '../../store';
import Lazyload from '../../lib/lazyload';

let lazy=null;  // 懒加载实例

class CollectPage extends Component{
    constructor(props){
        super(props);
        this.state={
            items:getCollected()
        };
    }

    // 改变收藏状态
    changeCollect(item, index){
        this.setState({
            items:getCollected()
        });
    }

    render(){
        return (
            <div className='page'>
                <AppBar 
                    title='我的收藏'
                    titleStyle={{textAlign:'center'}}
                    iconElementLeft={<IconButton onTouchTap={hashHistory.goBack}><Navigationleft/></IconButton>}
                />
                <div className='page-container' id='page_collect'>
                    <CardLists items={this.state.items} changeCollect={this.changeCollect.bind(this)}/>
                </div>
            </div>
        );
    }

    componentDidMount(){
        // 图片懒加载
        lazy = new Lazyload({
            wrap:'#page_collect',
        });
    }

    componentWillUnmount(){
        lazy.destory();
    }
}

export default CollectPage;