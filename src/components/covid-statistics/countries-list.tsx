import { Component, Fragment, h, State } from "@stencil/core";
import axios from "axios";
//import axios from 'axios';

@Component({
    tag: "countries-list",
    shadow: true
})

export class CountriesList {

    @State() CountryList: String[];

    componentWillLoad() {
        axios.get('https://covid-193.p.rapidapi.com/countries',
            {
                method: "GET", headers: {
                    'x-rapidapi-key': '70dffa7a2cmsh769a063882a20bep1f10ccjsn21e8277a120d'
                }
            }).then((response) => {
                this.CountryList = response.data.response;
                sessionStorage.setItem('countries-list', JSON.stringify(this.CountryList))
            }).catch(err => console.log(err))

    }


    render() {
        return (
            <Fragment>
            </Fragment>
        )
    }
}