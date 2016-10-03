import React from 'react';

const Loading = ( props )=>{
    return (
        props.loading? <div className="ball-scale-ripple-multiple"><div></div><div></div><div></div></div>: ''
    );
};

Loading.propTypes={
    loading:React.PropTypes.bool
};

Loading.defaultProps={
    loading:true
};

export default Loading;