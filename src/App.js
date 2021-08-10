import React, { useEffect, useState } from 'react';
import { Input } from 'semantic-ui-react';
import axios from 'axios'

const App = (props) => {
    const DEFAULT_HEADER = () => {
        const finalToken = "";
        return { headers:
            {
                "Authorization": "Bearer "+finalToken
            },
            timeout:120000
        }
    }
    const DEFAULT_PAYLOAD = () => {
        return {
            "operationName": "GetAxieLatest",
            "variables": {
                "from": 0,
                "size": 100,
                "sort": "Latest",
                "auctionType": "Sale"
            },
            "query": "query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieRowData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieRowData on Axie {\n  id\n  image\n  class\n  name\n  genes\n  owner\n  class\n  stage\n  title\n  breedCount\n  level\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n"
        }
    }

    const backStep = (e) => {
        e.preventDefault();
        const payload = DEFAULT_PAYLOAD();
        const header = DEFAULT_HEADER();

        axios.post('https://axieinfinity.com/graphql-server-v2/graphql', { data: payload }, header)
            .then(async res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })

    }

  return (
    <div className="app">
    <h3>Search the lowest price of axies on the market!</h3>
    <Input
        placeholder="Enter amount in USD"
      />
      <button className="ui primary button" type="button"  onClick={backStep}>Filter</button>

      <table class="ui celled table">
          <thead class="">
          <tr class="">
              <th class="">Header</th>
              <th class="">Header</th>
              <th class="">Header</th>
          </tr>
      </thead>
      <tbody class="">
          <tr class="">
              <td class=""></td>
              <td class="">Cell</td>
              <td class="">Cell</td>
          </tr>
          <tr class="">
              <td class="">Cell</td>
              <td class="">Cell</td>
              <td class="">Cell</td>
          </tr>
          <tr class="">
              <td class="">Cell</td>
              <td class="">Cell</td>
              <td class="">Cell</td>
          </tr>
      </tbody>
      </table>
    </div>
  );
}

export default App;
