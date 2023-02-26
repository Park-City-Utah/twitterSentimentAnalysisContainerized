import { Component } from 'react';
import axios from 'axios';

class Funct extends Component {
    
    state = {
        seenIndexes: [],
        values: {},
        index: '',
        keywords: [],
        keyword: ''
    };

    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
        this.fetchKeywords();
    }


    async fetchKeywords() {
        const seenIndexes = await axios.get('/api/values/all');
        this.setState({ seenIndexes: seenIndexes.data});
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values', {
            keyword: this.state.keyword 
        });
        this.setState({ keyword: '' });
    };

    //Postgres returned
    renderKeywords(){
        return this.state.keywords.map( ( {word}) => word ).join(', ');//iterate over all and return string
    }

    //Redis returned, all previous historgrams
    renderHistograms(){
        const histograms = [];

        for (let key in this.state.keywords) {
            histograms.push(
                <div key={key}>
                    For {key} in {this.state.keywords[key]}
                </div>   
            );         
        }
        return histograms;
    }

    render() {
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your keyword:</label>
                    <input
                        value={this.state.keyword}
                        onChange={event => this.setState({ keyword: event.target.value })}
                    />
                    <button>Submit</button>
                </form>

                <h3>Keywords previously analyzed:</h3>
                {this.renderKeywords}

                <h3>Histogram</h3>
                {this.renderHistogram}
            </div>

        );
    }
}
export default Funct;