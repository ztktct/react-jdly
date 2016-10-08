import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import {Card, CardMedia, CardText} from 'material-ui/Card';
import {Link} from 'react-router';

import {collect, setCurrentItem} from '../../store';

/**
 * props:
 * @param  {Array} items 數組，需要遍歷的數據
 * @param  {Function} changeCollect 调用父组件的方法，改变收藏状态
 */

class CardLists extends Component {
    constructor(props) {
        super(props);
    }

    // 收藏与取消收藏
    handleCollect( item, index, event){
        event.preventDefault();
        
        // 存储收藏数据到本地
        item.collected = !item.collected;
        collect(item);

        // 更改视图状态
        this.props.changeCollect(item, index);
    }

    render(){
        let cardArr = this.props.items.map( (item, index )=> {
            return (
                <Link to={'/content'} onTouchTap={setCurrentItem.bind(null, item)} className='card-link' key={item.pid}>
                    <Card className='card' >
                        <CardMedia>
                            <img src='data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==' data-resources={item.imgSrc} />
                        </CardMedia>
                        <CardText className='card-bar' style={{padding:'5px'}}>
                            <div className='card-text'>
                                {item.title}
                            </div>
                            <IconButton style={{padding:0, width:'auto', height:'auto'}} onTouchTap={this.handleCollect.bind(this, item, index)}>
                                {
                                    item.collected ?  <ActionFavorite color='pink'/> :  <ActionFavoriteBorder  color='pink'/>
                                }
                            </IconButton>
                        </CardText>
                    </Card>
                </Link>
            );
        });
        return (
            <div className='cardLists'>
                {cardArr}
            </div>
        );
    }
}

CardLists.propsTypes = {
    items: React.PropTypes.array
};

CardLists.defaultProps = {
    items:[]
};

export default CardLists;