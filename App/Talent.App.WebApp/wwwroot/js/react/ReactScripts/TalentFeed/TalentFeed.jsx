import React from 'react';
import Cookies from 'js-cookie'
import { Grid, Container } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import TalentCard from '../TalentFeed/TalentCard.jsx';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';


export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")
        loader.isLoading = false;

        this.state = {
            loadNumber: 5,
            loadPosition: 0,
            feedData: [],
            hasMoreFeedData: true,
            loadingFeedData: false,

            loaderData: loader,
            companyDetails: null,
            watchlist: []
        }
        this.init = this.init.bind(this);
        this.getTalentSnapshotList = this.getTalentSnapshotList.bind(this);
        this.getTalentSnapshotListError = this.getTalentSnapshotListError.bind(this);
        this.getCompanyData = this.getCompanyData.bind(this);
    };

    getTalentSnapshotList(position, number) {
        if (this.state.loadingFeedData || !this.state.hasMoreFeedData) return;
        this.setState({ loadingFeedData: true });
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: `http://localhost:60290/profile/profile/getTalent?position=${position}&number=${number}`,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    if (res.data) {
                        this.setState({
                            loadPosition: position + res.data.length,
                            feedData: this.state.feedData.concat(res.data),
                            hasMoreFeedData: true,
                            loadingFeedData: false
                        });
                    } else {
                        this.getTalentSnapshotListError();
                    }
                } else {
                    this.getTalentSnapshotListError(res.message);
                }
            }.bind(this),
            error: function (res) {
                this.getTalentSnapshotListError("Can't fetch talent data: " + res.status);
            }.bind(this)
        }); 
    };

    getTalentSnapshotListError(error = null) {
        if (error) TalentUtil.notification.show(error, "error", null, null);
        this.setState({ hasMoreFeedData: false, loadingFeedData: false });
    }

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this
    }

    getCompanyData() {
        if (this.state.loaderData.isLoading) return;
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = true;
        this.setState({ loaderData });
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('talentAuthToken'),
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                if (res.success && res.employer) {
                    this.setState({ companyDetails: res.employer });
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null);
                }
                let loaderData = TalentUtil.deepCopy(this.state.loaderData)
                loaderData.isLoading = false;
                this.setState({ loaderData });
            }.bind(this),
            error: function (res) {
                TalentUtil.notification.show("Can't fetch company data: " + res.status, "error", null, null);
                let loaderData = TalentUtil.deepCopy(this.state.loaderData)
                loaderData.isLoading = false;
                this.setState({ loaderData });
            }.bind(this)
        });
    }

    componentDidMount() {
        this.getCompanyData();
        this.getTalentSnapshotList(this.state.loadPosition, this.state.loadNumber);
    };

    render() {
        console.log("Talent Feed: ", this.state);
        let talents;
        if (this.state.feedData.length == 0) {
            talents = <div><b>There are no talents found for your recruitment company</b></div>;
        } else {
            talents = <InfiniteScroll
                pageStart={0}
                loadMore={() => this.getTalentSnapshotList(this.state.loadPosition, this.state.loadNumber)}
                hasMore={this.state.hasMoreFeedData}
                loader={<div className="loader" key={0}>Loading ...</div>}
            >
                {
                    this.state.feedData.map((value, index) => <TalentCard talent={value} key={index} />)
                }
            </InfiniteScroll>
        }
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <Grid centered>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <Container loading="true">
                                    <CompanyProfile companyDetails={this.state.companyDetails}/>
                                </Container>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Container>
                                    {talents}
                                </Container>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Container>
                                    <FollowingSuggestion/>
                                </Container>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                        </Grid.Row>
                    </Grid>
                </div>
            </BodyWrapper>
        )
    }
}