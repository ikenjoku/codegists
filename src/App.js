import React, { Component } from 'react';
import './App.css';
import Search from './Search';
import Table from './Table';
import Button from './Button';
import Loading from './Loading';
import {DEFAULT_QUERY, DEFAULT_HPP, PATH_BASE, PATH_SEARCH, PARAM_SEARCH, PARAM_PAGE, PARAM_HPP} from './constants/index.js';
import PropTypes from 'prop-types';
import { sortBy } from "lodash";

export const SORTS = {
  NONE: list => list, 
  TITLE: list => sortBy(list, 'title'), 
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
        const {searchKey, results} = prevState;
        const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
        const updatedHits = [...oldHits, ...hits];

        return{
        results: {...results, [searchKey] : {hits:updatedHits, page:page}},
        isLoading: false,
      };
      }

class App extends Component {
  constructor(props){
      super(props);
      this.state = {
        results: null,
        searchKey: '',
        searchTerm: DEFAULT_QUERY,
        error: null,
        isLoading: false,
        sortKey: 'NONE',
        isSortReverse: false,
      };

      this.onDismiss = this.onDismiss.bind(this);
     this.onSearchChange = this.onSearchChange.bind(this);
     this.setSearchTopStories = this.setSearchTopStories.bind(this);
     this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
     this.onSearchSubmit = this.onSearchSubmit.bind(this);
     this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
     this.onSort = this.onSort.bind(this);
    }

    onSort(sortKey){
      const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;

      this.setState({sortKey, isSortReverse});
    }

    needsToSearchTopStories(searchTerm){
      return !this.state.results[searchTerm];
    }

    onSearchSubmit(event){
      event.preventDefault();
      const {searchTerm} = this.state;
      this.setState({searchKey: searchTerm});
      if(this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm);
      }
    }

    setSearchTopStories(result){
      const {hits, page} = result;
      this.setState(updateSearchTopStoriesState(hits, page));
    }

    fetchSearchTopStories(searchTerm, page = 0){
      this.setState({isLoading: true});

      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => this.setState({error: e}));
    }

    onDismiss(id){
      const {searchKey, results} = this.state;
      const {hits, page} = results[searchKey];

      const isNotId = item => item.objectID !== id;
      const updatedHits = hits.filter(isNotId);
      this.setState({
        results: {...results, [searchKey]: {hits: updatedHits, page}}
      });
    }

    onSearchChange(event){
      this.setState({searchTerm: event.target.value})
    }

    componentDidMount(){
      const {searchTerm} = this.state;
      this.setState({searchKey: searchTerm});
      this.fetchSearchTopStories(searchTerm);
    }

  render() {
    const {searchTerm, results, searchKey, error, isLoading, sortKey, isSortReverse} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
      <div className="interactions">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}>
            Search
          </Search>
      </div>
      { error ?
        <div className="interactions">
          <p>Somethings went wrong</p>
        </div>
        :
        <Table
          list={list}
          sortKey={sortKey}
          onSort={this.onSort}
          isSortReverse={isSortReverse}
          onDismiss={this.onDismiss} />
      }
      <div className="interactions">
      { isLoading ?
        <Loading />
        :
        <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>More</Button>
      }
      </div>
      </div>
    );
  }
}

export default App;
