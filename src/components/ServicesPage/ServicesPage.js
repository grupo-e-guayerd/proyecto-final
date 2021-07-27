import React, { Component } from "react";
import ProfessionalList from "../ProfessionalList/ProfessionalList";
import Search from "../Search/Search";
import SideBar from "../SideBar/SideBar";
import ButtonUp from "../ButtonUp/ButtonUp";

export default class ServicesPage extends Component {
  constructor() {
    super();
    this.state = {
      arrayResponse: [],
      arrayWorkersToShow: [],

      categoryArray: [],
    };
  }

  normalizeString = (string) => {
    return string
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  searchHandler = (subjectValue, searchValue) => {
    subjectValue = this.normalizeString(subjectValue);
    searchValue = this.normalizeString(searchValue);

    fetch(
      `http://localhost:3001/professionals/${subjectValue}${searchValue}`
    ) /* TODO */
      .then((response) => response.json())
      .then((jsonResponse) => {
        jsonResponse[0] && this.setState({ arrayWorkersToShow: jsonResponse });
      })
      .catch((error) => {
        /* TODO catch handler */
      });
  };

  componentDidMount() {
    fetch("http://localhost:3001/categories") /* TODO */
      .then((response) => response.json())
      .then((jsonResponse) => {
        this.setState({ categoryArray: jsonResponse });
      })
      .catch((error) => {
        /* TODO catch handler */
      });

    let SUBJECT_SEARCH = null;
    let USER_SEARCH = null;

    fetch("http://localhost:3001/professionals") /* TODO */
      .then((response) => response.json())
      .then((jsonResponse) => {
        jsonResponse[0] && this.setState({ arrayResponse: jsonResponse });

        SUBJECT_SEARCH = localStorage.getItem("subjectSearch");
        USER_SEARCH = localStorage.getItem("userSearch");
        localStorage.removeItem("subjectSearch");
        localStorage.removeItem("userSearch");

        if (SUBJECT_SEARCH && USER_SEARCH) {
          SUBJECT_SEARCH = this.normalizeString(SUBJECT_SEARCH);
          USER_SEARCH = this.normalizeString(USER_SEARCH);

          fetch(
            `http://localhost:3001/professionals/${SUBJECT_SEARCH}${USER_SEARCH}`
          ) /* TODO */
            .then((response) => response.json())
            .then((jsonResponse) => {
              jsonResponse[0] &&
                this.setState({ arrayWorkersToShow: jsonResponse });
            })
            .catch((error) => {
              /* TODO catch handler */
            });
        }
      })
      .catch((error) => {
        /* TODO catch handler */
      });
  }

  render() {
    let { categoryArray, arrayResponse, arrayWorkersToShow } = this.state;
    arrayWorkersToShow = arrayWorkersToShow.filter((worker) => {
      return worker.status === true;
    });
    return (
      <div className="service-page-container">
        <ButtonUp />

        <SideBar
          categoryArray={categoryArray}
          arrayWorkers={arrayResponse}
          searchHandler={this.searchHandler}
        />

        <div className="services-box-GE">
          <div className="search-services-container">
            <Search
              placeholder="Busca por categoría"
              searchHandler={this.searchHandler}
            />
          </div>
          <ProfessionalList
            loadData={this.props.loadData}
            arrayWorkersToShow={
              arrayWorkersToShow.length > 0 ? arrayWorkersToShow : arrayResponse
            }
          />
        </div>
      </div>
    );
  }
}
