import React from "react";
import Button from './Button';
import PropTypes from 'prop-types';
import { SORTS } from "./App";
import classNames from "classnames";


// const isSearched = searchTerm => item =>
//     item.title.toLowerCase().includes(searchTerm.toLowerCase());
const Sort = ({sortKey, activeSortKey, onSort, children}) => {
    const sortClass = classNames(
        'button-inline',
        {'button-active': sortKey === activeSortKey}
    );
    return(
    <Button
     className={sortClass} 
     onClick={() => onSort(sortKey)}>
        {children}
     </Button>
    );
}

 const Table = ({list, sortKey, isSortReverse, onSort, onDismiss}) =>{
    const largeColumn = {
        width: "40%",
    };
    const midColumn = {
        width: "30%",
    };
    const smallColumn = {
        width: "10%",
    };

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return(
        <div className="table">
            <div className="table-header">
                <span style={{ width: '40%' }}>
                    <Sort sortKey={'TITLE'} onSort={onSort} activeSortKey={sortKey} > Title </Sort>
                </span> 
                <span style={{ width: '30%' }}>
                    <Sort sortKey={'AUTHOR'} onSort={onSort} activeSortKey={sortKey} > Author </Sort>
                </span> <span style={{ width: '10%' }}>
                    <Sort sortKey={'COMMENTS'} onSort={onSort} activeSortKey={sortKey} > Comments </Sort>
                </span> <span style={{ width: '10%' }}>
                    <Sort sortKey={'POINTS'} onSort={onSort} activeSortKey={sortKey} > Points </Sort>
                </span> <span style={{ width: '10%' }}> Archive </span> 
            </div>
            {reverseSortedList.map(item => 
            <div key={item.objectID} className="table-row">
            <span style={largeColumn}><a href={item.url}>{item.title}</a></span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
            <Button 
                onClick={()=> onDismiss(item.objectID)}
                className="button-inline" 
                >Dismiss
            </Button>
            </span>            
            </div>  
            )}
        </div>
    )
}

Table.propTypes = {
    list: PropTypes.array.isRequired,
    onDismiss: PropTypes.func.isRequired,
}

export default Table;