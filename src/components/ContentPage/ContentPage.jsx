import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Navigationleft from 'material-ui/svg-icons/navigation/arrow-back';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import {Card, CardMedia} from 'material-ui/Card';
import {hashHistory} from 'react-router';

import {websit, getCurrentItem, collect} from '../../store';
import Lazyload from '../../lib/lazyload';

import PhotoSwipe from '../../lib/photoswipe.min';
import PhotoSwipeUI_Default from '../../lib/photoswipe-ui-default';
import '../../lib/photoswipe.css';
import '../../lib/photoswipe-default-skin.css';

let lazy = null;  // 懒加载实例

// 样式定义
const styles = {
    // 标题样式
    titleStyle: {
        fontSize: '18px',
        textAlign: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    }
};

// 内容页组件
class ContentPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgLists: [],                 // 存放当前页面的图片列表
            imgListsObjs: [],             // 存放当前页面的图片列表对象
            currentItem: getCurrentItem() // 存放当前页面的信息
        };
    }

    changeCollect() {
        this.state.currentItem.collected = !this.state.currentItem.collected;
        this.setState({
            currentItem: this.state.currentItem
        });
        collect(this.state.currentItem);
    }

    showImgeSwiper(index){
        let pswpElement = document.querySelectorAll('.pswp')[0];
        let items = this.state.imgListsObjs;
        let options = {
            index: index // start at first slide
        };
        let gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    }

    render() {
        return (
            <div className='page'>
                <AppBar
                    title={this.state.currentItem.title}
                    titleStyle={styles.titleStyle}
                    iconElementLeft={<IconButton onTouchTap={hashHistory.goBack}><Navigationleft/></IconButton>}
                    iconElementRight={
                        this.state.currentItem.collected ?
                            <IconButton onTouchTap={this.changeCollect.bind(this) }><ActionFavorite color='pink'/></IconButton> :
                            <IconButton onTouchTap={this.changeCollect.bind(this) }><ActionFavoriteBorder color='pink'/></IconButton>
                    }
                    />
                <div className='page-container' id='page_content'>
                    {
                        this.state.imgLists ?
                            this.state.imgLists.map((img, index) => {
                                return (
                                    <Card key={index} style={{ marginBottom: '10px' }} onTouchTap={this.showImgeSwiper.bind(this, index)}>
                                        <CardMedia>
                                            <img src='data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==' data-resources={img} />
                                        </CardMedia>
                                    </Card>
                                );
                            }) : ''

                    }
                </div>
                <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="pswp__bg"></div>
                    <div className="pswp__scroll-wrap">
                        <div className="pswp__container">
                            <div className="pswp__item"></div>
                            <div className="pswp__item"></div>
                            <div className="pswp__item"></div>
                        </div>
                        <div className="pswp__ui pswp__ui--hidden">
                            <div className="pswp__top-bar">
                                <div className="pswp__counter"></div>
                                <button className="pswp__button pswp__button--close" title="Close (Esc)"></button>
                                <button className="pswp__button pswp__button--share" title="Share"></button>
                                <button className="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                                <button className="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                                <div className="pswp__preloader">
                                    <div className="pswp__preloader__icn">
                                        <div className="pswp__preloader__cut">
                                            <div className="pswp__preloader__donut"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                                <div className="pswp__share-tooltip"></div>
                            </div>
                            <button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
                            </button>
                            <button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
                            </button>
                            <div className="pswp__caption">
                                <div className="pswp__caption__center"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    componentDidMount() {
        let _self = this;
        let pid = _self.state.currentItem.pid;
        fetch(websit + '/inner?id=' + pid)
            .then(response => {
                return response.json();
            }).then(json => {
                _self.setState({
                    imgLists: json.imgLists
                });
                // 图片懒加载
                lazy = new Lazyload({
                    wrap: '#page_content',
                });

                json.imgLists.forEach( (img, index )=>{
                    let image = {};
                    let imgsource = new Image();
                    imgsource.src = img;
                    imgsource.onload=function(){
                        image = {
                            src: img,
                            w:this.width,
                            h:this.height
                        };
                        _self.state.imgListsObjs[index]=image;
                        _self.setState({
                            imgListsObjs:_self.state.imgListsObjs
                        });
                    };
                });
            });
    }

    componentWillUnmount() {
        lazy.destory();
    }
}


export default ContentPage;