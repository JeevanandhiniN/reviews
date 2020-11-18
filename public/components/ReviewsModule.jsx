import React from 'react';
import styled from 'styled-components';
import AllForms from './AllForms.jsx';
import SearchBar from './SearchBar.jsx';
import ReviewsList from './ReviewsList.jsx';
import axios from 'axios';

const ReviewsModuleWrapper = styled.div`
  font-family: 'Poppins', sans-serif;
  display: flex;
  justify-content: center;
  width: 600px;
  margin: 0 auto;
  margin-top: -10px;

  .mainFilters{
    background-color: white;
    margin-top: 0;
    padding-top: 12px;
  }

  h1 {
    margin-left: 22px;
  }
`;

class ReviewsModule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      attractionID: 1,
      travelerRatingFilter: [],
      travelerTypeFilter: [],
      timeOfYearFilter: [],
      languageFilter: ["allLanguages"],
      popularMentionsFilter: [],
      query: "",
      allFilters: {},

      totalReviews: [],
      totalRatings: [],
      totalLanguages: [],
      reviewsList: [],
      popularMentions: []
    };

    this.getReviews = this.getReviews.bind(this);
    this.getMetrics = this.getMetrics.bind(this);
    this.getPopularMentions = this.getPopularMentions.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind()
  }

  //when combining components, i will need to put the attractionID in state

  getReviews(attractionID, filters) {
    axios.get(`/api/attractions/${attractionID}/reviews`,
    {params: filters})
    .then((res) => {
      this.setState({
        reviewsList: res.data
      });
    })
    .catch((err) => {
      throw err;
      console.log('unsuccessful get reviews')
    })
  }


  getMetrics(attractionID) {
    axios.get(`/api/attractions/${attractionID}/reviews/metrics`)
    .then((res) => {
      this.setState({
        totalReviews: res.data[0][0].totalReviews,
        totalRatings: res.data[1],
        totalLanguages: res.data[2]
      });
    })
    .catch((err) => {
      throw err;
      console.log('unsuccessful get metrics')
    })
  }

  getPopularMentions(attractionID)
  {
    axios.get(`/api/attractions/${attractionID}/reviews/keywords`)
    .then((res) => {
      this.setState({
        popularMentions: res.data.keywords
      });
    })
    .catch((err) => {
      throw err;
      console.log('unsuccessful get popularmentions')
    })
  }


  handleFilterClick (event, word) {
  // event.preventDefault();

  let key = event.target.className;
  let val = event.target.value;

  let filter = this.state[key];
  console.log(filter);

// console.log(event.target.checked);
  if(event.target.checked === false ) {
    filter = this.state[key].filter(item => item !== val);
    console.log('filtered resp', filter);
  }

  // if(event.target.checked === true && key === "languageFilter") {
  //   this.state[key] = val;
  //   filter = val;
  // }
  if(event.target.checked === true && filter.includes(val) === false){
    filter.push(val);
  }

  //can only be selected // should be switched to a toggle eventually

  let reqQuery =  {
    travelerRating: this.state.travelerRatingFilter,
    travelerType: this.state.travelerTypeFilter,
    timeOfYearFilter: this.state.timeOfYearFilter,
    reviewLanguage: this.state.languageFilter,
    reviewText: this.state.popularMentionsFilter
  };

   this.setState({
    [key]: filter,
    allFilters: reqQuery
    });

  };


  handleSearchChange (e) {
    event.preventDefault();
    if(e.key === "Enter"){
      alert("Enter was just pressed.");
    } else {
      this.setState({
        query: [e.target.value]
      });
    }
  }

  //onkeypress can detect enter
  //onchange detects everything but is not submitting form on enter

  handleSearchSubmit (event) {
    if(event.key === "Enter"){
      event.preventDefault()
      const formData = new FormData(event.target)
      console.log(formData);
    }
  };



  componentDidMount() {
    this.setState ({
      allFilters: {}
    });

    this.getMetrics(this.state.attractionID);
    this.getReviews(this.state.attractionID);
    this.getPopularMentions(this.state.attractionID);
  }


  componentDidUpdate(prevProps, prevState) {
    if(prevState.allFilters !== this.state.allFilters) {
      this.getReviews(this.state.attractionID, this.state.allFilters);
      console.log('component did update');
    }
  }




  render() {

    return (
      <ReviewsModuleWrapper>
        <div className="filtersAndReviewsList">

          <div className="filterReviews">
            <div className ="mainFilters">
              <h1>Reviews</h1>
              <hr />
              <AllForms ratings={this.state.totalRatings} totalReviews={this.state.totalReviews} handleFilterClick={this.handleFilterClick} languages={this.state.totalLanguages} keywords={this.state.popularMentions}/>
            </div>
          </div>

          <div className="searchBar">
            <SearchBar handleSearchChange={this.handleSearchChange} selectedPopularMentions={this.state.popularMentionsFilter} handleSearchSubmit={this.handleSearchSubmit} query={this.state.query}/>
          </div>

           <div className="reviewsList">
             <ReviewsList reviewsList={this.state.reviewsList}/>
          </div>

        </div>

      </ReviewsModuleWrapper>
    )
  }


};


export default ReviewsModule;