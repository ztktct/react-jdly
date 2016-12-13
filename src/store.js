// 暂时未用flux/redux

export const websit = 'http://45.248.69.240:3001/api';

// 存放收藏数据
let collectData = window.localStorage.getItem('JDLY_COLLECTED_DATA') || '[]';
collectData = JSON.parse(collectData);

function getCollected(){
    return collectData;
}

/**
 * 收藏或取消收藏
 * @param obj 
 * {
 *      collected:bollean,
 *      imgSrc:string,
 *      pid:string,
 *      title:string
 * }
 */
function collect(obj){
    let hasSame = false;
    collectData.forEach( (item, index) =>{
        // 如果已有该收藏，则取消
        if( parseInt(obj.pid) === parseInt(item.pid)){
            hasSame = true;
            collectData.splice(index, 1);
            return;
        }
    });

    // 如果没有相同的，则存储
    if(!hasSame){
        collectData.push(obj);
    }
    
    window.localStorage.setItem('JDLY_COLLECTED_DATA', JSON.stringify(collectData));

}

// 当前展示页
let currentItem = {};
// 设置当前展示页，用于获取详情页的数据和收藏状态
function setCurrentItem(obj){
    currentItem = obj;
}
function getCurrentItem(){
    return currentItem;
}


export {getCollected, collect, setCurrentItem, getCurrentItem};