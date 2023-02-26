import React, { Component } from 'react';
import axios from 'axios';
//import { useState } from 'react';

class Func extends Component {
// function indexes() {
//     const [seenIndexes, setIndexes] = useState([]);//return array
//     const [values, setValues] = useState({});//return list
//      const [keywords, setKeywords] = useState([]);
//      const [keyword, setKeyword] = useState();
    
    state = {
        seenKeywords: [],
        values: {},
        keyword: ''
    };

    componentDidMount() {
        this.fetchValues();
        this.fetchKeywords();
    }

    // Fetch calculated values (urls) from Python script & API (NLP analyssi)
    async fetchValues() {
        const values = await axios.get('/api/values/curent');
        this.setState({ values: values.data});
    }

    // Return all keywords submitted
    async fetchKeywords() {
        const seenKeywords = await axios.get('/api/values/all');
        this.setState({ seenKeywords: seenKeywords.data});
    }

    // useEffect(() => {
    //     fetchValues().then(setValues); //.then gets called on the proimise
    //   }, []);

    handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values', {
            keyword: this.state.keyword 
        });
        this.setState({ keyword: '' });
    };

    //Postgres returned
    renderSeenKeywords(){
        return this.state.seenKeywords.map( ( {word}) => word ).join(', ');//iterate over all and return string
    }

    //Redis returned, all previous historgrams
    renderValues() {
        const entries = [];
    
        for (let key in this.state.values) {
          entries.push(
            <div key={key}>
              For index {key} I calculated {this.state.values[key]}
            </div>
          );
        }
    
        return entries;
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
                {this.renderKeywords()}

                <h3>Values</h3>
                {this.renderValues()}
            </div>

        );
    }
}
export default Func;