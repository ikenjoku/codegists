import React, {Component} from "react";
import PropTypes from 'prop-types';

export default class Search extends Component{
    componentDidMount(){
        if (this.input){
            this.input.focus();
        }
    }

    render(){
        const {value, onChange, children, onSubmit} = this.props;
        return(
        <form onSubmit={onSubmit}>
            <input 
                type="text" 
                value={value} 
                onChange={onChange}
                ref={(node) => {this.input = node}}/>
            <button type="submit">{children}</button>
        </form>
        );
    }    
}
    Search.propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        children: PropTypes.node.isRequired,
        onSubmit: PropTypes.func.isRequired,
    };
