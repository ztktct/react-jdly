import React, {Component} from 'react';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import {hashHistory} from 'react-router';
import CardLists from '../CardLists';
import Loading from '../Loading';

import {websit, getCollected} from '../../store';
import Lazyload from '../../lib/lazyload';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,      // 是否正在加载,为了防止一次发送多次请求
            page: 1,            // 当前获取到的页数
            cardLists: [],      // 列表内容
        };
    }

    // 改变收藏状态
    changeCollect(item, index){
        this.state.cardLists[index].collected = item.collected;
        this.setState({
            cardLists:this.state.cardLists
        });
    }

    // 得到第page页的数据
    getListsData(page) {

        // 开始加载
        this.setState({
            loading:true
        });

        return new Promise( resolve => {
            fetch(websit + '/index?page=' + page)
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    // 已经获取到数据，停止加载
                    this.setState({
                        loading:false
                    });

                    // 检测是否已经收藏
                    let newData = this.state.cardLists.concat(json);
                    let collectData = getCollected();
                    collectData.forEach( item =>{
                        newData.forEach( data =>{
                            if(item.pid == data.pid){
                                data.collected = true;
                            }
                        });
                    });

                    this.setState({
                        page: page + 1,
                        cardLists: newData
                    });

                    resolve();
                })
                .catch(error => {
                    console.log(error);
                });
        });
        
    }

    render() {
        return (
            <section className='main-page'>
                <div className='page'>
                    {/*头部标签*/}
                    <AppBar
                        className='appBar'
                        title="绝对领域"
                        iconElementRight={<IconButton onTouchTap={hashHistory.push.bind(null, '/collect')}><ActionFavorite /></IconButton>}
                        />
                    {/* 列表页 */}
                    <div className="page-container" ref='pageScroll'>
                        {/* 接受两个props */}
                        <CardLists items={this.state.cardLists} changeCollect={this.changeCollect.bind(this)}/>
                        <Loading />
                    </div>
                </div>

                { /* 主页面不能销毁，故子页面放置其中*/ }
                <ReactCSSTransitionGroup
                    className='page-animation'
                    transitionName="page-transition"
                    transitionAppear={true}
                    component='div'
                    transitionEnterTimeout={300}
                    transitionAppearTimeout={300}
                    transitionLeaveTimeout={300} >
                    {this.props.children}
                </ReactCSSTransitionGroup>

            </section>
        );
    }

    componentDidMount() {
        let _self = this;
        // 组件加载完毕后获取第一页数据
        // 数据获取完毕后开启图片懒加载
        this.getListsData(this.state.page)
            .then( ()=>{
                // 图片懒加载
                const lz = new Lazyload({
                    wrap:'.page-container',
                    watch:true,
                });
            });

        // 上拉加载
        const pageScroll = this.refs.pageScroll;
        pageScroll.addEventListener('scroll', function () {
            // 如果正在加载，则不再检测
            if(_self.state.loading) return false;

            let scrollHeight = this.scrollHeight;
            let scrollTop = this.scrollTop;
            let clientHeight = this.offsetHeight;

            // 如果滚动高度>=scrollHeight - clientHeight，表示已经滚动到底部，可以开始加载下一页数据
            // 提高用户体验，可以提前一屏开始加载
            if (scrollTop >= scrollHeight - clientHeight * 2) {
                _self.getListsData(_self.state.page);
            }
        });

        
    }

    componentWillUnmount() {
        console.log('NO!Home page can\'t be unmounted!');
    }
}

export default HomePage;