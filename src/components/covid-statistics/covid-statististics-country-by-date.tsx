import { Component, h, State, Prop, Watch } from "@stencil/core";
import axios from 'axios';

@Component({
    tag: "covid-statististics-country-by-date",
    styleUrl: "covid-statististics-country-by-date.css",
    shadow: true
})

export class CovidStatisticsByDate {
    @Prop() Parameter: string;
    @State() Statistics_keys: string[];
    @State() country_statistics_by_Date: object;
    @State() countries_list: string[] = [];
    @State() country: string = '';
    @State() Statisticsdate: string = '';
    @State() filteredList: string[];

    componentWillLoad() {
        this.parseMyArrayProp(this.Parameter);

    }



    @Watch('Parameter')
    parseMyArrayProp(newValue: string) {
        if (newValue) {
            this.Statistics_keys = JSON.parse(newValue);
        }
    }
    @Watch('country')
    parseMyState() {
        if (JSON.parse(sessionStorage.getItem("countries-list")) &&
            this.countries_list.length != JSON.parse(sessionStorage.getItem("countries-list")).length) {
            this.countries_list = JSON.parse(sessionStorage.getItem("countries-list"));
        }

    }

    detectStatistics = (e) => {
        e.preventDefault();
        axios.get('https://covid-193.p.rapidapi.com/history',
            {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '70dffa7a2cmsh769a063882a20bep1f10ccjsn21e8277a120d'
                },
                params: { country: this.country, day: this.Statisticsdate }
            }
        ).then((res) => this.country_statistics_by_Date = res.data.response[0]).catch((err) => console.log(err))
    }

    searchCountry = (event) => {
        this.country = (event.target as HTMLInputElement).value;
        this.filteredList = this.countries_list.filter((country) => {
            if (this.country.length > 0 && country.toLowerCase().includes((event.target as HTMLInputElement).value.toLowerCase()))
                return country

        })
    }

    selectCountry = (country) => {
        this.country = country;
        this.filteredList = [];
    }
    selectStatisticsDate = (event) => {
        this.Statisticsdate = (event.target as HTMLInputElement).value;
    }
    render() {
        return (
            <div>
                <form onSubmit={this.detectStatistics} class="form-country-date">
                    <h5 class="heading-frm">COVID STATISTICS FOR COUNTRY BY DATE</h5>
                    <div>
                        <label class="lbl-form-txt">Country</label>
                        <input type="text" placeholder="Enter the country to Search" value={this.country}
                            onInput={this.searchCountry} required class="input-form-data"></input>
                    </div>
                    <div>
                        <label class="lbl-form-txt">Date</label>
                        <input type="date" placeholder="Please select the date" onInput={this.selectStatisticsDate}
                            value={this.Statisticsdate} required class="input-form-date"></input>
                    </div>
                    {this.filteredList && this.filteredList.length > 0 && <ul class="list-filter-country">
                        {this.filteredList.map((country) =>
                            <li onClick={() => this.selectCountry(country)} value={country} class="list-countries">{country}</li>)}
                    </ul>
                    }
                    <button class="btn-submit" type="submit">Retrieve Statistics</button>
                </form>
                {this.country_statistics_by_Date &&
                    <table class="tbl-statistics">
                        <thead><th class="heading-tbl" colSpan={2} >COVID Statistics for {this.country}</th></thead>
                        {this.Statistics_keys.map(element =>
                            <tr class="heading-row">
                                <td class="heading-element">{element == "time" ? "Day/Time" : element}</td>
                                <td class="heading-element">{element == "cases" || element == "deaths" || element == "tests" ?
                                    this.country_statistics_by_Date[element]["total"] ? this.country_statistics_by_Date[element]["total"] : "NA" :
                                    this.country_statistics_by_Date[element] ? this.country_statistics_by_Date[element] : "NA"}</td>
                            </tr>)}

                    </table>
                }
            </div>
        )
    }
}